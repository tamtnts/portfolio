# Reference-Form NDA Case Studies Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Rebuild Nguyen Thanh Tam's portfolio in the approved compact reference form, publish two complete NDA-safe backend case studies with newly authored diagrams, and release the result without private-source or legacy-profile identifiers.

**Architecture:** Keep React, Vite, Tailwind, React Router, Helmet, static data modules, and GitHub Pages prerendering. Restore the reference homepage geometry and reusable diagram interaction while retaining focused section components. Make project content data-driven, hide absent optional facts, and guard the complete public tree with deterministic content and privacy tests.

**Tech Stack:** React 19, Vite 7, Tailwind CSS 3, React Router 7, React Helmet Async, Mermaid 11, react-zoom-pan-pinch 3, Node test runner, Playwright prerendering, GitHub Pages.

## Global Constraints

- Public copy is English.
- The website is a portfolio update only; do not modify or publish an unapproved CV PDF.
- The homepage must follow the approved compact reference form: centered hero, sticky left table of contents, single main content column, compact headings, original-style cards, timeline, and contact card.
- Publish exactly two featured case studies and three compact selected projects.
- Project one is Fleet Operations Management Platform.
- Project two is FleetOps Data Hub.
- Use only these approved project-one delivery counts: approximately 40 lookup APIs, 20 statistics APIs, and 15 export APIs.
- Do not invent duration, team size, traffic, latency, availability, data volume, infrastructure scale, customer impact, or business outcomes.
- Do not copy private code, class names, route names, payloads, schemas, templates, screenshots, logs, topology, network values, credentials, repository metadata, or internal terminology.
- Diagrams must be newly authored from neutral component categories.
- Optional fields and sections must disappear when empty; no blank cards or temporary copy.
- No legacy profile identity, contact detail, project identifier, CV asset, route, or Git history may reach the public release.
- Use GitHub only. Do not push to any other remote.
- The public main branch must remain descended from the existing clean GitHub root, not from the legacy feature ancestry.

---

## File Map

### Create

- src/lib/mermaid.js - strict Mermaid initialization and rendering.
- src/components/MermaidDiagram.jsx - accessible pan/zoom diagram surface.
- src/components/DiagramModal.jsx - accessible architecture modal with Escape and focus restoration.
- tests/reference-form.test.js - structural contract for the approved homepage, cards, case-study form, diagrams, and accessibility hooks.
- tests/privacy-content.test.js - public-tree scanner using irreversible identifier fingerprints and generic secret/network patterns.

### Modify

- package.json and package-lock.json - restore Mermaid and zoom dependencies.
- src/data/profile.js - add the fifth approved highlight and retain approved public profile data.
- src/data/projects.js - replace the simplified records with the full reference case-study schema.
- src/data/earlierProjects.js - retain the three compact selected projects and add optional safe links only when verified.
- src/pages/Home.jsx - compose the centered hero plus 180px table-of-contents/content grid.
- src/pages/ProjectDetail.jsx - render every approved reference-form case-study section and hide absent fields.
- src/components/Navbar.jsx - restore compact reference navigation with base-path-safe anchors.
- src/components/Footer.jsx - restore compact stacked footer.
- src/components/TableOfContents.jsx - use approved section IDs and desktop sticky positioning.
- src/components/ProjectCard.jsx - restore metric strip and two-action layout.
- src/components/sections/HeroSection.jsx - centered hero without an unapproved resume link.
- src/components/sections/FocusSection.jsx - compact two-column border-left highlights.
- src/components/sections/StackSection.jsx - two compact technology cards.
- src/components/sections/ProjectsSection.jsx - featured cards, diagram modal, and three selected-project snapshots.
- src/components/sections/ExperienceSection.jsx - timeline plus compact education, certifications, and English.
- src/components/sections/ContactSection.jsx - compact reference-style contact card.
- src/index.css and tailwind.config.js - restore charcoal reference tokens, page glows, compact card styles, and reduced-motion behavior.
- tests/profile-data.test.js - assert the approved data schema, metrics, routes, and no fabricated facts.
- scripts/prerender.js - update the project-one route.
- public/sitemap.xml - update the project-one route.
- README.md - describe only the current Tam portfolio and GitHub Pages workflow.

### Delete

- src/components/SectionHeading.jsx - incompatible with the compact reference headings.
- src/components/sections/EarlierProjectsSection.jsx - selected projects move under Featured Projects.
- src/components/sections/EducationSection.jsx - education and certificates move into the timeline section.
- tests/legacy-content.test.js - replace the plaintext legacy identifier list with irreversible fingerprints.
- docs/superpowers/specs/2026-07-24-nguyen-thanh-tam-portfolio-design.md - superseded and unsafe for public release.
- docs/superpowers/plans/2026-07-27-nguyen-thanh-tam-portfolio-implementation.md - superseded and unsafe for public release.

---

### Task 1: Lock the Profile and Full Case-Study Data Contract

**Files:**
- Modify: tests/profile-data.test.js
- Modify: src/data/profile.js
- Modify: src/data/projects.js
- Modify: src/data/earlierProjects.js

**Interfaces:**
- Consumes: no new runtime interface.
- Produces: profile object; projects array with the FullProject shape below; earlierProjects array.

FullProject shape:

~~~js
{
  slug: String,
  featured: Boolean,
  title: String,
  subtitle: String,
  tags: String[],
  disclaimer: String,
  overview: {
    domain?: String,
    duration?: String,
    role?: String,
    teamSize?: String,
    scale?: String,
  },
  requirements: String[],
  challenges: String[],
  mermaid: { title: String, code: String },
  mainFlow: String[] | { phase: String, steps: String[] }[],
  contributions: String[],
  techStack: String[],
  scaling: Record<String, String>,
  reliabilitySecurity: String[],
  tradeoffs: String[],
  outcome: String[],
  lessons: String[],
}
~~~

- [ ] **Step 1: Replace the simplified data assertions with failing full-schema assertions**

Retain the approved identity/contact test and add:

~~~js
test('portfolio publishes two complete NDA-safe case studies', () => {
  assert.deepEqual(
    projects.map(({ slug }) => slug),
    ['fleet-operations-management-platform', 'fleetops-data-hub'],
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
    assert.ok(project.mermaid.title);
    assert.match(project.mermaid.code, /^flowchart /);
    assert.ok(project.mainFlow.length >= 5);
    assert.ok(project.contributions.length >= 4);
    assert.ok(project.techStack.length >= 6);
    assert.ok(Object.keys(project.scaling).length >= 3);
    assert.ok(project.reliabilitySecurity.length >= 4);
    assert.ok(project.tradeoffs.length >= 3);
    assert.ok(project.outcome.length >= 2);
    assert.ok(project.lessons.length >= 3);
  }
});

