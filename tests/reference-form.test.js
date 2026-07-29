import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = (path) => readFile(new URL(path, import.meta.url), 'utf8');

async function sourcesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const contents = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourcesIn(path) : readFile(path, 'utf8');
  }));
  return contents.flat();
}

test('diagram runtime is installed and accessible controls are implemented', async () => {
  const [packageJson, diagram, modal] = await Promise.all([
    source('../package.json'),
    source('../src/components/MermaidDiagram.jsx'),
    source('../src/components/DiagramModal.jsx'),
  ]);

  assert.match(packageJson, /"mermaid"/);
  assert.match(packageJson, /"react-zoom-pan-pinch"/);
  assert.match(diagram, /aria-label=['"]Zoom in['"]/);
  assert.match(diagram, /aria-label=['"]Zoom out['"]/);
  assert.match(diagram, /aria-label=['"]Reset diagram['"]/);
  assert.match(modal, /event\.key === 'Escape'/);
  assert.match(modal, /previousFocus/);
  assert.match(modal, /aria-modal=['"]true['"]/);
});

test('large project pages render the complete approved case-study form', async () => {
  const detail = await source('../src/pages/ProjectDetail.jsx');
  for (const heading of [
    'Overview',
    'Requirements',
    'Key Challenges',
    'Architecture Diagram',
    'Main Flow',
    'My Contributions',
    'Tech Stack',
    'Delivery Scope & Highlights',
    'Reliability & Security',
    'Trade-offs / Design Decisions',
    'Outcome / Impact',
    'Lessons Learned',
  ]) {
    assert.ok(detail.includes(heading), 'Missing heading: ' + heading);
  }
  assert.match(detail, /MermaidDiagram/);
  assert.match(detail, /if \(!when\) return null/);
  assert.match(detail, /Project not found/);
});

test('project cards expose qualitative highlights, detail navigation, and architecture preview', async () => {
  const [card, section] = await Promise.all([
    source('../src/components/ProjectCard.jsx'),
    source('../src/components/sections/ProjectsSection.jsx'),
  ]);

  assert.match(card, /project\.highlights\.map/);
  assert.match(card, /Read Case Study/);
  assert.match(card, /Preview Architecture/);
  assert.match(card, /onOpenDiagram/);
  assert.match(section, /earlierProjects/);
  assert.match(section, /DiagramModal/);
  assert.match(section, /project\.c4\.container/);
  assert.doesNotMatch(section, /project\.mermaid/);
  assert.match(section, /\\u2014/);
  assert.doesNotMatch(section, /Ã|â/);
  assert.match(section, />Selected Projects<\//);
  assert.doesNotMatch(section, /Foundations and earlier work/);
  assert.doesNotMatch(section, /Academic and internship work that shaped my database, API, testing, and delivery fundamentals/);
});

test('homepage presents the three services as one connected platform', async () => {
  const [section, overview, card, platformData] = await Promise.all([
    source('../src/components/sections/ProjectsSection.jsx'),
    source('../src/components/FleetPlatformOverview.jsx'),
    source('../src/components/ProjectCard.jsx'),
    source('../src/data/fleetPlatform.js'),
  ]);

  assert.match(section, /FleetPlatformOverview/);
  assert.match(section, /lg:grid-cols-3/);
  assert.match(overview, /MermaidDiagram/);
  assert.match(overview, /platform\.c4\.context/);
  assert.match(platformData, /c4/);
  assert.match(platformData, /context/);
  assert.match(platformData, /Fleet Operations Platform/);
  assert.doesNotMatch(platformData, /mermaid/);
  assert.match(card, /project\.serviceLabel/);
  assert.match(card, /project\.highlights/);
  assert.doesNotMatch(card, /project\.scaling/);
});

test('homepage uses the compact reference geometry and approved anchors', async () => {
  const [home, toc, hero, styles] = await Promise.all([
    source('../src/pages/Home.jsx'),
    source('../src/components/TableOfContents.jsx'),
    source('../src/components/sections/HeroSection.jsx'),
    source('../src/index.css'),
  ]);

  assert.match(home, /lg:grid-cols-\[180px_1fr\]/);
  assert.match(home, /<TableOfContents/);
  assert.match(home, /space-y-24/);
  for (const id of ['about', 'highlights', 'tech-stack', 'projects', 'experience', 'contact']) {
    assert.match(toc, new RegExp("id: '" + id + "'"));
  }
  assert.match(hero, /text-center/);
  assert.match(hero, />Review CV<\//);
  assert.match(hero, /profile\.resumeUrl &&/);
  assert.doesNotMatch(home, /EarlierProjectsSection|EducationSection/);
  assert.match(toc, /group-focus-visible:opacity-100/);
  assert.match(styles, /@apply outline-2 outline-accent/);
  assert.match(styles, /@apply bg-accent\/20 text-white/);
  assert.match(styles, /@apply border-accent\/40/);
  assert.doesNotMatch(styles, /#67e8f9|rgba\(103,\s*232,\s*249/);
});

test('homepage sections use compact headings and merge education into experience', async () => {
  const [home, hero, focus, stack, projects, experience, contact] = await Promise.all([
    source('../src/pages/Home.jsx'),
    source('../src/components/sections/HeroSection.jsx'),
    source('../src/components/sections/FocusSection.jsx'),
    source('../src/components/sections/StackSection.jsx'),
    source('../src/components/sections/ProjectsSection.jsx'),
    source('../src/components/sections/ExperienceSection.jsx'),
    source('../src/components/sections/ContactSection.jsx'),
  ]);

  assert.match(focus, /id=['"]highlights['"]/);
  assert.match(focus, /border-l-2/);
  assert.match(stack, /id=['"]tech-stack['"]/);
  assert.match(stack, /CORE STACK/);
  assert.match(stack, /INFRASTRUCTURE/);
  assert.match(experience, /profile\.education/);
  assert.match(experience, /profile\.certifications/);
  assert.match(experience, /profile\.english/);
  assert.match(contact, /mailto:/);
  assert.doesNotMatch([focus, stack, experience, contact].join(' '), /SectionHeading|<Container/);
  const homepageSources = [home, hero, focus, stack, projects, experience, contact].join(' ');
  for (const id of ['about', 'highlights', 'tech-stack', 'projects', 'experience', 'contact']) {
    assert.equal((homepageSources.match(new RegExp(`id=['"]${id}['"]`, 'g')) ?? []).length, 1);
  }
});

test('source no longer uses the superseded SectionHeading component', async () => {
  const srcDirectory = fileURLToPath(new URL('../src', import.meta.url));
  const sources = await sourcesIn(srcDirectory);

  assert.doesNotMatch(sources.join(' '), /SectionHeading/);
});
