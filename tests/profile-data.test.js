import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { profile } from '../src/data/profile.js';
import { projects } from '../src/data/projects.js';
import { earlierProjects } from '../src/data/earlierProjects.js';

const publicCv = new URL('../public/NguyenThanhTam-CV.pdf', import.meta.url);

test('profile exposes the approved public identity and contact details', () => {
  assert.equal(profile.name, 'Nguyen Thanh Tam');
  assert.equal(profile.role, 'Middle Backend Developer');
  assert.equal(profile.location, 'Ho Chi Minh City');
  assert.equal(profile.email, 'tamtnts@gmail.com');
  assert.equal(profile.phone.href, 'tel:+84941346209');
  assert.equal(profile.github, 'https://github.com/tamtnts');
  assert.equal(profile.linkedin, 'https://www.linkedin.com/in/tam-nguyen-thanh-338983260/');
  assert.equal(profile.resumeUrl, '/NguyenThanhTam-CV.pdf');
  assert.equal(profile.certifications.length, 4);
});

test('GTEL OTS experience presents the approved Middle Backend responsibilities', () => {
  const gtelExperience = profile.experience.find(({ company }) => company === 'GTEL OTS');

  assert.deepEqual(gtelExperience?.highlights, [
    'Develop and maintain Java 17+ and Spring Boot microservices for vehicle lookup, journey data, operational statistics, and record exports.',
    'Design Oracle, PostgreSQL, MySQL, and MongoDB data models; optimize SQL queries, indexing, partitioning, transactions, and persistence with Spring Data JPA/Hibernate.',
    'Build resilient Kafka consumers and asynchronous synchronization workers with retry, idempotency, and dead-letter handling.',
    'Use Redis for caching, distributed locking, rate limiting, and temporary state coordination.',
    'Integrate microservices through gRPC and REST APIs; implement JWT/OAuth2 authentication, RBAC authorization, and API security practices.',
    'Optimize backend latency, throughput, and scalability for high-concurrency operational workloads.',
    'Build, deploy, and troubleshoot services with Maven/Gradle, Docker, Kubernetes, and CI/CD pipelines.',
    'Write unit and integration tests; monitor services through Prometheus, Grafana, ELK, and log analysis.',
    'Participate in code reviews, technical design discussions, cross-functional collaboration, and mentoring junior developers.',
  ]);
});

test('portfolio publishes three complete NDA-safe connected case studies', () => {
  assert.deepEqual(
    projects.map(({ slug }) => slug),
    [
      'fleet-operations-core',
      'fleet-administration-dispatch',
      'fleet-data-intelligence-hub',
    ],
  );

  for (const project of projects) {
    assert.equal(project.featured, true);
    assert.ok(project.title);
    assert.ok(project.subtitle);
    assert.ok(project.disclaimer);
    assert.ok(project.overview.domain);
    assert.equal(project.overview.role, 'Middle Backend Developer');
    assert.equal(project.overview.duration, undefined);
    assert.equal(project.overview.teamSize, undefined);
    assert.ok(project.tags.length >= 5);
    assert.ok(project.requirements.length >= 4);
    assert.ok(project.challenges.length >= 4);
    assert.equal(project.c4.container.level, 'C2');
    assert.match(project.c4.container.code, /^flowchart /);
    assert.equal(project.c4.component.level, 'C3');
    assert.match(project.c4.component.code, /^flowchart /);
    assert.ok(project.mainFlow.length >= 5);
    assert.ok(project.contributions.length >= 4);
    assert.ok(project.techStack.length >= 6);
    assert.equal(project.highlights.length, 3);
    assert.ok(project.reliabilitySecurity.length >= 4);
    assert.ok(project.tradeoffs.length >= 3);
    assert.ok(project.outcome.length >= 2);
    assert.ok(project.lessons.length >= 3);
  }
});

test('case study highlights and contributions contain no quantitative API claims', () => {
  const publicText = projects
    .flatMap(({ highlights, contributions }) => [...highlights, ...contributions])
    .join(' ');

  assert.doesNotMatch(publicText, /~?\d+\s*(?:apis?|ms|%|users?|requests?)/i);
});

test('profile and selected projects keep the approved counts', () => {
  assert.equal(profile.focus.length, 5);
  assert.equal(profile.resumeUrl, '/NguyenThanhTam-CV.pdf');
  assert.equal(profile.certifications.length, 4);
  assert.equal(earlierProjects.length, 3);
  assert.equal(new Set(earlierProjects.map(({ name }) => name)).size, 3);
});

test('public CV uses a stable PDF asset and deployment-aware Hero action', async () => {
  const [pdf, hero, profileSource] = await Promise.all([
    readFile(publicCv),
    readFile(
      new URL('../src/components/sections/HeroSection.jsx', import.meta.url),
      'utf8',
    ),
    readFile(
      new URL('../src/data/profile.js', import.meta.url),
      'utf8',
    ),
  ]);

  assert.equal(pdf.subarray(0, 5).toString('ascii'), '%PDF-');
  assert.ok(pdf.length > 0);
  assert.match(profileSource, /import\.meta\.env\?\.BASE_URL \?\? '\/'/);
  assert.match(profileSource, /NguyenThanhTam-CV\.pdf/);
  assert.match(hero, /profile\.resumeUrl &&/);
  assert.match(hero, /href=\{profile\.resumeUrl\}/);
  assert.match(hero, />Review CV<\//);
  assert.match(hero, /target="_blank"/);
  assert.match(hero, /rel="noreferrer"/);
  assert.doesNotMatch(
    [hero, profileSource].join(' '),
    /[A-Za-z]:\\Users\\|\/Users\/|\/home\//,
  );
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

  const approvedSlugs = [
    'fleet-operations-core',
    'fleet-administration-dispatch',
    'fleet-data-intelligence-hub',
  ];

  for (const slug of approvedSlugs) {
    assert.match(prerender, new RegExp(`/projects/${slug}`));
    assert.match(sitemap, new RegExp(`/projects/${slug}`));
  }

  for (const retiredSlug of [
    'fleet-operations-management-platform',
    'fleetops-data-hub',
  ]) {
    assert.doesNotMatch(prerender, new RegExp(`/projects/${retiredSlug}`));
    assert.doesNotMatch(sitemap, new RegExp(`/projects/${retiredSlug}`));
  }
  assert.doesNotMatch(prerender, /fleet-operations-platform/);
  assert.doesNotMatch(sitemap, /fleet-operations-platform/);
  assert.match(prerender, /const basePath = normalizeBasePath\(process\.env\.VITE_BASE\);/);
  assert.match(prerender, /resolveStaticFilePath\(distDir, pathname, basePath\)/);
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
  const packageJson = JSON.parse(await readFile(
    new URL('../package.json', import.meta.url),
    'utf8',
  ));

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
    assert.match(detail, new RegExp(heading.replace('&', '&amp;|&')));
  }
  assert.match(workflow, /npm test/);
  assert.match(workflow, /npm run lint/);
  assert.match(workflow, /playwright install.*chromium/);
  assert.match(workflow, /enablement:\s*true/);
  assert.match(favicon, />NT</);
  assert.equal(packageJson.dependencies.mermaid, '^11.12.2');
  assert.equal(packageJson.dependencies['react-zoom-pan-pinch'], '^3.7.0');
});

test('navbar home anchors preserve the configured deployment base path', async () => {
  const navbar = await readFile(
    new URL('../src/components/Navbar.jsx', import.meta.url),
    'utf8',
  );

  assert.match(navbar, /import\.meta\.env\.BASE_URL/);
  assert.doesNotMatch(navbar, /href="\/#/);
});