test('project one uses only approved delivery counts', () => {
  const project = projects[0];
  const publicMetrics = Object.values(project.scaling).join(' ');
  assert.match(publicMetrics, /~40/);
  assert.match(publicMetrics, /~20/);
  assert.match(publicMetrics, /~15/);
  assert.doesNotMatch(publicMetrics, /latency|requests per|users|availability|uptime/i);
});

test('project two uses qualitative highlights instead of invented scale', () => {
  const publicMetrics = Object.values(projects[1].scaling);
  assert.deepEqual(publicMetrics, [
    'Multi-source integration',
    'Event-driven synchronization',
    'Search-optimized reads',
  ]);
  assert.doesNotMatch(publicMetrics.join(' '), /\d/);
});

test('profile and selected projects keep the approved counts', () => {
  assert.equal(profile.focus.length, 5);
  assert.equal(profile.resumeUrl, null);
  assert.equal(profile.certifications.length, 4);
  assert.equal(earlierProjects.length, 3);
});
~~~

- [ ] **Step 2: Run the data test and verify the old simplified records fail**

~~~powershell
node --test tests/profile-data.test.js
~~~

Expected: FAIL because the first slug is still fleet-operations-platform and the full fields are missing.

- [ ] **Step 3: Update profile.focus to the five approved reference-form highlights**

~~~js
focus: [
  {
    title: 'REST APIs & Service Design',
    description: 'Maintainable Spring Boot services with explicit contracts and practical boundaries.',
  },
  {
    title: 'Database & Query Optimization',
    description: 'Data models, indexes, and measured query improvements for operational workloads.',
  },
  {
    title: 'Event-Driven Processing',
    description: 'Kafka consumers and synchronization workers for reliable asynchronous workflows.',
  },
  {
    title: 'Service Integration',
    description: 'gRPC and REST adapters that normalize data from multiple internal services.',
  },
  {
    title: 'Search & Document Workflows',
    description: 'Elasticsearch-backed operational search and template-driven document generation.',
  },
],
~~~

Keep the existing approved identity, contact, experience, education, English, certification, and stack values unchanged.

- [ ] **Step 4: Replace src/data/projects.js with the complete safe records**

~~~js
const fleetOperationsDiagram = [
  'flowchart LR',
  '  Client[Operations Web and Mobile] --> Gateway[API Gateway]',
  '  Gateway --> Backend[Fleet Operations Backend]',
  '  Backend --> Lookup[Lookup Module]',
  '  Backend --> Journey[Journey and Incident Module]',
  '  Backend --> Stats[Statistics Module]',
  '  Backend --> Export[Document Export]',
  '  Lookup --> Adapters[Integration Adapters]',
  '  Adapters -->|REST and gRPC| Systems[Internal and Partner Systems]',
  '  Systems -->|Async results| Bus[(Kafka)]',
  '  Bus --> Workers[Synchronization Workers]',
  '  Journey --> DB[(PostgreSQL)]',
  '  Workers --> DB',
  '  Backend --> Cache[(Redis)]',
  '  Stats --> Search[(Elasticsearch)]',
  '  Export --> Storage[(Object Storage)]',
].join('\n');

const dataHubDiagram = [
  'flowchart LR',
  '  Sources[Source Systems] --> Adapters[Integration Adapters]',
  '  Adapters -->|REST and gRPC| API[Lookup and Aggregation API]',
  '  Adapters --> Bus[(Kafka)]',
  '  Bus --> Workers[Synchronization Workers]',
  '  Workers --> DB[(PostgreSQL)]',
  '  Workers --> Search[(Elasticsearch)]',
  '  Client[Operations Client] --> API',
  '  API --> Cache[(Redis)]',
  '  API --> DB',
  '  API --> Search',
].join('\n');

