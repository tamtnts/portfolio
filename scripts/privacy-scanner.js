import { lstat, readdir, readFile } from 'node:fs/promises';
import { relative, resolve, sep } from 'node:path';

const defaultFsOperations = { lstat, readdir, readFile };

const binarySignatures = [
  [0x25, 0x50, 0x44, 0x46, 0x2d], // PDF: %PDF-
  [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], // PNG
  [0xff, 0xd8, 0xff], // JPEG
  [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], // GIF87a
  [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], // GIF89a
  [0x50, 0x4b, 0x03, 0x04], // ZIP
  [0x1f, 0x8b], // GZIP
  [0x7f, 0x45, 0x4c, 0x46], // ELF
  [0x77, 0x4f, 0x46, 0x46], // WOFF
  [0x77, 0x4f, 0x46, 0x32], // WOFF2
];

function hasPrefix(bytes, signature) {
  return bytes.length >= signature.length
    && signature.every((byte, index) => bytes[index] === byte);
}

function isRecognizedBinary(bytes) {
  if (binarySignatures.some((signature) => hasPrefix(bytes, signature))) return true;
  return bytes.length >= 12
    && String.fromCharCode(...bytes.subarray(0, 4)) === 'RIFF'
    && String.fromCharCode(...bytes.subarray(8, 12)) === 'WEBP';
}

function bomlessUtf16Encoding(bytes) {
  if (bytes.length < 4 || bytes.length % 2 !== 0) return null;
  const pairs = bytes.length / 2;
  let evenZeros = 0;
  let oddZeros = 0;
  for (let index = 0; index < bytes.length; index += 2) {
    if (bytes[index] === 0) evenZeros += 1;
    if (bytes[index + 1] === 0) oddZeros += 1;
  }
  if (oddZeros / pairs >= 0.6 && evenZeros / pairs <= 0.1) return 'utf-16le';
  if (evenZeros / pairs >= 0.6 && oddZeros / pairs <= 0.1) return 'utf-16be';
  return null;
}

function decodeText(bytes) {
  if (isRecognizedBinary(bytes)) return null;
  let encoding = 'utf-8';
  let content = bytes;
  if (hasPrefix(bytes, [0xef, 0xbb, 0xbf])) {
    content = bytes.subarray(3);
  } else if (hasPrefix(bytes, [0xff, 0xfe])) {
    encoding = 'utf-16le';
    content = bytes.subarray(2);
  } else if (hasPrefix(bytes, [0xfe, 0xff])) {
    encoding = 'utf-16be';
    content = bytes.subarray(2);
  } else {
    encoding = bomlessUtf16Encoding(bytes) || encoding;
  }
  return new TextDecoder(encoding, { fatal: true }).decode(content);
}

function toLabel(rootDir, entryPath) {
  return relative(rootDir, entryPath).split(sep).join('/');
}

export function fnv1a(value) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function djb2(value) {
  let hash = 5381;
  for (let index = 0; index < value.length; index += 1) {
    hash = (Math.imul(hash, 33) ^ value.charCodeAt(index)) >>> 0;
  }
  return hash >>> 0;
}

export function fingerprintFor(value) {
  const normalized = value.toLowerCase();
  return [normalized.length, fnv1a(normalized), djb2(normalized)];
}

export function containsFingerprint(content, [length, expectedFnv, expectedDjb]) {
  const normalized = content.toLowerCase();
  for (let index = 0; index <= normalized.length - length; index += 1) {
    const candidate = normalized.slice(index, index + length);
    if (fnv1a(candidate) === expectedFnv && djb2(candidate) === expectedDjb) return true;
  }
  return false;
}

export function symbolicLinkViolation(label) {
  return `${label} -> symbolic link not allowed`;
}

async function scanEntry(rootDir, entryPath, options, fsOperations, violations) {
  const label = toLabel(rootDir, entryPath);
  let entryStat;
  try {
    entryStat = await fsOperations.lstat(entryPath);
  } catch {
    violations.push(`${label} -> unreadable entry`);
    return;
  }

  if (entryStat.isSymbolicLink()) {
    violations.push(symbolicLinkViolation(label));
    return;
  }

  if (entryStat.isDirectory()) {
    let entries;
    try {
      entries = await fsOperations.readdir(entryPath, { withFileTypes: true });
    } catch {
      violations.push(`${label} -> unreadable directory`);
      return;
    }
    entries.sort((left, right) => (left.name < right.name ? -1 : left.name > right.name ? 1 : 0));
    for (const entry of entries) {
      const nestedPath = resolve(entryPath, entry.name);
      if (entry.isSymbolicLink()) {
        violations.push(symbolicLinkViolation(toLabel(rootDir, nestedPath)));
      } else {
        await scanEntry(rootDir, nestedPath, options, fsOperations, violations);
      }
    }
    return;
  }

  if (!entryStat.isFile()) {
    violations.push(`${label} -> unsupported entry type`);
    return;
  }

  let bytes;
  try {
    bytes = await fsOperations.readFile(entryPath);
  } catch {
    violations.push(`${label} -> unreadable entry`);
    return;
  }

  let content;
  try {
    content = decodeText(bytes);
  } catch {
    violations.push(`${label} -> unreadable text encoding`);
    return;
  }
  if (content === null) return;

  for (const fingerprint of options.forbiddenFingerprints) {
    if (containsFingerprint(content, fingerprint)) {
      violations.push(`${label} -> forbidden identifier fingerprint`);
    }
  }
  for (const [name, pattern] of options.forbiddenPatterns) {
    pattern.lastIndex = 0;
    if (pattern.test(content)) violations.push(`${label} -> ${name}`);
  }
}

export async function scanPublishableContent({
  rootDir,
  scanRoots,
  forbiddenFingerprints = [],
  forbiddenPatterns = [],
  fsOperations = defaultFsOperations,
}) {
  const resolvedRoot = resolve(rootDir);
  const violations = [];
  for (const scanRoot of scanRoots) {
    await scanEntry(
      resolvedRoot,
      resolve(resolvedRoot, scanRoot),
      { forbiddenFingerprints, forbiddenPatterns },
      fsOperations,
      violations,
    );
  }
  return violations;
}
