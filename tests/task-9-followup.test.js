import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { projects } from '../src/data/projects.js';

const source = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('route changes restore the correct top or home-anchor position', async () => {
  const [app, routeScroll] = await Promise.all([
    source('../src/App.jsx'),
    source('../src/components/RouteScrollManager.jsx'),
  ]);

  assert.match(app, /<RouteScrollManager\s*\/>/);
  assert.match(routeScroll, /useLocation/);
  assert.match(routeScroll, /hash/);
  assert.match(routeScroll, /scrollIntoView/);
  assert.match(routeScroll, /window\.scrollTo/);
  assert.match(routeScroll, /document\.readyState/);
  assert.match(routeScroll, /addEventListener\(['"]load['"]/);
  assert.match(routeScroll, /requestAnimationFrame/);
});

test('personal contributions exclude project-level mechanisms without confirmed attribution', () => {
  const project = projects.find(({ slug }) => slug === 'fleet-operations-core');
  const contributions = project.contributions.join(' ');

  assert.match(contributions, /Redis/i);
  assert.match(contributions, /document/i);
  assert.doesNotMatch(contributions, /distributed[- ]lock|validation|retry|fallback/i);
});

test('architecture preview buttons have project-specific accessible names', async () => {
  const card = await source('../src/components/ProjectCard.jsx');

  assert.match(card, /aria-label=\{`Preview the \$\{project\.title\} architecture`\}/);
  assert.match(card, />\s*Preview Architecture\s*</);
});

test('Mermaid rendering distinguishes loading from failure', async () => {
  const diagram = await source('../src/components/MermaidDiagram.jsx');

  assert.match(diagram, /status:\s*['"]loading['"]/);
  assert.match(diagram, /Rendering architecture diagram/);
  assert.match(diagram, /status:\s*['"]error['"]/);
  assert.match(diagram, /Architecture diagram could not be rendered/);
});

test('Mermaid controls keep a dark readable toolbar', async () => {
  const [diagram, modal] = await Promise.all([
    source('../src/components/MermaidDiagram.jsx'),
    source('../src/components/DiagramModal.jsx'),
  ]);

  assert.match(diagram, /\bbg-panel\b/);
  assert.doesNotMatch(diagram, /\bbg-panel\/80\b/);
  assert.equal((diagram.match(/\bmin-h-11\b/g) ?? []).length, 3);
  assert.equal((diagram.match(/\bmin-w-11\b/g) ?? []).length, 3);
  assert.match(modal, /\bmin-h-11\b/);
});

test('all not-found routes use basename-aware navigation and noindex metadata', async () => {
  const [app, detail, notFound] = await Promise.all([
    source('../src/App.jsx'),
    source('../src/pages/ProjectDetail.jsx'),
    source('../src/pages/NotFoundPage.jsx'),
  ]);

  assert.match(app, /<Route\s+path=['"]\*['"]\s+element=\{<NotFoundPage/);
  assert.match(detail, /<NotFoundPage/);
  assert.match(notFound, /<Link[^>]+to=['"]\/['"]/);
  assert.match(notFound, /<meta\s+name=['"]robots['"]\s+content=['"]noindex['"]/);
  assert.match(detail + notFound, /Project Not Found/);
  assert.doesNotMatch(app + notFound, /href=['"]\/['"]/);
});

test('architecture modal contains keyboard focus while open', async () => {
  const modal = await source('../src/components/DiagramModal.jsx');

  assert.match(modal, /dialogRef/);
  assert.match(modal, /event\.key\s*!==\s*['"]Tab['"]/);
  assert.match(modal, /querySelectorAll/);
  assert.match(modal, /event\.preventDefault\(\)/);
  assert.match(modal, /firstFocusable\.focus\(\)/);
  assert.match(modal, /lastFocusable\.focus\(\)/);
});