export const projects = [
  {
    slug: 'fleet-operations-management-platform',
    featured: true,
    title: 'Fleet Operations Management Platform',
    subtitle:
      'A Spring backend for multi-source vehicle and journey lookup, operational workflows, analytics, and document generation.',
    tags: ['Java 17', 'Spring Boot', 'PostgreSQL', 'Redis', 'Kafka', 'gRPC'],
    disclaimer:
      'Names, business rules, data, topology, and customer details are fictionalized or generalized for confidentiality.',
    overview: {
      domain: 'NDA-safe logistics fleet operations',
      role: 'Middle Backend Developer',
      scale: 'Delivery scope is represented only by approved API and query counts.',
    },
    requirements: [
      'Provide consistent vehicle and journey lookup across multiple internal and partner data sources.',
      'Support immediate responses and asynchronous completion for slower integrations.',
      'Preserve lookup history and normalized results for later review and export.',
      'Provide operational statistics and indexed search over journey and event records.',
      'Generate standardized DOCX, PDF, and spreadsheet outputs from maintained templates.',
      'Publish and consume workflow events without coupling interactive APIs to background processing.',
    ],
    challenges: [
      'Normalize heterogeneous integration responses into stable domain models.',
      'Support synchronous and asynchronous lookups with a consistent result lifecycle.',
      'Keep complex filters and aggregation queries maintainable.',
      'Separate interactive lookup traffic from statistics, indexing, and document generation.',
      'Coordinate cached state and event-driven updates without stale or duplicated results.',
    ],
    mermaid: {
      title: 'Generic fleet operations service flow',
      code: fleetOperationsDiagram,
    },
    mainFlow: [
      'A client submits a lookup or operational query.',
      'The API validates the request and records the lookup context.',
      'The application orchestrates one or more REST or gRPC integration adapters.',
      'Fast sources return synchronously while slower sources can complete through an event callback.',
      'Responses are normalized and aggregated into a stable domain result.',
      'History and result state are persisted and read projections are updated where applicable.',
      'The client reads the completed result or requests a generated document.',
    ],
    contributions: [
      'Built approximately 40 lookup APIs for vehicle, journey, and operational records.',
      'Built approximately 20 statistics APIs for operational reporting and aggregation.',
      'Built approximately 15 document and record-export APIs.',
      'Integrated internal services through gRPC and REST.',
      'Contributed to Kafka-based event processing and data-synchronization workers.',
      'Applied Redis for caching and short-lived coordination state where appropriate.',
    ],
    techStack: [
      'Java 17', 'Spring Boot', 'PostgreSQL', 'Redis', 'Kafka',
      'gRPC', 'REST', 'Elasticsearch', 'Docker', 'Document generation',
    ],
    scaling: {
      lookupApis: '~40 lookup APIs',
      statisticsApis: '~20 statistics APIs',
      exportApis: '~15 export APIs',
    },
    reliabilitySecurity: [
      'Validate requests and integration responses before mapping domain records.',
      'Preserve request and result history for traceability.',
      'Isolate background processing from interactive request paths.',
      'Use bounded cache and coordination state rather than Redis as the system of record.',
      'Represent integration failures through explicit fallback or pending-result states.',
    ],
    tradeoffs: [
      'Synchronous integration gives immediate feedback but couples latency to downstream services.',
      'Asynchronous completion improves resilience but adds a more complex result lifecycle.',
      'Redis reduces repeated work but requires explicit freshness and ownership rules.',
      'Elasticsearch improves search and aggregation while introducing eventual consistency.',
      'Template-driven export standardizes output while increasing version maintenance.',
    ],
    outcome: [
      'Established a consistent backend layer for lookup, reporting, and export workflows.',
      'Improved maintainability of operational queries through targeted optimization.',
      'Separated integration, search, statistics, and document concerns into clearer paths.',
    ],
    lessons: [
      'Normalize external responses at the integration boundary.',
      'Treat asynchronous completion as an explicit state machine.',
      'Measure query plans before optimizing.',
      'Keep generated-document workflows isolated from interactive APIs.',
    ],
  },
  {
    slug: 'fleetops-data-hub',
    featured: true,
    title: 'FleetOps Data Hub',
    subtitle:
      'A backend integration hub that consolidates logistics records for lookup, aggregation, synchronization, and search.',
    tags: ['Java 17', 'Spring Boot', 'Kafka', 'gRPC', 'Redis', 'Elasticsearch'],
    disclaimer:
      'The business domain and system boundaries are generalized; no customer, partner, or production details are published.',
    overview: {
      domain: 'Multi-source logistics data integration and search',
      role: 'Middle Backend Developer',
    },
    requirements: [
      'Consolidate vehicle, journey, delivery-status, and operational-incident records.',
      'Provide REST APIs for lookup and aggregation.',
      'Process synchronization events through Kafka workers.',
      'Integrate internal services through gRPC and REST.',
      'Support operational-record search through Elasticsearch.',
    ],
    challenges: [
      'Normalize records arriving from systems with different contracts.',
      'Keep relational and search-oriented views aligned.',
      'Separate synchronization processing from read-oriented APIs.',
      'Coordinate cache freshness without making Redis the source of truth.',
    ],
    mermaid: {
      title: 'Generic multi-source synchronization and search flow',
      code: dataHubDiagram,
    },
    mainFlow: [
      'Source systems provide operational records through integration adapters.',
      'Request-response integrations serve data that must be available immediately.',
      'Kafka events decouple background synchronization from source systems.',
      'Workers normalize and persist relational records and search projections.',
      'Lookup APIs use Redis, PostgreSQL, and Elasticsearch according to the read pattern.',
    ],
    contributions: [
      'Developed REST APIs for operational lookup and aggregation.',
      'Built Kafka consumers and data-synchronization workers.',
      'Integrated internal services through gRPC and REST.',
      'Used Redis for caching and short-lived coordination.',
      'Supported Elasticsearch-backed operational search.',
    ],
    techStack: [
      'Java 17', 'Spring Boot', 'PostgreSQL', 'Redis', 'Kafka',
      'gRPC', 'REST', 'Elasticsearch', 'Docker',
    ],
    scaling: {
      integrationModel: 'Multi-source integration',
      processingModel: 'Event-driven synchronization',
      searchModel: 'Search-optimized reads',
    },
    reliabilitySecurity: [
      'Keep the relational database as the source of truth.',
      'Separate asynchronous synchronization from interactive reads.',
      'Use bounded cache entries with explicit freshness rules.',
      'Keep customer data, credentials, and integration identifiers out of public artifacts.',
    ],
    tradeoffs: [
      'Asynchronous synchronization reduces coupling but introduces eventual consistency.',
      'A search projection improves query flexibility but adds index lifecycle work.',
      'Multiple integration styles improve fit but increase contract-management overhead.',
    ],
    outcome: [
      'Provided a consistent access layer across operational data sources.',
      'Separated integration processing from lookup and search concerns.',
    ],
    lessons: [
      'Choose synchronous or asynchronous integration from consistency needs.',
      'Keep synchronization state observable and bounded.',
      'Treat search indexes as rebuildable projections.',
    ],
  },
];
~~~

- [ ] **Step 5: Run the data contract and verify it passes**

~~~powershell
node --test tests/profile-data.test.js
~~~

Expected: PASS.

- [ ] **Step 6: Commit the safe content model**

~~~powershell
git add tests/profile-data.test.js src/data/profile.js src/data/projects.js src/data/earlierProjects.js
git commit -m 'feat: add full NDA-safe case study data'
~~~

---

### Task 2: Restore Accessible Architecture Diagrams

**Files:**
- Create: src/lib/mermaid.js
- Create: src/components/MermaidDiagram.jsx
- Create: src/components/DiagramModal.jsx
- Create: tests/reference-form.test.js
- Modify: package.json
- Modify: package-lock.json

**Interfaces:**
- Produces: renderMermaid(code, id) -> Promise<String>.
- Produces: MermaidDiagram({ code, title, className }).
- Produces: DiagramModal({ open, title, code, onClose }).

- [ ] **Step 1: Write failing structural tests for the diagram contract**

~~~js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = (path) => readFile(new URL(path, import.meta.url), 'utf8');

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
~~~

- [ ] **Step 2: Run the test and verify the diagram files and dependencies are missing**

~~~powershell
node --test tests/reference-form.test.js
~~~

Expected: FAIL with ENOENT for MermaidDiagram.jsx or DiagramModal.jsx.

- [ ] **Step 3: Install the exact diagram dependencies**

~~~powershell
npm install mermaid@^11.12.2 react-zoom-pan-pinch@^3.7.0
~~~

Expected: package.json and package-lock.json contain both dependencies with no audit-blocking install error.

