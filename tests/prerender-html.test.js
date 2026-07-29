import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePrerenderedHtml } from '../scripts/prerender-html.js';

const siteUrl = 'https://tamtnts.github.io/portfolio';
const ogImage = `${siteUrl}/og.svg`;
const home = {
  route: '/',
  title: 'Nguyen Thanh Tam - Middle Backend Developer',
  canonical: `${siteUrl}/`,
  ogImage,
};
const project = {
  route: '/projects/fleet-operations-management-platform',
  title: 'Fleet Operations Management Platform - Case Study | Nguyen Thanh Tam',
  canonical: `${siteUrl}/projects/fleet-operations-management-platform`,
  ogImage,
};

function fixture(metadata) {
  return `<!doctype html><html><head>
    <title>${metadata.title}</title>
    <link rel="canonical" href="${metadata.canonical}">
    <meta name="description" content="Public portfolio">
    <meta property="og:title" content="${metadata.title}">
    <meta property="og:url" content="${metadata.canonical}">
    <meta property="og:image" content="${metadata.ogImage}">
    <script src="/portfolio/assets/index.js"></script>
  </head><body><a href="/portfolio/projects/fleetops-data-hub">Project</a></body></html>`;
}

test('accepts valid home and project prerendered metadata', () => {
  assert.doesNotThrow(() => validatePrerenderedHtml(fixture(home), home, '/portfolio/'));
  assert.doesNotThrow(() => validatePrerenderedHtml(fixture(project), project, '/portfolio/'));
});

test('rejects a project artifact that retains the homepage title', () => {
  assert.throws(
    () => validatePrerenderedHtml(fixture({ ...project, title: home.title }), project, '/portfolio/'),
    /title must equal/i,
  );
});
