import test from 'node:test';
import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  fingerprintFor,
  scanPublishableContent,
  symbolicLinkViolation,
} from '../scripts/privacy-scanner.js';

const harmlessToken = 'synthetic-privacy-token';
const harmlessFingerprint = fingerprintFor(harmlessToken);

async function withFixture(run) {
  const rootDir = await mkdtemp(join(tmpdir(), 'privacy-scanner-'));
  try {
    await run(rootDir);
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
}

function utf16be(value) {
  const littleEndian = Buffer.from(value, 'utf16le');
  for (let index = 0; index < littleEndian.length; index += 2) {
    [littleEndian[index], littleEndian[index + 1]] = [
      littleEndian[index + 1], littleEndian[index],
    ];
  }
  return littleEndian;
}

test('detects fingerprints in regular files regardless of extension or supported encoding', async () => {
  await withFixture(async (rootDir) => {
    const fixtureDir = join(rootDir, 'fixture');
    await mkdir(fixtureDir);
    await writeFile(join(fixtureDir, 'normal.js'), harmlessToken);
    await writeFile(join(fixtureDir, 'unfamiliar.rst'), harmlessToken);
    await writeFile(join(fixtureDir, 'archive.bak'), harmlessToken);
    await writeFile(join(fixtureDir, 'extensionless'), harmlessToken);
    await writeFile(join(fixtureDir, 'gif8-text.txt'), `GIF8${harmlessToken}`);
    await writeFile(
      join(fixtureDir, 'utf8-bom.txt'),
      Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from(`first\r\n${harmlessToken}\r\n`)]),
    );
    await writeFile(
      join(fixtureDir, 'utf16le.txt'),
      Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from(harmlessToken, 'utf16le')]),
    );
    await writeFile(
      join(fixtureDir, 'utf16be.txt'),
      Buffer.concat([Buffer.from([0xfe, 0xff]), utf16be(harmlessToken)]),
    );
    await writeFile(join(fixtureDir, 'utf16le-no-bom.raw'), Buffer.from(harmlessToken, 'utf16le'));
    await writeFile(join(fixtureDir, 'utf16be-no-bom.raw'), utf16be(harmlessToken));

    const violations = await scanPublishableContent({
      rootDir,
      scanRoots: ['fixture/'],
      forbiddenFingerprints: [harmlessFingerprint],
    });

    assert.deepEqual(violations, [
      'fixture/archive.bak -> forbidden identifier fingerprint',
      'fixture/extensionless -> forbidden identifier fingerprint',
      'fixture/gif8-text.txt -> forbidden identifier fingerprint',
      'fixture/normal.js -> forbidden identifier fingerprint',
      'fixture/unfamiliar.rst -> forbidden identifier fingerprint',
      'fixture/utf16be-no-bom.raw -> forbidden identifier fingerprint',
      'fixture/utf16be.txt -> forbidden identifier fingerprint',
      'fixture/utf16le-no-bom.raw -> forbidden identifier fingerprint',
      'fixture/utf16le.txt -> forbidden identifier fingerprint',
      'fixture/utf8-bom.txt -> forbidden identifier fingerprint',
    ]);
  });
});

test('skips recognized binary content', async () => {
  await withFixture(async (rootDir) => {
    const fixtureDir = join(rootDir, 'fixture');
    await mkdir(fixtureDir);
    await writeFile(
      join(fixtureDir, 'image.blob'),
      Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.from(harmlessToken)]),
    );
    await writeFile(
      join(fixtureDir, 'image.gif'),
      Buffer.concat([Buffer.from('GIF89a'), Buffer.from(harmlessToken)]),
    );

    const violations = await scanPublishableContent({
      rootDir,
      scanRoots: ['fixture/'],
      forbiddenFingerprints: [harmlessFingerprint],
    });

    assert.deepEqual(violations, []);
  });
});

test('fails closed for malformed or unsupported text bytes', async () => {
  await withFixture(async (rootDir) => {
    const fixtureDir = join(rootDir, 'fixture');
    await mkdir(fixtureDir);
    await writeFile(join(fixtureDir, 'invalid.data'), Buffer.from([0xc3, 0x28]));

    const violations = await scanPublishableContent({ rootDir, scanRoots: ['fixture/'] });

    assert.deepEqual(violations, ['fixture/invalid.data -> unreadable text encoding']);
  });
});