- [ ] **Step 4: Implement strict Mermaid rendering**

Create src/lib/mermaid.js:

~~~js
import mermaid from 'mermaid';

let initialized = false;

export function initMermaid() {
  if (initialized) return;
  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'strict',
    themeVariables: {
      background: '#0b0f14',
      primaryColor: '#111827',
      primaryTextColor: '#e6edf3',
      primaryBorderColor: '#334155',
      lineColor: '#64748b',
      textColor: '#e6edf3',
      fontFamily:
        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
    },
  });
  initialized = true;
}

export async function renderMermaid(code, id) {
  initMermaid();
  const { svg } = await mermaid.render(id, code);
  return svg;
}
~~~

- [ ] **Step 5: Implement the accessible pan/zoom diagram**

Create src/components/MermaidDiagram.jsx with useId, useEffect, TransformWrapper, minScale 0.5, maxScale 4, role='img', aria-label={title}, and:

~~~jsx
<button type='button' aria-label='Zoom in' onClick={() => zoomIn()}>+</button>
<button type='button' aria-label='Zoom out' onClick={() => zoomOut()}>−</button>
<button type='button' aria-label='Reset diagram' onClick={() => resetTransform()}>
  Reset
</button>
~~~

Use this fallback:

~~~jsx
if (!renderedSvg) {
  return (
    <div role='status' className='rounded-xl border border-border bg-white/5 p-3 font-mono text-xs text-muted'>
      Architecture diagram could not be rendered.
    </div>
  );
}
~~~

- [ ] **Step 6: Implement Escape handling and focus restoration in the modal**

Create src/components/DiagramModal.jsx. Save document.activeElement in previousFocus.current, focus the Close button, close on Escape, and restore focus in cleanup:

~~~jsx
const previousFocus = useRef(null);
const closeButtonRef = useRef(null);

useEffect(() => {
  if (!open) return undefined;
  previousFocus.current = document.activeElement;
  closeButtonRef.current?.focus();
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') onClose?.();
  };
  document.addEventListener('keydown', handleKeyDown);
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
    previousFocus.current?.focus?.();
  };
}, [open, onClose]);
~~~

Use role='dialog', aria-modal='true', an aria-labelledby heading ID, backdrop click close, and an explicitly labeled Close button.

- [ ] **Step 7: Run diagram tests and lint**

~~~powershell
node --test tests/reference-form.test.js
npm run lint
~~~

Expected: PASS.

- [ ] **Step 8: Commit diagram infrastructure**

~~~powershell
git add package.json package-lock.json tests/reference-form.test.js src/lib/mermaid.js src/components/MermaidDiagram.jsx src/components/DiagramModal.jsx
git commit -m 'feat: restore accessible architecture diagrams'
~~~

---

### Task 3: Restore the Featured and Selected Project Form

**Files:**
- Modify: tests/reference-form.test.js
- Modify: src/components/ProjectCard.jsx
- Modify: src/components/sections/ProjectsSection.jsx

**Interfaces:**
- Consumes: FullProject from Task 1.
- Consumes: DiagramModal from Task 2.
- Produces: ProjectCard({ project, onOpenDiagram }).
- Produces: ProjectsSection() with featured cards, modal state, and selected snapshots.

- [ ] **Step 1: Add failing tests for the original-style project card**

~~~js
test('project cards expose metrics, detail navigation, and architecture preview', async () => {
  const [card, section] = await Promise.all([
    source('../src/components/ProjectCard.jsx'),
    source('../src/components/sections/ProjectsSection.jsx'),
  ]);

  assert.match(card, /Object\.entries\(project\.scaling\)\.slice\(0, 3\)/);
  assert.match(card, /Read Case Study/);
  assert.match(card, /Preview Architecture/);
  assert.match(card, /onOpenDiagram/);
  assert.match(section, /earlierProjects/);
  assert.match(section, /DiagramModal/);
});
~~~

- [ ] **Step 2: Run the test and verify the simplified card fails**

~~~powershell
node --test tests/reference-form.test.js
~~~

Expected: FAIL because ProjectCard has no metrics or Preview Architecture button.

- [ ] **Step 3: Implement the reference-form ProjectCard**

Render title, subtitle, NDA badge, first five tags, first three scaling entries, and two equal actions. The metric strip is:

~~~jsx
{project.scaling && (
  <div className='mt-6 grid grid-cols-3 gap-2 border-t border-white/5 pt-4'>
    {Object.entries(project.scaling).slice(0, 3).map(([key, value]) => (
      <div key={key} className='min-w-0'>
        <div className='truncate text-xl font-black text-white'>
          {value.split(' ')[0]}
        </div>
        <div className='mt-1 truncate text-[10px] uppercase tracking-wide text-muted/60'>
          {key.replace(/([A-Z])/g, ' $1').trim()}
        </div>
      </div>
    ))}
  </div>
)}
~~~

Read Case Study links to the project slug. Preview Architecture is type='button' and calls onOpenDiagram(project).

- [ ] **Step 4: Implement ProjectsSection modal and selected-project snapshots**

Use:

~~~js
const [modal, setModal] = useState({
  open: false,
  title: '',
  code: '',
});
~~~

Render projects in a responsive two-column grid. Under them, render earlierProjects in compact two-column Card components with name, summary, responsibilities, and technologies. Render DiagramModal once and populate it from project.mermaid.

- [ ] **Step 5: Run tests and lint**

~~~powershell
node --test tests/reference-form.test.js
npm run lint
~~~

Expected: PASS.

- [ ] **Step 6: Commit the project listing form**

~~~powershell
git add tests/reference-form.test.js src/components/ProjectCard.jsx src/components/sections/ProjectsSection.jsx
git commit -m 'feat: restore project cards and architecture previews'
~~~

---

### Task 4: Restore the Compact Homepage Shell and Visual Tokens

**Files:**
- Modify: tests/reference-form.test.js
- Modify: src/pages/Home.jsx
- Modify: src/components/Navbar.jsx
- Modify: src/components/Footer.jsx
- Modify: src/components/TableOfContents.jsx
- Modify: src/components/sections/HeroSection.jsx
- Modify: src/index.css
- Modify: tailwind.config.js

**Interfaces:**
- Consumes: profile from Task 1.
- Produces: homepage IDs about, highlights, tech-stack, projects, experience, contact.

- [ ] **Step 1: Add failing homepage-geometry tests**

