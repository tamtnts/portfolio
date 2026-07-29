import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import process from 'node:process';
import { profile } from '../src/data/profile.js';
import { projects } from '../src/data/projects.js';
import { validatePrerenderedHtml } from './prerender-html.js';
import { withCleanup } from './prerender-lifecycle.js';
import {
  normalizeBasePath,
  resolveStaticFilePath,
  toPrerenderUrl,
} from './prerender-paths.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 3456;
const siteUrl = 'https://tamtnts.github.io/portfolio';
const basePath = normalizeBasePath(process.env.VITE_BASE);
const distDir = resolve(__dirname, '../dist');
const viteIndexShell = readFileSync(resolve(distDir, 'index.html'), 'utf8');

const ROUTES = [
  '/',
  '/projects/fleet-operations-core',
  '/projects/fleet-administration-dispatch',
  '/projects/fleet-data-intelligence-hub',
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

function expectedMetadataForRoute(route) {
  if (route === '/') {
    return {
      route,
      title: `${profile.name} - ${profile.role}`,
      canonical: `${siteUrl}/`,
      ogImage: `${siteUrl}/og.svg`,
    };
  }

  const slug = route.replace('/projects/', '');
  const project = projects.find((item) => item.slug === slug);
  if (!project) throw new Error(`No public metadata configured for ${route}.`);
  return {
    route,
    title: `${project.title} - Case Study | ${profile.name}`,
    canonical: `${siteUrl}/projects/${project.slug}`,
    ogImage: `${siteUrl}/og.svg`,
  };
}

function serve(req, res) {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  const pathname = url.pathname;

  if (pathname.match(/\.\w+$/) && !pathname.endsWith('/')) {
    try {
      const filePath = resolveStaticFilePath(distDir, pathname, basePath);
      if (!filePath) throw new Error('Unsafe static asset path');
      const content = readFileSync(filePath);
      const ext = filePath.split('.').pop();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      res.end(content);
      return;
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(viteIndexShell);
}

function listenServer(server) {
  return new Promise((resolveListen, rejectListen) => {
    const rejectOnce = (error) => {
      server.off('listening', resolveOnce);
      rejectListen(error);
    };
    const resolveOnce = () => {
      server.off('error', rejectOnce);
      resolveListen();
    };
    server.once('error', rejectOnce);
    server.once('listening', resolveOnce);
    server.listen(PORT, '127.0.0.1');
  });
}

function closeServer(server) {
  server.closeAllConnections?.();
  if (!server.listening) return Promise.resolve();
  return new Promise((resolveClose, rejectClose) => {
    server.close((error) => (error ? rejectClose(error) : resolveClose()));
  });
}

async function closeResources(browser, server) {
  const results = await Promise.allSettled([
    browser ? browser.close() : Promise.resolve(),
    closeServer(server),
  ]);
  const failure = results.find((result) => result.status === 'rejected');
  if (failure) throw failure.reason;
}

async function prerender() {
  const server = createServer(serve);
  let browser;

  await withCleanup(
    async () => {
      await listenServer(server);
      console.log(`Prerender server running on http://127.0.0.1:${PORT}`);

      const launchOptions = {};
      if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) {
        launchOptions.executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
      }
      browser = await chromium.launch(launchOptions);

      for (const route of ROUTES) {
        let page;
        await withCleanup(
          async () => {
            page = await browser.newPage();
            await page.addInitScript(() => {
              window.__PRERENDER__ = true;
            });
            const pageUrl = toPrerenderUrl(route, basePath);
            await page.goto(`http://127.0.0.1:${PORT}${pageUrl}`, { waitUntil: 'networkidle' });
            await page.waitForTimeout(1500);

            const html = await page.evaluate(() => {
              const selectors = [
                'title',
                'link[rel="canonical"]',
                'meta[name="description"]',
                'meta[property="og:title"]',
                'meta[property="og:description"]',
                'meta[property="og:type"]',
                'meta[property="og:url"]',
                'meta[property="og:image"]',
                'meta[name="twitter:card"]',
                'meta[name="twitter:title"]',
                'meta[name="twitter:description"]',
                'script[type="application/ld+json"]',
              ];
              const ogTitle = [...document.head.querySelectorAll('meta[property="og:title"]')]
                .at(-1)
                ?.getAttribute('content');
              if (!ogTitle) throw new Error('Missing route og:title during prerender.');

              for (const selector of selectors) {
                const nodes = [...document.head.querySelectorAll(selector)];
                nodes.slice(0, -1).forEach((node) => node.remove());
              }
              const title = document.head.querySelector('title');
              if (!title) throw new Error('Missing route title during prerender.');
              title.textContent = ogTitle;
              return document.documentElement.outerHTML;
            });

            validatePrerenderedHtml(html, expectedMetadataForRoute(route), basePath);
            const outPath = route === '/'
              ? resolve(distDir, 'index.html')
              : resolve(distDir, route.replace(/^\//, ''), 'index.html');
            mkdirSync(dirname(outPath), { recursive: true });
            writeFileSync(outPath, html);
            console.log(`Prerendered: ${route}`);
          },
          async () => {
            if (page) await page.close();
          },
        );
      }
    },
    async () => closeResources(browser, server),
  );
}

await prerender();
console.log('Prerender complete.');
