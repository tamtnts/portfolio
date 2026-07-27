import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { extname, relative } from 'node:path';

const root = new URL('../', import.meta.url);
const scanRoots = ['src/', 'public/', 'scripts/', '.github/', 'index.html', 'README.md'];
const textExtensions = new Set([
  '.js',
  '.jsx',
  '.css',
  '.html',
  '.md',
  '.txt',
  '.xml',
  '.yml',
  '.yaml',
  '.svg',
]);
const forbidden = [
  ['Ngo', 'Tan', 'Phuc'].join(' '),
  ['Ngo', 'Phuc'].join(' '),
  ['NgoTan', 'Phuc'].join(''),
  ['ngotan', 'phuc'].join(''),
  ['phuc-nt', 'gitlab.io'].join('.'),
  ['tan', 'phuc16797', 'gmail.com'].join(''),
  ['phuc-ngo', '5a494b189'].join('-'),
  ['0949', '646351'].join(''),
  ['AMIT', 'Group'].join(' '),
  ['Industrial', 'University'].join(' '),
  ['Bien', 'Hoa'].join(' '),
  ['CV_', 'NGOTANPHUC', '_2026_JAVA.pdf'].join(''),
  ['Git', 'Lab'].join(''),
  '/cv/',
  'iot-event-ingestion',
  'iot-command-delivery',
  'geo-search-evolution',
  'wallet-withdraw-transaction-flow',
];

async function collect(entryUrl) {
  const entryStat = await stat(entryUrl);
  if (entryStat.isFile()) return [entryUrl];

  const entries = await readdir(entryUrl, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) =>
      collect(new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, entryUrl)),
    ),
  );
  return nested.flat();
}

test('publishable repository content contains no legacy profile artifacts', async () => {
  const roots = scanRoots.map((item) => new URL(item, root));
  const files = (await Promise.all(roots.map(collect)))
    .flat()
    .filter((url) => textExtensions.has(extname(url.pathname)));
  const violations = [];

  for (const file of files) {
    const content = await readFile(file, 'utf8');
    for (const token of forbidden) {
      if (content.toLowerCase().includes(token.toLowerCase())) {
        violations.push(
          `${relative(new URL('.', root).pathname, file.pathname)} -> ${token}`,
        );
      }
    }
  }

  assert.deepEqual(violations, []);
});
