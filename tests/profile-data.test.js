import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { profile } from '../src/data/profile.js';
import { projects } from '../src/data/projects.js';
import { earlierProjects } from '../src/data/earlierProjects.js';

test('profile exposes the approved public identity and contact details', () => {
  assert.equal(profile.name, 'Nguyen Thanh Tam');
  assert.equal(profile.role, 'Java Backend Developer');
  assert.equal(profile.location, 'Ho Chi Minh City');
  assert.equal(profile.email, 'tamtnts@gmail.com');
  assert.equal(profile.phone.href, 'tel:+84941346209');
  assert.equal(profile.github, 'https://github.com/tamtnts');
  assert.equal(profile.linkedin, 'https://www.linkedin.com/in/tam-nguyen-thanh-338983260/');
  assert.equal(profile.resumeUrl, null);
  assert.equal(profile.focus.length, 4);
  assert.equal(profile.certifications.length, 4);
});

test('portfolio publishes the approved project counts and slugs', () => {
  assert.deepEqual(
    projects.map(({ slug }) => slug),
    ['fleet-operations-platform', 'fleetops-data-hub'],
  );
  assert.equal(earlierProjects.length, 3);
  assert.equal(new Set(earlierProjects.map(({ name }) => name)).size, 3);
});

test('homepage composes every approved section and omits resume metrics', async () => {
  const home = await readFile(
    new URL('../src/pages/Home.jsx', import.meta.url),
    'utf8',
  );
  const components = [
    'HeroSection',
    'FocusSection',
    'StackSection',
    'ProjectsSection',
    'ExperienceSection',
    'EarlierProjectsSection',
    'EducationSection',
    'ContactSection',
  ];

  for (const component of components) {
    assert.match(home, new RegExp(`<${component}`));
  }
  assert.doesNotMatch(home, /resume|metric/i);
});

test('prerender and sitemap expose only approved public routes', async () => {
  const prerender = await readFile(
    new URL('../scripts/prerender.js', import.meta.url),
    'utf8',
  );
  const sitemap = await readFile(
    new URL('../public/sitemap.xml', import.meta.url),
    'utf8',
  );

  for (const slug of projects.map(({ slug }) => slug)) {
    assert.match(prerender, new RegExp(`/projects/${slug}`));
    assert.match(sitemap, new RegExp(`/projects/${slug}`));
  }
  assert.doesNotMatch(prerender, /\/cv\//);
  assert.doesNotMatch(sitemap, /gitlab|\/cv\//i);
});

test('case studies and publishing assets implement the approved release contract', async () => {
  const detail = await readFile(
    new URL('../src/pages/ProjectDetail.jsx', import.meta.url),
    'utf8',
  );
  const workflow = await readFile(
    new URL('../.github/workflows/deploy.yml', import.meta.url),
    'utf8',
  );
  const favicon = await readFile(
    new URL('../public/favicon.svg', import.meta.url),
    'utf8',
  );
  const packageJson = await readFile(
    new URL('../package.json', import.meta.url),
    'utf8',
  );

  for (const heading of [
    'Context',
    'Role & responsibilities',
    'Key modules',
    'Architecture & data flow',
    'Technical decisions',
    'Challenges',
    'Technology stack',
    'Outcome',
    'Lessons learned',
  ]) {
    assert.match(detail, new RegExp(heading.replace('&', '&amp;|&')));
  }
  assert.match(workflow, /npm test/);
  assert.match(workflow, /npm run lint/);
  assert.match(workflow, /playwright install.*chromium/);
  assert.match(workflow, /enablement:\s*true/);
  assert.match(favicon, />NT</);
  assert.doesNotMatch(packageJson, /mermaid|react-zoom-pan-pinch/);
});

test('navbar home anchors preserve the configured deployment base path', async () => {
  const navbar = await readFile(
    new URL('../src/components/Navbar.jsx', import.meta.url),
    'utf8',
  );

  assert.match(navbar, /import\.meta\.env\.BASE_URL/);
  assert.doesNotMatch(navbar, /href="\/#/);
});