test('uses a UTF-8 BOM before considering the BOM-less UTF-16 heuristic', async () => {
  await withFixture(async (rootDir) => {
    const fixtureDir = join(rootDir, 'fixture');
    await mkdir(fixtureDir);
    const alternatingNuls = '\0X'.repeat(50);
    await writeFile(
      join(fixtureDir, 'utf8-bom-precedence.data'),
      Buffer.concat([
        Buffer.from([0xef, 0xbb, 0xbf]),
        Buffer.from(`${alternatingNuls}${harmlessToken}`),
      ]),
    );

    const violations = await scanPublishableContent({
      rootDir,
      scanRoots: ['fixture/'],
      forbiddenFingerprints: [harmlessFingerprint],
    });

    assert.deepEqual(violations, [
      'fixture/utf8-bom-precedence.data -> forbidden identifier fingerprint',
    ]);
  });
});

test('symlink policy rejects file, directory, and cyclic labels without target details', () => {
  assert.deepEqual([
    symbolicLinkViolation('fixture/file-link'),
    symbolicLinkViolation('fixture/directory-link'),
    symbolicLinkViolation('fixture/cyclic-link'),
  ], [
    'fixture/file-link -> symbolic link not allowed',
    'fixture/directory-link -> symbolic link not allowed',
    'fixture/cyclic-link -> symbolic link not allowed',
  ]);
});

test('rejects injected Dirent and lstat symlinks without reading or traversing targets', async () => {
  const rootDir = join(tmpdir(), 'privacy-scanner-no-follow');
  const fixtureDir = join(rootDir, 'fixture');
  const directLink = join(rootDir, 'direct-link');
  const calls = { lstat: [], readdir: [], readFile: [] };
  const directory = { isSymbolicLink: () => false, isDirectory: () => true, isFile: () => false };
  const link = { isSymbolicLink: () => true, isDirectory: () => false, isFile: () => false };

  const violations = await scanPublishableContent({
    rootDir,
    scanRoots: ['fixture/', 'direct-link'],
    fsOperations: {
      lstat: async (entryPath) => {
        calls.lstat.push(entryPath);
        if (entryPath === fixtureDir) return directory;
        if (entryPath === directLink) return link;
        throw new Error('A symlink target was traversed.');
      },
      readdir: async (entryPath) => {
        calls.readdir.push(entryPath);
        assert.equal(entryPath, fixtureDir);
        return [
          { name: 'file-link', ...link },
          { name: 'directory-link', ...link },
          { name: 'cyclic-link', ...link },
        ];
      },
      readFile: async (entryPath) => {
        calls.readFile.push(entryPath);
        throw new Error('A symlink target was read.');
      },
    },
  });

  assert.deepEqual(violations, [
    'fixture/cyclic-link -> symbolic link not allowed',
    'fixture/directory-link -> symbolic link not allowed',
    'fixture/file-link -> symbolic link not allowed',
    'direct-link -> symbolic link not allowed',
  ]);
  assert.deepEqual(calls.lstat, [fixtureDir, directLink]);
  assert.deepEqual(calls.readdir, [fixtureDir]);
  assert.deepEqual(calls.readFile, []);
});

test('rejects a symlink without reading its target', async (t) => {
  await withFixture(async (rootDir) => {
    const outsidePath = join(rootDir, 'outside.txt');
    const fixtureDir = join(rootDir, 'fixture');
    await mkdir(fixtureDir);
    await writeFile(outsidePath, harmlessToken);

    try {
      await symlink(outsidePath, join(fixtureDir, 'external-link'), 'file');
    } catch (error) {
      if (error?.code === 'EPERM') {
        t.skip('Symlink creation is not permitted by this operating system configuration.');
        return;
      }
      throw error;
    }

    const violations = await scanPublishableContent({
      rootDir,
      scanRoots: ['fixture/'],
      forbiddenFingerprints: [harmlessFingerprint],
    });

    assert.deepEqual(violations, ['fixture/external-link -> symbolic link not allowed']);
  });
});
