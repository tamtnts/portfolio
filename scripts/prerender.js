import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import process from 'node:process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 3456;

const ROUTES = [
  '/',
  '/projects/fleet-operations-platform',
  '/projects/fleetops-data-hub',
];

const MIME_TYPES = {
  js: 'application/javascript',
  css: 'text/css',
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  json: 'application/json',
  pdf: 'application/pdf',
};

function serve(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // Try to serve static assets directly
  if (pathname.match(/\.\w+$/) && !pathname.endsWith('/')) {
    try {
      const filePath = resolve(__dirname, '../dist', pathname.slice(1));
      const content = readFileSync(filePath);
      const ext = pathname.split('.').pop();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      res.end(content);
      return;
    } catch {
      // fall through to SPA fallback
    }
  }

  // SPA fallback: serve index.html for all routes
  const html = readFileSync(resolve(__dirname, '../dist/index.html'), 'utf-8');
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

const server = createServer(serve);

server.listen(PORT, async () => {
  console.log(`Prerender server running on http://localhost:${PORT}`);

  const launchOptions = {};
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) {
    launchOptions.executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  }

  const browser = await chromium.launch(launchOptions);

  for (const route of ROUTES) {
    const page = await browser.newPage();
    await page.addInitScript(() => {
      window.__PRERENDER__ = true;
    });
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle' });
    // Allow Helmet and any late-rendered content to settle
    await page.waitForTimeout(1500);

    // Clean up duplicate head tags (Helmet may leave stale tags from early renders)
    const html = await page.evaluate(() => {
      const getLastContent = (selector) => {
        const nodes = document.head.querySelectorAll(selector);
        if (!nodes.length) return null;
        const last = nodes[nodes.length - 1];
        return last.getAttribute ? last.getAttribute('content') : (last.textContent || '').trim();
      };

      const keepMatching = (selector, expected) => {
        if (expected == null) return;
        document.head.querySelectorAll(selector).forEach((node) => {
          const actual =
            node.tagName.toLowerCase() === 'title'
              ? (node.textContent || '').trim()
              : node.getAttribute('content');
          if (actual !== expected) node.remove();
        });
      };

      const expectedTitle = document.title;
      const expectedDesc = getLastContent('meta[name="description"]');
      const expectedOgTitle = getLastContent('meta[property="og:title"]');
      const expectedOgDesc = getLastContent('meta[property="og:description"]');
      const expectedOgType = getLastContent('meta[property="og:type"]');
      const expectedTwitterTitle = getLastContent('meta[name="twitter:title"]');
      const expectedTwitterDesc = getLastContent('meta[name="twitter:description"]');
      const expectedTwitterCard = getLastContent('meta[name="twitter:card"]');

      keepMatching('title', expectedTitle);
      keepMatching('meta[name="description"]', expectedDesc);
      keepMatching('meta[property="og:title"]', expectedOgTitle);
      keepMatching('meta[property="og:description"]', expectedOgDesc);
      keepMatching('meta[property="og:type"]', expectedOgType);
      keepMatching('meta[name="twitter:title"]', expectedTwitterTitle);
      keepMatching('meta[name="twitter:description"]', expectedTwitterDesc);
      keepMatching('meta[name="twitter:card"]', expectedTwitterCard);

      // Canonical links point to localhost during prerender — remove them.
      document.head.querySelectorAll('link[rel="canonical"]').forEach((node) => node.remove());

      // Remove duplicate JSON-LD scripts if any
      const jsonLdScripts = document.head.querySelectorAll('script[type="application/ld+json"]');
      for (let i = 1; i < jsonLdScripts.length; i++) {
        jsonLdScripts[i].remove();
      }

      return document.documentElement.outerHTML;
    });

    const outPath =
      route === '/'
        ? resolve(__dirname, '../dist/index.html')
        : resolve(__dirname, '../dist', route.replace(/^\//, ''), 'index.html');

    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, html);
    console.log(`Prerendered: ${route}`);

    await page.close();
  }

  await browser.close();
  server.close();
  console.log('Prerender complete.');
});