~~~js
test('homepage uses the compact reference geometry and approved anchors', async () => {
  const [home, toc, hero] = await Promise.all([
    source('../src/pages/Home.jsx'),
    source('../src/components/TableOfContents.jsx'),
    source('../src/components/sections/HeroSection.jsx'),
  ]);

  assert.match(home, /lg:grid-cols-\[180px_1fr\]/);
  assert.match(home, /<TableOfContents/);
  assert.match(home, /space-y-24/);
  for (const id of ['about', 'highlights', 'tech-stack', 'projects', 'experience', 'contact']) {
    assert.match(toc, new RegExp("id: '" + id + "'"));
  }
  assert.match(hero, /text-center/);
  assert.doesNotMatch(hero, /resume|CV_/i);
  assert.doesNotMatch(home, /EarlierProjectsSection|EducationSection/);
});
~~~

- [ ] **Step 2: Run the test and verify the current shell fails**

~~~powershell
node --test tests/reference-form.test.js
~~~

Expected: FAIL on the 180px grid, section IDs, and centered hero.

- [ ] **Step 3: Restore the charcoal palette**

In tailwind.config.js:

~~~js
colors: {
  bg: '#0b0f14',
  surface: '#0f1722',
  panel: 'rgba(255,255,255,0.045)',
  border: 'rgba(148,163,184,0.18)',
  text: '#e6edf3',
  muted: '#94a3b8',
  accent: '#38bdf8',
  accent2: '#a78bfa',
  primary: '#60a5fa',
  ok: '#34d399',
},
boxShadow: {
  glow: '0 22px 65px rgba(0,0,0,0.32)',
},
~~~

In src/index.css remove section-shell, console, and full-width redesign primitives. Add three subtle page radial gradients, compact link/focus styles, reveal styles, and the reduced-motion override. Keep scroll-padding-top at 5rem.

- [ ] **Step 4: Implement compact navbar, footer, and table of contents**

Navbar is sticky and compact, uses profile.shortName plus @backend, uses import.meta.env.BASE_URL for homepage anchors, and has no resume link.

TableOfContents uses:

