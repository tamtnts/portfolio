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
  c4Levels: ['C1'],
};
const project = {
  route: '/projects/fleet-operations-core',
  title: 'Fleet Operations Core - Case Study | Nguyen Thanh Tam',
  canonical: `${siteUrl}/projects/fleet-operations-core`,
  ogImage,
  c4Levels: ['C1', 'C2', 'C3'],
};
const encodedProject = {
  route: '/projects/fleet-administration-dispatch',
  title: 'Fleet Administration & Dispatch - Case Study | Nguyen Thanh Tam',
  canonical: `${siteUrl}/projects/fleet-administration-dispatch`,
  ogImage,
  c4Levels: ['C1', 'C2', 'C3'],
};

function fixture(metadata, {
  diagramStatuses = metadata.c4Levels.map(() => 'ready'),
  c4Levels = metadata.c4Levels,
} = {}) {
  return `<!doctype html><html><head>
    <title>${metadata.title}</title>
    <link rel="canonical" href="${metadata.canonical}">
    <meta name="description" content="Public portfolio">
    <meta property="og:title" content="${metadata.title}">
    <meta property="og:url" content="${metadata.canonical}">
    <meta property="og:image" content="${metadata.ogImage}">
    <script src="/portfolio/assets/index.js"></script>
  </head><body>
    ${c4Levels.map((level) => `<section data-c4-level="${level}"></section>`).join('')}
    ${diagramStatuses.map((status) => `<div data-diagram-status="${status}"></div>`).join('')}
    <a href="/portfolio/projects/fleet-data-intelligence-hub">Project</a>
  </body></html>`;
}

test('accepts valid home and project prerendered metadata', () => {
  assert.doesNotThrow(() => validatePrerenderedHtml(fixture(home), home, '/portfolio/'));
  assert.doesNotThrow(() => validatePrerenderedHtml(fixture(project), project, '/portfolio/'));
});

test('accepts HTML-encoded title and og:title metadata', () => {
  const encodedHtml = fixture(encodedProject).replaceAll('&', '&amp;');

  assert.doesNotThrow(() => validatePrerenderedHtml(encodedHtml, encodedProject, '/portfolio/'));
});

test('accepts numeric character references in title and og:title metadata', () => {
  const encodedHtml = fixture(encodedProject).replaceAll('&', '&#38;');

  assert.doesNotThrow(() => validatePrerenderedHtml(encodedHtml, encodedProject, '/portfolio/'));
});

test('rejects a project artifact that retains the homepage title', () => {
  assert.throws(
    () => validatePrerenderedHtml(fixture({ ...project, title: home.title }), project, '/portfolio/'),
    /title must equal/i,
  );
});

test('rejects loading and error diagram states', () => {
  for (const status of ['loading', 'error']) {
    assert.throws(
      () => validatePrerenderedHtml(fixture(home, { diagramStatuses: [status] }), home, '/portfolio/'),
      /ready diagram/i,
    );
  }
});

test('rejects missing and duplicate ready diagrams', () => {
  assert.throws(
    () => validatePrerenderedHtml(fixture(home, { diagramStatuses: [] }), home, '/portfolio/'),
    /ready diagram/i,
  );
  assert.throws(
    () => validatePrerenderedHtml(fixture(home, { diagramStatuses: ['ready', 'ready'] }), home, '/portfolio/'),
    /ready diagram/i,
  );
});

test('rejects missing duplicate and unexpected C4 levels', () => {
  assert.throws(
    () => validatePrerenderedHtml(fixture(home, { c4Levels: [] }), home, '/portfolio/'),
    /C4 level C1/i,
  );
  assert.throws(
    () => validatePrerenderedHtml(fixture(home, { c4Levels: ['C1', 'C1'] }), home, '/portfolio/'),
    /C4 level C1/i,
  );
  assert.throws(
    () => validatePrerenderedHtml(fixture(home, { c4Levels: ['C1', 'C2'] }), home, '/portfolio/'),
    /C4 level markers/i,
  );
});
