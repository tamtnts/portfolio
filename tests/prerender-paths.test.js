import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  normalizeBasePath,
  resolveStaticFilePath,
  toPrerenderUrl,
} from '../scripts/prerender-paths.js';

test('normalizes Vite base paths and prerender route URLs', () => {
  assert.equal(normalizeBasePath('portfolio'), '/portfolio/');
  assert.equal(normalizeBasePath('//portfolio//'), '/portfolio/');
  assert.equal(normalizeBasePath(''), '/');
  assert.equal(toPrerenderUrl('/', '/portfolio/'), '/portfolio/');
  assert.equal(
    toPrerenderUrl('/projects/fleet-data-intelligence-hub', '/portfolio/'),
    '/portfolio/projects/fleet-data-intelligence-hub',
  );
});

test('resolves only contained base-prefixed static asset paths', () => {
  const tempDir = mkdtempSync(join(tmpdir(), 'portfolio-prerender-'));
  const distDir = join(tempDir, 'dist');
  const asset = join(distDir, 'assets', 'index.js');
  mkdirSync(join(distDir, 'assets'), { recursive: true });
  writeFileSync(asset, 'export {};');

  try {
    assert.equal(resolveStaticFilePath(distDir, '/portfolio/assets/index.js', '/portfolio/'), asset);
    assert.equal(resolveStaticFilePath(distDir, '/assets/index.js', '/'), asset);

    for (const pathname of [
      '/assets/index.js',
      '/portfoliox/assets/index.js',
      '/portfolio/../outside.js',
      '/portfolio/assets/../index.js',
      '/portfolio/%2e%2e/outside.js',
      '/portfolio/%2f..%2foutside.js',
      '/portfolio/%E0%A4%A',
      '/portfolio/%5cwindows.js',
      '/portfolio/C:%2fwindows.js',
    ]) {
      assert.equal(resolveStaticFilePath(distDir, pathname, '/portfolio/'), null, pathname);
    }
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test('rejects static assets that escape dist through a symlink or junction', (t) => {
  const tempDir = mkdtempSync(join(tmpdir(), 'portfolio-prerender-'));
  const distDir = join(tempDir, 'dist');
  const outsideFile = join(tempDir, 'outside.js');
  const link = join(distDir, 'assets', 'escape.js');
  mkdirSync(join(distDir, 'assets'), { recursive: true });
  writeFileSync(outsideFile, 'export {};');

  try {
    try {
      symlinkSync(outsideFile, link, 'file');
    } catch (error) {
      if (error?.code === 'EPERM' || error?.code === 'EACCES') {
        t.skip('Symlink creation is not permitted by this operating system configuration.');
        return;
      }
      throw error;
    }
    assert.equal(resolveStaticFilePath(distDir, '/portfolio/assets/escape.js', '/portfolio/'), null);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});