~~~js
const sections = [
  { id: 'about', label: 'About' },
  { id: 'highlights', label: 'Highlights' },
  { id: 'tech-stack', label: 'Tech Stack' },
  { id: 'projects', label: 'Case Studies' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];
~~~

It is sticky top-24 inside the desktop aside and preserves IntersectionObserver scrollspy. Footer is a centered stacked copyright and Java backend tagline.

- [ ] **Step 5: Replace the split hero with the centered reference hero**

Render status, full name, this supporting line, summary, two CTAs, location, and work modes:

~~~jsx
<p className='mt-6 font-mono text-sm tracking-widest text-accent sm:text-base'>
  JAVA · SPRING BOOT · DATA & SERVICE INTEGRATIONS
</p>
~~~

Do not render experience years or a resume link.

- [ ] **Step 6: Compose the homepage grid**

~~~jsx
<>
  <Helmet>{/* retain current Tam metadata and Person JSON-LD */}</Helmet>
  <HeroSection />
  <Container className='pb-24'>
    <div className='lg:grid lg:grid-cols-[180px_1fr] lg:gap-12'>
      <aside className='relative'>
        <TableOfContents />
      </aside>
      <main className='space-y-24'>
        <FocusSection />
        <StackSection />
        <ProjectsSection />
        <ExperienceSection />
        <ContactSection />
      </main>
    </div>
  </Container>
</>
~~~

Remove EarlierProjectsSection and EducationSection imports.

- [ ] **Step 7: Run structural tests and lint**

~~~powershell
node --test tests/reference-form.test.js
npm run lint
~~~

Expected: PASS.

- [ ] **Step 8: Commit the homepage shell**

~~~powershell
git add tests/reference-form.test.js src/pages/Home.jsx src/components/Navbar.jsx src/components/Footer.jsx src/components/TableOfContents.jsx src/components/sections/HeroSection.jsx src/index.css tailwind.config.js
git commit -m 'feat: restore compact reference portfolio shell'
~~~

---

### Task 5: Convert Homepage Content Sections to the Reference Form

**Files:**
- Modify: tests/reference-form.test.js
- Modify: src/components/sections/FocusSection.jsx
- Modify: src/components/sections/StackSection.jsx
- Modify: src/components/sections/ExperienceSection.jsx
- Modify: src/components/sections/ContactSection.jsx
- Delete: src/components/SectionHeading.jsx
- Delete: src/components/sections/EarlierProjectsSection.jsx
- Delete: src/components/sections/EducationSection.jsx

**Interfaces:**
- Consumes: profile and ProjectsSection.
- Produces: compact section components without nested Container wrappers.

- [ ] **Step 1: Add failing tests for compact content sections**

~~~js
test('homepage sections use compact headings and merge education into experience', async () => {
  const [focus, stack, experience, contact] = await Promise.all([
    source('../src/components/sections/FocusSection.jsx'),
    source('../src/components/sections/StackSection.jsx'),
    source('../src/components/sections/ExperienceSection.jsx'),
    source('../src/components/sections/ContactSection.jsx'),
  ]);

  assert.match(focus, /id=['"]highlights['"]/);
  assert.match(focus, /border-l-2/);
  assert.match(stack, /id=['"]tech-stack['"]/);
  assert.match(stack, /Core Stack/);
  assert.match(stack, /Delivery & Supporting/);
  assert.match(experience, /profile\.education/);
  assert.match(experience, /profile\.certifications/);
  assert.match(experience, /profile\.english/);
  assert.match(contact, /mailto:/);
  assert.doesNotMatch([focus, stack, experience, contact].join(' '), /SectionHeading|<Container/);
});
~~~

- [ ] **Step 2: Run the test and verify current full-width sections fail**

~~~powershell
node --test tests/reference-form.test.js
~~~

Expected: FAIL because the current sections use Container and SectionHeading.

- [ ] **Step 3: Implement compact highlights**

FocusSection returns section id='highlights':

~~~jsx
<div className='font-mono text-xs text-muted'>Highlights</div>
<h2 className='mt-2 text-xl font-black text-text'>What I build and improve</h2>
<div className='mt-8 grid gap-x-12 gap-y-8 md:grid-cols-2'>
  {profile.focus.map((item) => (
    <article key={item.title} className='border-l-2 border-white/10 pl-4 transition hover:border-accent/40'>
      <h3 className='text-lg font-bold text-text/90'>{item.title}</h3>
      <p className='mt-2 text-sm leading-relaxed text-muted'>{item.description}</p>
    </article>
  ))}
</div>
~~~

- [ ] **Step 4: Implement two compact stack cards**

StackSection returns section id='tech-stack'. Core Stack combines profile.stack.backend and profile.stack.dataMessaging. Delivery & Supporting combines profile.stack.delivery and profile.stack.supporting. Use Tag for all items and stronger accent treatment for core items.

- [ ] **Step 5: Implement the timeline and compact learning block**

ExperienceSection returns section id='experience' and renders:

1. GTEL OTS - Aug 2024 to Present.
2. FPT Software Internship - no invented date.
3. FPT University - 2019 to 2023 - Good classification.
4. Four approved certification links.
5. profile.english.

Use one vertical line, date/label column, dot, title, organization, and bullet content. Do not claim a seniority level or team leadership.

- [ ] **Step 6: Implement the compact contact card**

ContactSection returns section id='contact', a small heading, and one Card with location, work modes, email, phone, GitHub, and LinkedIn. External links use target='_blank' and rel='noreferrer'; email and phone remain direct links.

- [ ] **Step 7: Delete superseded section components**

~~~powershell
git rm src/components/SectionHeading.jsx
git rm src/components/sections/EarlierProjectsSection.jsx
git rm src/components/sections/EducationSection.jsx
~~~

- [ ] **Step 8: Run tests and lint**

~~~powershell
npm test
npm run lint
~~~

Expected: PASS.

- [ ] **Step 9: Commit compact content sections**

~~~powershell
git add tests/reference-form.test.js src/components/sections/FocusSection.jsx src/components/sections/StackSection.jsx src/components/sections/ExperienceSection.jsx src/components/sections/ContactSection.jsx
git commit -m 'feat: align portfolio sections with reference form'
~~~

---

### Task 6: Restore the Full Large-Project Case-Study Form

**Files:**
- Modify: tests/reference-form.test.js
- Modify: src/pages/ProjectDetail.jsx

**Interfaces:**
- Consumes: FullProject from Task 1.
- Consumes: MermaidDiagram from Task 2.
- Produces: /projects/:slug detail page with conditional sections.

- [ ] **Step 1: Add failing tests for every case-study section**

~~~js
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
    'Scaling & Metrics',
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
~~~

- [ ] **Step 2: Run the test and verify the simplified detail page fails**

~~~powershell
node --test tests/reference-form.test.js
~~~

Expected: FAIL because the simplified detail page lacks the reference sections.

- [ ] **Step 3: Add conditional section and list helpers**

~~~jsx
function hasContent(value) {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === 'object') return Object.keys(value).length > 0;
  return Boolean(value);
}

function Section({ title, children, when = true }) {
  if (!when) return null;
  return (
    <section className='mt-6'>
      <div className='font-mono text-xs text-muted'>{title}</div>
      <div className='mt-2'>{children}</div>
    </section>
  );
}
~~~

For list data, render strings as bullets. If an item contains phase and steps, render phase in bold and steps as an ordered list.

- [ ] **Step 4: Render the header and conditional overview**

Header order:

1. Case study (NDA-friendly) eyebrow.
2. H1 title.
3. Subtitle.
4. All technology tags.
5. Disclaimer card.
6. Back link.

Overview renders only truthy domain, duration, role, teamSize, and scale fields. Unknown duration/team fields produce no labels.

- [ ] **Step 5: Render every approved section in order**

~~~jsx
<Section title='Overview' when={hasContent(project.overview)}>
  <Card className='p-5'>
    <div className='grid gap-3 text-sm text-muted sm:grid-cols-2'>
      {project.overview.domain && <div><span className='font-mono text-xs'>Domain:</span> {project.overview.domain}</div>}
      {project.overview.duration && <div><span className='font-mono text-xs'>Duration:</span> {project.overview.duration}</div>}
      {project.overview.role && <div><span className='font-mono text-xs'>Role:</span> {project.overview.role}</div>}
      {project.overview.teamSize && <div><span className='font-mono text-xs'>Team size:</span> {project.overview.teamSize}</div>}
      {project.overview.scale && <div className='sm:col-span-2'><span className='font-mono text-xs'>Scale:</span> {project.overview.scale}</div>}
    </div>
  </Card>
</Section>
<Section title='Requirements' when={hasContent(project.requirements)}>
  <Card className='p-5'><List items={project.requirements} /></Card>
</Section>
<Section title='Key Challenges' when={hasContent(project.challenges)}>
  <Card className='p-5'><List items={project.challenges} /></Card>
</Section>
<Section title='Architecture Diagram' when={hasContent(project.mermaid?.code)}>
  <Card className='p-5'>
    <div className='mb-3 text-sm font-bold text-text'>{project.mermaid.title}</div>
    <MermaidDiagram title={project.mermaid.title} code={project.mermaid.code} />
  </Card>
</Section>
<Section title='Main Flow' when={hasContent(project.mainFlow)}>
  <Card className='p-5'><List items={project.mainFlow} /></Card>
</Section>
<Section title='My Contributions' when={hasContent(project.contributions)}>
  <Card className='p-5'><List items={project.contributions} /></Card>
</Section>
<Section title='Tech Stack' when={hasContent(project.techStack)}>
  <Card className='p-5'>
    <div className='flex flex-wrap gap-2'>
      {project.techStack.map((technology) => <Tag key={technology}>{technology}</Tag>)}
    </div>
  </Card>
</Section>
<Section title='Scaling & Metrics (approx)' when={hasContent(project.scaling)}>
  <Card className='p-5'>
    <div className='grid gap-2 text-sm text-muted'>
      {Object.entries(project.scaling).map(([key, value]) => (
        <div key={key}><span className='font-mono text-xs'>{key}:</span> {value}</div>
      ))}
    </div>
  </Card>
</Section>
<Section title='Reliability & Security' when={hasContent(project.reliabilitySecurity)}>
  <Card className='p-5'><List items={project.reliabilitySecurity} /></Card>
</Section>
<Section title='Trade-offs / Design Decisions' when={hasContent(project.tradeoffs)}>
  <Card className='p-5'><List items={project.tradeoffs} /></Card>
</Section>
<Section title='Outcome / Impact' when={hasContent(project.outcome)}>
  <Card className='p-5'><List items={project.outcome} /></Card>
</Section>
<Section title='Lessons Learned' when={hasContent(project.lessons)}>
  <Card className='p-5'><List items={project.lessons} /></Card>
</Section>
~~~

Use the exact field renders above; do not emit blank sections.

- [ ] **Step 6: Keep safe SEO and not-found behavior**

~~~js
const title = project
  ? project.title + ' - Case Study | ' + profile.name
  : 'Project Not Found | ' + profile.name;
~~~

Not-found output sets robots noindex, shows Project not found, and links home. Valid pages use the current GitHub Pages canonical base.

- [ ] **Step 7: Run tests and lint**

~~~powershell
node --test tests/reference-form.test.js
npm run lint
~~~

Expected: PASS.

- [ ] **Step 8: Commit full case-study pages**

~~~powershell
git add tests/reference-form.test.js src/pages/ProjectDetail.jsx
git commit -m 'feat: restore full backend case study form'
~~~

---

### Task 7: Update Routes, Prerendering, Sitemap, and Public Documentation

**Files:**
- Modify: tests/profile-data.test.js
- Modify: scripts/prerender.js
- Modify: public/sitemap.xml
- Modify: README.md
- Verify: src/pages/Home.jsx
- Verify: public/favicon.svg
- Verify: public/og.svg

**Interfaces:**
- Produces: prerendered homepage and both case-study URLs under the configured Vite base.

- [ ] **Step 1: Add failing route assertions**

~~~js
for (const slug of [
  'fleet-operations-management-platform',
  'fleetops-data-hub',
]) {
  assert.match(prerender, new RegExp('/projects/' + slug));
  assert.match(sitemap, new RegExp('/projects/' + slug));
}
assert.doesNotMatch(prerender, /fleet-operations-platform/);
assert.doesNotMatch(sitemap, /fleet-operations-platform/);
~~~

- [ ] **Step 2: Run the route test and verify the old slug fails**

~~~powershell
node --test tests/profile-data.test.js
~~~

Expected: FAIL because prerender.js and sitemap.xml still use the old slug.

- [ ] **Step 3: Update prerender routes and sitemap**

~~~js
const ROUTES = [
  '/',
  '/projects/fleet-operations-management-platform',
  '/projects/fleetops-data-hub',
];
~~~

public/sitemap.xml contains only the homepage and these two project URLs under https://tamtnts.github.io/portfolio/.

- [ ] **Step 4: Update README with only current public facts**

README contains Nguyen Thanh Tam - Middle Backend Developer, React/Vite/Tailwind, the four local verification commands, and GitHub Pages deployment from main. It contains no private-reference, legacy-source, CV, customer, or alternative-remote details.

- [ ] **Step 5: Verify SEO assets are Tam-only**

Check Home title/description/Person JSON-LD, favicon initials NT, and OG asset text. Modify only if a non-Tam identity or stale slug remains.

- [ ] **Step 6: Run tests and the production build**

~~~powershell
npm test
npm run lint
$env:VITE_BASE='/portfolio/'
npm run build
Remove-Item Env:VITE_BASE
~~~

Expected: tests and lint PASS; build and postbuild prerender three routes.

- [ ] **Step 7: Commit publishing updates**

~~~powershell
git add tests/profile-data.test.js scripts/prerender.js public/sitemap.xml README.md src/pages/Home.jsx public/favicon.svg public/og.svg
git commit -m 'chore: update portfolio routes and publishing metadata'
~~~

---

### Task 8: Replace Plaintext Legacy Checks with Privacy Fingerprints

**Files:**
- Create: tests/privacy-content.test.js
- Delete: tests/legacy-content.test.js
- Delete: docs/superpowers/specs/2026-07-24-nguyen-thanh-tam-portfolio-design.md
- Delete: docs/superpowers/plans/2026-07-27-nguyen-thanh-tam-portfolio-implementation.md
- Verify: current reference-form design and implementation documents

**Interfaces:**
- Produces: deterministic Node test scanning src, public, scripts, .github, docs, tests, README.md, index.html, and package.json.

- [ ] **Step 1: Create the privacy test using irreversible fingerprints**

~~~js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const scanRoots = [
  'src/', 'public/', 'scripts/', '.github/', 'docs/', 'tests/',
  'README.md', 'index.html', 'package.json',
];
const textExtensions = new Set([
  '.js', '.jsx', '.css', '.html', '.md', '.txt', '.xml',
  '.yml', '.yaml', '.svg', '.json',
]);

const forbiddenFingerprints = [
  [12, 3805401364, 2869398],
  [8, 1899127545, 479679949],
  [10, 3226578794, 2326618614],
  [17, 2394731075, 1320841263],
  [21, 3043783325, 722152783],
  [18, 2284759960, 3835361618],
  [10, 3152765206, 1134247266],
  [10, 2268324061, 2041240491],
  [21, 2262463286, 3805970502],
  [8, 1169559499, 1826898499],
  [27, 2917820166, 1785335738],
  [4, 1816428836, 2085467056],
  [19, 405486669, 3227277297],
  [20, 2926039294, 2881884172],
  [20, 2179689245, 429797887],
  [32, 1847093991, 2514252251],
  [9, 4142694780, 2371706460],
  [16, 1048116157, 1907713097],
  [15, 3344518971, 1414395131],
  [29, 1954747953, 2841850537],
  [36, 4181196539, 1214378117],
];

const forbiddenPatterns = [
  ['private network URL', /https?:\/\/(?:10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.)/i],
  ['credential-like material', /x-amz-(?:credential|signature)|authorization:\s*bearer|client[_-]?secret|secret[_-]?key/i],
  ['private Windows source path', /\b[a-z]:\\(?:project-\d+|users\\[^\\]+\\(?:downloads|desktop))\\/i],
];

function fnv1a(value) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function djb2(value) {
  let hash = 5381;
  for (let index = 0; index < value.length; index += 1) {
    hash = (Math.imul(hash, 33) ^ value.charCodeAt(index)) >>> 0;
  }
  return hash >>> 0;
}

function containsFingerprint(content, [length, expectedFnv, expectedDjb]) {
  const normalized = content.toLowerCase();
  for (let index = 0; index <= normalized.length - length; index += 1) {
    const candidate = normalized.slice(index, index + length);
    if (fnv1a(candidate) === expectedFnv && djb2(candidate) === expectedDjb) {
      return true;
    }
  }
  return false;
}

async function collect(entryUrl) {
  const entryStat = await stat(entryUrl);
  if (entryStat.isFile()) return [entryUrl];
  const entries = await readdir(entryUrl, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) =>
      collect(new URL(entry.name + (entry.isDirectory() ? '/' : ''), entryUrl)),
    ),
  );
  return nested.flat();
}

test('public repository tree contains no private or legacy identifiers', async () => {
  const files = (await Promise.all(scanRoots.map((entry) => collect(new URL(entry, root)))))
    .flat()
    .filter((url) => textExtensions.has(extname(url.pathname)));
  const violations = [];

  for (const file of files) {
    const content = await readFile(file, 'utf8');
    const label = relative(fileURLToPath(root), fileURLToPath(file));
    for (const fingerprint of forbiddenFingerprints) {
      if (containsFingerprint(content, fingerprint)) {
        violations.push(label + ' -> forbidden identifier fingerprint');
      }
    }
    for (const [name, pattern] of forbiddenPatterns) {
      if (pattern.test(content)) violations.push(label + ' -> ' + name);
    }
  }

  assert.deepEqual(violations, []);
});
~~~

- [ ] **Step 2: Run the privacy test and verify it finds old plaintext artifacts**

~~~powershell
node --test tests/privacy-content.test.js
~~~

Expected: FAIL with fingerprint violations in the old plaintext test and superseded documents.

- [ ] **Step 3: Remove plaintext and superseded artifacts**

~~~powershell
git rm tests/legacy-content.test.js
git rm docs/superpowers/specs/2026-07-24-nguyen-thanh-tam-portfolio-design.md
git rm docs/superpowers/plans/2026-07-27-nguyen-thanh-tam-portfolio-implementation.md
~~~

Do not weaken a fingerprint to obtain a pass. If a current document matches, replace unsafe wording with a neutral phrase.

- [ ] **Step 4: Run the complete suite**

~~~powershell
npm test
~~~

Expected: PASS with no private or legacy identifier retained in the scanned tree.

- [ ] **Step 5: Commit privacy guards and cleanup**

~~~powershell
git add tests/privacy-content.test.js
git commit -m 'test: guard public portfolio privacy'
~~~

---

### Task 9: End-to-End Verification and Clean GitHub Release Preparation

**Files:**
- Verify: all tracked files
- Verify: dist/
- Verify: .github/workflows/deploy.yml

**Interfaces:**
- Produces: verified feat/tam-portfolio tree and, only after explicit release approval, one clean fast-forward commit on GitHub main.

- [ ] **Step 1: Run full automated verification**

~~~powershell
git status --short
npm test
npm run lint
$env:VITE_BASE='/portfolio/'
npm run build
Remove-Item Env:VITE_BASE
git diff --check
~~~

Expected: tests, lint, build, and prerender pass; diff check reports no errors.

- [ ] **Step 2: Scan generated output for generic private material**

~~~powershell
rg -n -i 'x-amz-(credential|signature)|https?://10\.|192\.168\.|authorization:\s*bearer|client[_-]?secret|secret[_-]?key' dist
~~~

Expected: no matches and rg exit code 1.

- [ ] **Step 3: Perform visual and interaction verification**

~~~powershell
npm run dev -- --host 127.0.0.1
~~~

Inspect at 1440x900 and 390x844:

- Centered hero and no resume link.
- Sticky reference table of contents on desktop.
- Compact highlights, stack, projects, timeline, certificates, and contact.
- Two featured cards and three selected cards.
- Project-one numeric delivery metrics and project-two qualitative highlights.
- Read Case Study navigation.
- Preview Architecture modal, Escape, backdrop close, focus restoration, zoom, reset, and reduced motion.
- Both inline project diagrams.
- No blank optional fields.
- Not-found route and all contact/certificate links.

Expected: no clipping, overflow, overlap, unreadable contrast, broken diagram, stale identity, or console error.

- [ ] **Step 4: Request code review and resolve findings**

Invoke superpowers:requesting-code-review against the approved design, this plan, privacy test, and visual evidence. Fix behavior findings with a failing test first. Repeat npm test, npm run lint, npm run build, and git diff --check.

- [ ] **Step 5: Verify release ancestry**

~~~powershell
git log --oneline --decorate --graph --all -15
git show --summary --oneline origin/main
git status --short
~~~

Expected: origin/main is the clean public root. Do not merge feat/tam-portfolio.

- [ ] **Step 6: After explicit approval, create a clean release worktree**

~~~powershell
$portfolioReleasePath = 'D:\nghich\portfolio\.worktrees\release-main'
git worktree add -b release/reference-form $portfolioReleasePath origin/main
$resolvedReleasePath = (Resolve-Path -LiteralPath $portfolioReleasePath).Path
if (-not $resolvedReleasePath.StartsWith('D:\nghich\portfolio\.worktrees\')) {
  throw 'Release worktree resolved outside the approved workspace.'
}
git -C $resolvedReleasePath read-tree --reset -u feat/tam-portfolio
git -C $resolvedReleasePath status --short
~~~

Expected: the release worktree is based on origin/main and its tree matches the verified feature branch. Do not use merge.

- [ ] **Step 7: Verify and commit the clean release tree**

Inside the release worktree:

~~~powershell
npm ci
npm test
npm run lint
$env:VITE_BASE='/portfolio/'
npm run build
Remove-Item Env:VITE_BASE
git add -A
git commit -m 'feat: launch reference-form Java backend portfolio'
git log --oneline --decorate --graph -3
~~~

Expected: the new release commit has origin/main as its single parent and no feature ancestry.

- [ ] **Step 8: Push only to GitHub main**

~~~powershell
git push origin HEAD:main
~~~

Expected: fast-forward push succeeds.

- [ ] **Step 9: Verify GitHub Pages**

Confirm the Pages workflow passes, both project URLs and the sitemap work, nested route refresh works, repository history remains clean, and repository search reveals no forbidden identifier.

---

## Plan Self-Review Results

- Spec coverage: homepage form, content, both case studies, diagrams, optional fields, accessibility, SEO, privacy, clean history, tests, visual review, and GitHub-only release all have explicit tasks.
- Placeholder scan: no deferred content is permitted. The rendering excerpt in Task 6 explicitly requires concrete field renders rather than literal ellipsis.
- Type consistency: ProjectCard and ProjectDetail consume the FullProject scaling, mermaid, overview, and list fields defined in Task 1. DiagramModal and MermaidDiagram signatures match Tasks 2, 3, and 6.
- Scope: this is one testable portfolio redesign. Release preparation is gated after implementation review.
