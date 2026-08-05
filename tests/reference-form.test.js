import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = (path) => readFile(new URL(path, import.meta.url), 'utf8')
  .then((contents) => contents.replace(/\r\n/g, '\n'));

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

test('C4 diagrams expose semantic screen-reader summaries through stable descriptions', async () => {
  const [diagram, c4Model, overview, summary, modal, projectsSection] = await Promise.all([
    source('../src/components/MermaidDiagram.jsx'),
    source('../src/components/C4Model.jsx'),
    source('../src/components/FleetPlatformOverview.jsx'),
    source('../src/components/C4DiagramSummary.jsx').catch(() => ''),
    source('../src/components/DiagramModal.jsx'),
    source('../src/components/sections/ProjectsSection.jsx'),
  ]);

  assert.match(diagram, /descriptionId/);
  assert.match(diagram, /aria-describedby=\{descriptionId\}/);
  assert.match(summary, /<section/);
  assert.match(summary, /className=['"]sr-only['"]/);
  assert.match(summary, /accessibility\.elements\.map/);
  assert.match(summary, /accessibility\.relationships\.map/);
  assert.match(summary, /accessibility\.currentService/);

  assert.match(c4Model, /C4DiagramSummary/);
  assert.match(c4Model, /data-c4-level=\{diagram\.level\}/);
  assert.match(c4Model, /c4-\$\{diagram\.level\.toLowerCase\(\)\}-summary/);
  assert.match(c4Model, /descriptionId=\{descriptionId\}/);

  assert.match(overview, /C4DiagramSummary/);
  assert.match(overview, /data-c4-level=\{context\.level\}/);
  assert.match(overview, /fleet-platform-c1-summary/);
  assert.match(overview, /descriptionId=\{descriptionId\}/);

  assert.match(projectsSection, /diagram:\s*container/);
  assert.match(projectsSection, /diagram=\{modal\.diagram\}/);
  assert.match(modal, /C4DiagramSummary/);
  assert.match(modal, /diagram-preview-\$\{diagram\.level\.toLowerCase\(\)\}-summary/);
  assert.match(modal, /descriptionId=\{descriptionId\}/);
});

test('Mermaid diagrams expose deterministic loading error and ready states', async () => {
  const diagram = await source('../src/components/MermaidDiagram.jsx');

  assert.match(diagram, /data-diagram-status=['"]loading['"]/);
  assert.match(diagram, /data-diagram-status=['"]error['"]/);
  assert.match(diagram, /data-diagram-status=['"]ready['"]/);
});

test('large project pages render the complete approved case-study form', async () => {
  const detail = await source('../src/pages/ProjectDetail.jsx');
  for (const heading of [
    'Overview',
    'Requirements',
    'Key Challenges',
    'C4 Model',
    'Main Flow',
    'My Contributions',
    'Tech Stack',
    'Reliability & Security',
    'Trade-offs / Design Decisions',
    'Outcome / Impact',
    'Lessons Learned',
  ]) {
    assert.ok(detail.includes(heading), 'Missing heading: ' + heading);
  }
  assert.match(detail, /if \(!when\) return null/);
  assert.match(detail, /Project not found/);
  assert.doesNotMatch(detail, /project\.overview\.role|Role:/);
});

test('project pages render C1 C2 and C3 vertically with related services', async () => {
  const [detail, c4Model] = await Promise.all([
    source('../src/pages/ProjectDetail.jsx'),
    source('../src/components/C4Model.jsx'),
  ]);

  assert.match(detail, /fleetPlatform\.c4\.context/);
  assert.match(detail, /project\.c4\.container/);
  assert.match(detail, /project\.c4\.component/);
  assert.match(detail, /relatedProjects/);
  assert.match(detail, /Related Platform Services/);
  assert.match(c4Model, /\[context, container, component\]/);
  assert.match(c4Model, /MermaidDiagram/);
  assert.doesNotMatch(c4Model, /tab|hidden/i);
  assert.doesNotMatch(detail, /Delivery Scope & Highlights/);
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
  assert.match(overview, /\\u2014/);
  assert.doesNotMatch(overview, /Ã|â/);
});

test('Connected platform preview opens the shared C1 diagram in the modal', async () => {
  const [overview, section, diagram] = await Promise.all([
    source('../src/components/FleetPlatformOverview.jsx'),
    source('../src/components/sections/ProjectsSection.jsx'),
    source('../src/components/MermaidDiagram.jsx'),
  ]);
  const previewBranch = diagram.match(
    /if \(preview\) \{([\s\S]*?)\n\s{2}\}\n\n\s{2}return \(/,
  )?.[1] ?? '';
  const previewButton = previewBranch.match(/<button\b[\s\S]*?\n\s*>/)?.[0] ?? '';
  const previewVisual = previewBranch.match(/<span\b[\s\S]*?\n\s*\/?>/)?.[0] ?? '';

  assert.equal((previewBranch.match(/<button\b/g) ?? []).length, 1);
  assert.match(previewButton, /aria-label=\{`Open \$\{title\} architecture`\}/);
  assert.match(previewButton, /aria-describedby=\{descriptionId\}/);
  assert.match(previewButton, /onClick=\{\(\) => onOpen\?\.\(\)\}/);
  assert.match(previewVisual, /aria-hidden=['"]true['"]/);
  assert.doesNotMatch(previewBranch, /TransformWrapper|TransformComponent/);
  assert.doesNotMatch(previewBranch, /Zoom in|Zoom out|Reset diagram/);

  assert.match(overview, /onOpen=\{\(\) => onOpenDiagram\?\.\(context\)\}/);
  assert.match(section, /onOpenDiagram=\{openPlatformDiagram\}/);
  assert.match(
    section,
    /const context = fleetPlatform\.c4\.context;[\s\S]*?code: context\.code,[\s\S]*?diagram: context,/,
  );
  assert.match(section, /diagram=\{modal\.diagram\}/);
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
