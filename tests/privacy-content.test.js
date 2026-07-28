import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { scanPublishableContent } from '../scripts/privacy-scanner.js';

const root = new URL('../', import.meta.url);
const execFileAsync = promisify(execFile);
const forbiddenFingerprints = [
  [12, 3805401364, 2869398],
  [8, 1899127545, 479679949],
  [10, 3226578794, 2326618614],
  [17, 2394731075, 1320841263],
  [21, 3043783325, 722152783],
  [18, 2284759960, 3835361618],
  [10, 3152765206, 1134247266],
  [10, 2268324061, 2041240491],
  [21, 2262463286, 3805970502],
  [8, 1169559499, 1826898499],
  [27, 2917820166, 1785335738],
  [4, 1816428836, 2085467056],
  [19, 405486669, 3227277297],
  [20, 2926039294, 2881884172],
  [20, 2179689245, 429797887],
  [32, 1847093991, 2514252251],
  [9, 4142694780, 2371706460],
  [16, 1048116157, 1907713097],
  [15, 3344518971, 1414395131],
  [29, 1954747953, 2841850537],
  [36, 4181196539, 1214378117],
  [23, 1345889900, 2990586968],
  [22, 2081548490, 4177368128],
];

const forbiddenPatterns = [
  ['private network URL', /https?:\/\/(?:10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.)/i],
  ['credential-like material', /x-amz-(?:credential|signature)|authorization:\s*bearer|client[_-]?secret|secret[_-]?key/i],
  ['private Windows source path', /\b[a-z]:\\(?:project-\d+|users\\[^\\]+\\(?:downloads|desktop))\\/i],
];

test('public repository tree contains no private or legacy identifiers', async () => {
  const rootDir = fileURLToPath(root);
  const { stdout } = await execFileAsync('git', ['ls-files', '-z'], {
    cwd: rootDir,
    windowsHide: true,
  });
  const scanRoots = stdout.split('\0').filter(Boolean);

  const violations = await scanPublishableContent({
    rootDir,
    scanRoots,
    forbiddenFingerprints,
    forbiddenPatterns,
  });
  assert.deepEqual(violations, []);
});
