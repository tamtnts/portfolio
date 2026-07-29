import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('prerendering enforces the GitHub Pages publishing contract', async () => {
  const prerender = await readFile(
    new URL('../scripts/prerender.js', import.meta.url),
    'utf8',
  );
  const entry = await readFile(
    new URL('../src/main.jsx', import.meta.url),
    'utf8',
  );

  assert.match(prerender, /normalizeBasePath/);
  assert.match(prerender, /validatePrerenderedHtml/);
  assert.match(prerender, /server\.listen\(PORT, '127\.0\.0\.1'/);
  assert.doesNotMatch(prerender, /waitForTimeout\s*\(\s*1500\s*\)/);
  assert.match(prerender, /waitForFunction/);
  assert.match(prerender, /data-diagram-status/);
  assert.match(prerender, /c4Levels/);
  assert.match(entry, /location: window\.location\.pathname, basename: import\.meta\.env\.BASE_URL/);
});
