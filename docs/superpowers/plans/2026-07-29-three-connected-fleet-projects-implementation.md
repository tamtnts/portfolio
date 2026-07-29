# Three Connected Fleet Projects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the two existing featured case studies with three NDA-safe, interconnected fleet-platform service case studies and publish all three through the homepage, detail routes, prerender output, and sitemap.

**Architecture:** Keep project copy in `src/data/projects.js`, add one focused data module for the shared platform narrative, and add one presentation component for the homepage ecosystem diagram. Existing generic card, modal, Mermaid, and detail-page components remain the rendering foundation; the detail page derives related-service links directly from the project collection.

**Tech Stack:** React 19, React Router, Tailwind CSS, Mermaid, Node test runner, Vite, Playwright prerendering, GitHub Pages.

## Global Constraints

- Publish exactly three featured projects: `Fleet Operations Core`, `Fleet Administration & Dispatch`, and `Fleet Data Intelligence Hub`.
- Treat all three projects as services in one fictionalized Fleet Operations Platform.
- Publish no private repository names, filesystem paths, organizations, domain-specific identifiers, endpoints, topics, schemas, credentials, infrastructure addresses, or deployment topology.
- Publish no API counts, data volumes, user counts, latency, throughput, availability, percentages, or other unverified metrics.
- Keep contribution wording scoped to REST APIs, database queries, Redis, Kafka, REST/gRPC integrations, document generation, and synchronization workers; never claim ownership of an entire service.
- Use REST/gRPC for generalized synchronous boundaries and Kafka for generalized asynchronous synchronization.
- Preserve responsive design, keyboard accessibility, route metadata, prerender validation, sitemap coverage, and GitHub Pages base-path behavior.
- Do not modify unrelated profile, experience, education, certificate, contact, or CV content.

## File Structure

- Create `src/data/fleetPlatform.js`: shared platform name, summary, confidentiality note, and ecosystem Mermaid diagram.
- Modify `src/data/projects.js`: three complete project records and three service-specific diagrams.
- Create `src/components/FleetPlatformOverview.jsx`: render the shared platform introduction and diagram.
- Modify `src/components/sections/ProjectsSection.jsx`: place the shared overview before a responsive three-card grid.
- Modify `src/components/ProjectCard.jsx`: render service labels and qualitative highlights instead of numeric delivery metrics.
- Modify `src/pages/ProjectDetail.jsx`: identify each service, remove the obsolete delivery-metrics section, and add related-service navigation.
- Create `tests/connected-projects.test.js`: central data, relationship, contribution, and confidentiality contract.
- Modify `tests/profile-data.test.js`: expect three complete projects without delivery metrics and expect the new public routes.
- Modify `tests/reference-form.test.js`: cover the platform overview, three-column card layout, qualitative highlights, and related-service section.
- Modify `tests/task-9-followup.test.js`: point contribution assertions at the new Operations Core slug.
- Modify `tests/task-9-remediation.test.js`: replace obsolete numeric assertions with the approved qualitative and privacy contracts.
- Modify `tests/prerender-html.test.js` and `tests/prerender-paths.test.js`: use current project slugs in fixtures.
- Modify `scripts/prerender.js`: prerender the three new project routes and remove the two retired routes.
- Modify `public/sitemap.xml`: publish the same three new routes and remove the two retired routes.

---

### Task 1: Establish the Three-Project Public Data Contract

**Files:**
- Create: `tests/connected-projects.test.js`
- Modify: `tests/profile-data.test.js`
- Modify: `tests/task-9-followup.test.js`
- Modify: `tests/task-9-remediation.test.js`
- Modify: `src/data/projects.js`

**Interfaces:**
- Consumes: no new runtime interface.
- Produces: `projects: Project[]`, where every project exposes `slug`, `featured`, `serviceLabel`, `title`, `subtitle`, `tags`, `disclaimer`, `overview`, `requirements`, `challenges`, `mermaid`, `mainFlow`, `contributions`, `techStack`, `highlights`, `reliabilitySecurity`, `tradeoffs`, `outcome`, and `lessons`.

- [ ] **Step 1: Write the failing central contract test**

Create `tests/connected-projects.test.js` with this exact contract:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { projects } from '../src/data/projects.js';

const expectedProjects = [
  ['fleet-operations-core', 'Fleet Operations Core', 'Service 01 / Operational Core'],
  ['fleet-administration-dispatch', 'Fleet Administration & Dispatch', 'Service 02 / Administration'],
  ['fleet-data-intelligence-hub', 'Fleet Data Intelligence Hub', 'Service 03 / Data Intelligence'],
];

test('publishes three connected fleet-platform services', () => {
  assert.deepEqual(
    projects.map(({ slug, title, serviceLabel }) => [slug, title, serviceLabel]),
    expectedProjects,
  );

  for (const project of projects) {
    assert.equal(project.featured, true);
    assert.equal(project.overview.role, 'Middle Backend Developer');
    assert.match(project.overview.platform, /Fleet Operations Platform/);
    assert.equal(project.highlights.length, 3);
    assert.equal(project.scaling, undefined);

    for (const [, title] of expectedProjects) {
      assert.match(project.mermaid.code, new RegExp(title.replace('&', '&')));
    }
  }
});

test('keeps the three case studies qualitative and NDA-safe', () => {
  const publicText = JSON.stringify(projects);
  assert.doesNotMatch(publicText, /~?\d+\s*(?:apis?|ms|%|users?|requests?|records?)/i);
  assert.doesNotMatch(publicText, /\b[a-z]:\\|src\/(?:main|test)|localhost|private network|consumer group/i);
  assert.doesNotMatch(publicText, /owned the entire|designed the entire|solely responsible/i);
});

test('publishes only approved contribution themes', () => {
  const operations = projects[0].contributions.join(' ');
  const administration = projects[1].contributions.join(' ');
  const intelligence = projects[2].contributions.join(' ');

  assert.match(operations, /REST|gRPC|Redis|Kafka|document/i);
  assert.match(administration, /API|database|Redis|Kafka|gRPC/i);
  assert.match(intelligence, /worker|lookup|Elasticsearch|Kafka|gRPC/i);
});
```

- [ ] **Step 2: Run the new test and verify the expected failure**

Run:

```powershell
& 'C:\Program Files\nodejs\npm.cmd' test -- --test-name-pattern="three connected|qualitative|contribution themes"
```

Expected: FAIL because the current collection contains two projects and has no `serviceLabel`, `overview.platform`, or `highlights` contract.

- [ ] **Step 3: Replace the project data with three exact NDA-safe records**

Replace `src/data/projects.js`. Use three diagrams that contain all public service titles and highlight only the current service through Mermaid's `class` directive. The exported data must use the following exact public copy and no `scaling` field:

```js
const operationsDiagram = [
  'flowchart LR',
  '  Client[Operations Client] --> API[REST and gRPC APIs]',
  '  API --> Core[Fleet Operations Core]',
  '  Admin[Fleet Administration & Dispatch] -->|Plans, resources, configuration| Core',
  '  Core --> Workflow[Workflow and query use cases]',
  '  Workflow --> Store[(Relational data)]',
  '  Workflow --> Cache[(Redis)]',
  '  Workflow --> Documents[Document generation]',
  '  Workflow --> Events[(Kafka)]',
  '  Events --> Data[Fleet Data Intelligence Hub]',
  '  Core -->|Lookup and search| Data',
  '  Data -->|Aggregated reads| Core',
  '  class Core current',
  '  classDef current fill:#123047,stroke:#38bdf8,color:#e6edf3,stroke-width:2px',
].join('\n');

const administrationDiagram = [
  'flowchart LR',
  '  AdminClient[Administration Client] --> API[REST and gRPC APIs]',
  '  API --> Admin[Fleet Administration & Dispatch]',
  '  Admin --> Plans[Planning and assignments]',
  '  Admin --> Resources[Resources and devices]',
  '  Admin --> Config[Configuration and reference data]',
  '  Plans --> Store[(Relational data)]',
  '  Resources --> Cache[(Redis and coordination)]',
  '  Admin -->|Operational context| Core[Fleet Operations Core]',
  '  Admin --> Events[(Kafka)]',
  '  Events --> Data[Fleet Data Intelligence Hub]',
  '  Admin -->|Aggregated lookup| Data',
  '  class Admin current',
  '  classDef current fill:#123047,stroke:#38bdf8,color:#e6edf3,stroke-width:2px',
].join('\n');

const intelligenceDiagram = [
  'flowchart LR',
  '  Admin[Fleet Administration & Dispatch] --> Events[(Kafka)]',
  '  Core[Fleet Operations Core] --> Events',
  '  Sources[Approved Source Systems] --> Adapters[Integration Adapters]',
  '  Events --> Workers[Synchronization Workers]',
  '  Adapters --> Workers',
  '  Workers --> Data[Fleet Data Intelligence Hub]',
  '  Data --> Store[(Operational read data)]',
  '  Data --> Search[(Elasticsearch)]',
  '  Data --> Documents[(Document-oriented data)]',
  '  Core -->|Lookup and aggregation| Data',
  '  Admin -->|Lookup and aggregation| Data',
  '  Data -->|Normalized responses| Core',
  '  Data -->|Normalized responses| Admin',
  '  class Data current',
  '  classDef current fill:#123047,stroke:#38bdf8,color:#e6edf3,stroke-width:2px',
].join('\n');

export const projects = [
  {
    slug: 'fleet-operations-core',
    featured: true,
    serviceLabel: 'Service 01 / Operational Core',
    title: 'Fleet Operations Core',
    subtitle: 'The central backend service for fleet workflows, interactive lookup, operational statistics, and document generation.',
    tags: ['Java 17', 'Spring Boot', 'REST', 'gRPC', 'Kafka', 'Redis'],
    disclaimer: 'This case study is generalized for confidentiality. Names, boundaries, and flows do not reproduce the private production system.',
    overview: {
      domain: 'Fleet operations, workflow, lookup, and reporting',
      platform: 'A core service within the Fleet Operations Platform',
      role: 'Middle Backend Developer',
    },
    requirements: [
      'Expose REST and gRPC interfaces for operational workflow and lookup use cases.',
      'Apply workflow and state rules before supported persistence changes.',
      'Use administration context for planning, resource, and configuration needs.',
      'Publish selected operational events for asynchronous synchronization.',
      'Generate approved document outputs for supported operational flows.',
    ],
    challenges: [
      'Keep synchronous request flows consistent across service boundaries.',
      'Coordinate relational data, explicit cache state, events, and search-backed reads.',
      'Keep workflow transitions and ownership rules visible in use-case orchestration.',
      'Generate documents without coupling templates to transport-layer contracts.',
    ],
    mermaid: { title: 'Fleet Operations Core within the connected platform', code: operationsDiagram },
    mainFlow: [
      'An operations client submits a request through a REST or gRPC interface.',
      'The API boundary validates and maps the request to a use case.',
      'The use case applies workflow, state, and ownership rules.',
      'The service accesses relational data and explicit Redis state where appropriate.',
      'It requests administration context or aggregated data when the workflow requires it.',
      'It returns a normalized response, generates a document, or publishes an operational event.',
    ],
    contributions: [
      'Developed REST APIs and mappings for supported operational workflows.',
      'Worked on relational database queries and use-case orchestration.',
      'Integrated related services through REST and gRPC boundaries.',
      'Used Redis for explicit cache and short-lived workflow state.',
      'Contributed to selected Kafka event paths and document-generation flows.',
    ],
    techStack: ['Java 17', 'Spring Boot', 'REST', 'gRPC', 'Kafka', 'Redis', 'Elasticsearch', 'Relational database', 'OpenFeign', 'PDF and document generation', 'Docker'],
    highlights: ['Operational workflows', 'Service integration', 'Document output'],
    reliabilitySecurity: [
      'Validate requests and supported ownership context at the service boundary.',
      'Keep cache responsibilities explicit and separate from relational truth.',
      'Use bounded integration behavior for selected synchronous and asynchronous paths.',
      'Exclude private data and production details from public artifacts.',
    ],
    tradeoffs: [
      'Explicit boundary mapping improves isolation but adds mapping maintenance.',
      'Asynchronous events reduce direct coupling but introduce eventual consistency.',
      'Document generation supports operational workflows but adds template lifecycle work.',
    ],
    outcome: [
      'Provided a clear backend boundary for supported operational workflows and lookup use cases.',
      'Connected interactive workflows with administration context and read-oriented data services.',
    ],
    lessons: [
      'Keep transport contracts separate from use-case orchestration.',
      'Make workflow state and ownership rules explicit before persistence changes.',
      'Choose synchronous or asynchronous integration from consistency needs.',
    ],
  },
  {
    slug: 'fleet-administration-dispatch',
    featured: true,
    serviceLabel: 'Service 02 / Administration',
    title: 'Fleet Administration & Dispatch',
    subtitle: 'A backend service for planning, resources, devices, configuration, and coordination across fleet operations.',
    tags: ['Java 17', 'Spring Boot', 'REST', 'gRPC', 'Kafka', 'Redis'],
    disclaimer: 'This case study is generalized for confidentiality. Names, boundaries, and flows do not reproduce the private production system.',
    overview: {
      domain: 'Fleet administration, planning, resources, and dispatch',
      platform: 'The administration and coordination service within the Fleet Operations Platform',
      role: 'Middle Backend Developer',
    },
    requirements: [
      'Manage planning, resource, device, configuration, and reference-data workflows.',
      'Validate lifecycle and assignment state for supported administration changes.',
      'Provide operational context through REST and gRPC service boundaries.',
      'Publish selected changes for asynchronous synchronization.',
      'Support approved administration reports and exports.',
    ],
    challenges: [
      'Keep planning and assignment state consistent across related records.',
      'Coordinate device and resource state without hiding ownership rules.',
      'Maintain cache freshness for selected administration views.',
      'Separate interactive administration changes from downstream synchronization.',
    ],
    mermaid: { title: 'Fleet Administration & Dispatch within the connected platform', code: administrationDiagram },
    mainFlow: [
      'An administrator submits a planning, resource, device, or configuration request.',
      'The API boundary validates the request and available authorization context.',
      'The use case applies lifecycle, assignment, and consistency rules.',
      'The service persists the approved change and updates explicit cache state where relevant.',
      'It exposes updated context synchronously or publishes a change event.',
      'Operations Core and Data Intelligence Hub consume the appropriate result through their boundaries.',
    ],
    contributions: [
      'Developed administration APIs for supported planning, resource, device, and configuration flows.',
      'Worked on database queries and validation for lifecycle and assignment state.',
      'Used Redis for selected cache and coordination responsibilities.',
      'Contributed to Kafka event integration for supported changes.',
      'Integrated related services through REST and gRPC and supported approved reports.',
    ],
    techStack: ['Java 17', 'Spring Boot', 'REST', 'gRPC', 'Kafka', 'Redis', 'Elasticsearch', 'Relational database', 'ShedLock', 'Docker'],
    highlights: ['Planning context', 'Resource coordination', 'Event synchronization'],
    reliabilitySecurity: [
      'Validate lifecycle and assignment state before supported updates.',
      'Keep cache and coordination responsibilities explicit.',
      'Separate synchronous administration responses from asynchronous propagation.',
      'Omit private configuration and operational identifiers from public material.',
    ],
    tradeoffs: [
      'Centralized administration context improves consistency but creates an important service dependency.',
      'Distributed coordination helps selected workflows but requires bounded lock ownership.',
      'Event propagation reduces direct coupling while accepting delayed downstream visibility.',
    ],
    outcome: [
      'Provided a consistent administration boundary for planning and operational resources.',
      'Supplied controlled context to operational workflows and downstream data synchronization.',
    ],
    lessons: [
      'Model lifecycle transitions explicitly instead of inferring them from records.',
      'Keep cache, coordination, and persistence responsibilities separate.',
      'Publish only the events required by downstream service contracts.',
    ],
  },
  {
    slug: 'fleet-data-intelligence-hub',
    featured: true,
    serviceLabel: 'Service 03 / Data Intelligence',
    title: 'Fleet Data Intelligence Hub',
    subtitle: 'A data-focused backend service for multi-source synchronization, aggregation, operational search, and normalized lookup.',
    tags: ['Java 17', 'Spring Boot', 'Kafka', 'Elasticsearch', 'MongoDB', 'gRPC'],
    disclaimer: 'This case study is generalized for confidentiality. Names, boundaries, and flows do not reproduce the private production system.',
    overview: {
      domain: 'Fleet data synchronization, aggregation, and search',
      platform: 'The read-oriented data service within the Fleet Operations Platform',
      role: 'Middle Backend Developer',
    },
    requirements: [
      'Receive approved source changes through events and service integrations.',
      'Normalize and synchronize operational records from multiple sources.',
      'Build read-oriented data for aggregation and search.',
      'Provide REST and gRPC lookup responses to related platform services.',
      'Track integration and resynchronization state at a generalized level.',
    ],
    challenges: [
      'Normalize contracts that arrive from different source systems.',
      'Keep persisted read data and search projections aligned.',
      'Separate background synchronization from interactive lookup paths.',
      'Make eventual consistency and resynchronization behavior observable.',
    ],
    mermaid: { title: 'Fleet Data Intelligence Hub within the connected platform', code: intelligenceDiagram },
    mainFlow: [
      'Kafka consumers or approved integration adapters receive source changes.',
      'Synchronization workers validate, map, and normalize the records.',
      'The service persists operational read data and updates search projections.',
      'REST or gRPC interfaces accept lookup and aggregation requests.',
      'Query services select relational, document-oriented, or search-backed access for the request.',
      'A normalized response returns to Operations Core or Administration and Dispatch.',
    ],
    contributions: [
      'Developed synchronization workers for approved multi-source data flows.',
      'Built REST lookup and aggregation APIs for supported read use cases.',
      'Worked on Elasticsearch-backed query and data-processing paths.',
      'Contributed to Kafka consumer flows and integration-state handling.',
      'Integrated related services through REST and gRPC boundaries.',
    ],
    techStack: ['Java 17', 'Spring Boot', 'REST', 'gRPC', 'Kafka', 'Elasticsearch', 'MongoDB', 'Relational database', 'OpenFeign', 'Docker'],
    highlights: ['Data synchronization', 'Aggregated lookup', 'Search-oriented reads'],
    reliabilitySecurity: [
      'Separate background synchronization from interactive read paths.',
      'Treat search indexes as read-oriented projections.',
      'Keep resynchronization state bounded and observable.',
      'Exclude source identifiers and private records from public descriptions.',
    ],
    tradeoffs: [
      'Asynchronous synchronization reduces source coupling but introduces eventual consistency.',
      'Search projections improve flexible lookup but add index lifecycle work.',
      'Multiple integration styles improve fit while increasing contract-management overhead.',
    ],
    outcome: [
      'Provided a normalized lookup boundary across approved operational data sources.',
      'Separated synchronization processing from interactive search and aggregation concerns.',
    ],
    lessons: [
      'Treat synchronized data as an explicit read model with known freshness.',
      'Make integration and resynchronization state observable.',
      'Keep search projections rebuildable from controlled data sources.',
    ],
  },
];
```

- [ ] **Step 4: Update legacy data assertions to the approved contract**

In `tests/profile-data.test.js`:

- Rename the case-study test to `portfolio publishes three complete NDA-safe connected case studies`.
- Expect the three new slugs in the order shown above.
- Replace `Object.keys(project.scaling).length >= 3` with `project.highlights.length === 3`.
- Remove the two tests about approved delivery counts and invented scale.
- Add a test that joins all `highlights` and `contributions` and rejects `/~?\d+\s*(?:apis?|ms|%|users?|requests?)/i`.

In `tests/task-9-followup.test.js`, replace the retired slug with `fleet-operations-core` and preserve the scoped-contribution assertions.

In `tests/task-9-remediation.test.js`:

- Rename the card test to `project-card qualitative highlights wrap without ellipsis`.
- Replace the numeric first-case-study test with assertions that Operations Core contains workflow, REST, gRPC, relational data, Redis, Kafka, Elasticsearch, and document concepts while containing no quantitative API claim.
- Point the privacy test at `fleet-operations-core`.

- [ ] **Step 5: Run the data and full test suites**

Run:

```powershell
& 'C:\Program Files\nodejs\npm.cmd' test -- --test-name-pattern="connected fleet-platform|qualitative|contribution themes|complete NDA-safe|Operations Core"
& 'C:\Program Files\nodejs\npm.cmd' test
```

Expected: the focused contract passes; the full suite reports zero failures. The two Windows symlink tests may remain skipped.

- [ ] **Step 6: Commit the data contract**

```powershell
git add src/data/projects.js tests/connected-projects.test.js tests/profile-data.test.js tests/task-9-followup.test.js tests/task-9-remediation.test.js
git commit -m "feat: define three connected fleet case studies"
```

---

### Task 2: Add the Shared Platform Overview and Three-Card Layout

**Files:**
- Create: `src/data/fleetPlatform.js`
- Create: `src/components/FleetPlatformOverview.jsx`
- Modify: `src/components/sections/ProjectsSection.jsx`
- Modify: `src/components/ProjectCard.jsx`
- Modify: `tests/reference-form.test.js`
- Modify: `tests/task-9-remediation.test.js`

**Interfaces:**
- Consumes: `MermaidDiagram`, `Card`, and the `project.serviceLabel` and `project.highlights` fields from Task 1.
- Produces: `fleetPlatform` data object and `FleetPlatformOverview({ platform })` React component.

- [ ] **Step 1: Add failing homepage-relationship assertions**

Extend `tests/reference-form.test.js` with:

```js
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
  assert.match(platformData, /Fleet Operations Platform/);
  assert.match(platformData, /Fleet Administration & Dispatch/);
  assert.match(platformData, /Fleet Data Intelligence Hub/);
  assert.match(card, /project\.serviceLabel/);
  assert.match(card, /project\.highlights/);
  assert.doesNotMatch(card, /project\.scaling/);
});
```

Update the existing card assertion from `Object.entries(project.scaling)` to `project.highlights.map`.

- [ ] **Step 2: Run the homepage test and verify it fails**

Run:

```powershell
& 'C:\Program Files\nodejs\npm.cmd' test -- --test-name-pattern="three services as one connected platform"
```

Expected: FAIL because the component and shared data module do not exist.

- [ ] **Step 3: Create the shared platform data**

Create `src/data/fleetPlatform.js`:

```js
const ecosystemDiagram = [
  'flowchart LR',
  '  Admin[Fleet Administration & Dispatch]',
  '  Core[Fleet Operations Core]',
  '  Data[Fleet Data Intelligence Hub]',
  '  Events[(Kafka)]',
  '  Admin -->|Plans, resources, configuration| Core',
  '  Core -->|Operational events| Events',
  '  Admin -->|Reference and coordination events| Events',
  '  Events -->|Synchronization| Data',
  '  Core -->|Lookup and search requests| Data',
  '  Data -->|Aggregated read responses| Core',
  '  Admin -->|Lookup and aggregation requests| Data',
  '  Data -->|Aggregated read responses| Admin',
].join('\n');

export const fleetPlatform = {
  name: 'Fleet Operations Platform',
  summary: 'Three connected backend services separate operational workflows, administration and dispatch, and read-oriented data intelligence.',
  disclaimer: 'The service names and diagram are generalized for confidentiality and do not reproduce a private production topology.',
  mermaid: {
    title: 'Connected service ecosystem',
    code: ecosystemDiagram,
  },
};
```

- [ ] **Step 4: Create the overview component**

Create `src/components/FleetPlatformOverview.jsx`:

```jsx
import Card from './Card';
import MermaidDiagram from './MermaidDiagram';

export default function FleetPlatformOverview({ platform }) {
  return (
    <Card className='mt-8 overflow-hidden p-5 sm:p-6'>
      <div className='grid gap-6 xl:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] xl:items-center'>
        <div>
          <p className='font-mono text-[10px] uppercase tracking-[0.2em] text-accent'>Connected platform</p>
          <h3 className='mt-2 text-2xl font-black tracking-tight text-text'>{platform.name}</h3>
          <p className='mt-3 text-sm leading-6 text-muted'>{platform.summary}</p>
          <p className='mt-4 border-l-2 border-accent/40 pl-3 text-xs leading-5 text-muted'>{platform.disclaimer}</p>
        </div>
        <MermaidDiagram title={platform.mermaid.title} code={platform.mermaid.code} />
      </div>
    </Card>
  );
}
```

- [ ] **Step 5: Integrate the overview and qualitative cards**

In `ProjectsSection.jsx`:

- Import `FleetPlatformOverview` and `fleetPlatform`.
- Render `<FleetPlatformOverview platform={fleetPlatform} />` after the introductory paragraph.
- Change the featured-card grid class from `lg:grid-cols-2` to `lg:grid-cols-3`.

In `ProjectCard.jsx`:

- Replace `Case study / 0{index + 1}` with `{project.serviceLabel ?? `Case study / 0${index + 1}`}`.
- Replace the `project.scaling` block with this exact qualitative block:

```jsx
{project.highlights?.length > 0 && (
  <ul className='mt-6 grid gap-2 border-t border-white/5 pt-4 text-xs leading-5 text-muted'>
    {project.highlights.map((highlight) => (
      <li key={highlight} className='flex gap-2 break-words'>
        <span className='text-accent' aria-hidden='true'>→</span>
        <span>{highlight}</span>
      </li>
    ))}
  </ul>
)}
```

In `tests/task-9-remediation.test.js`, update the qualitative-highlight wrapping assertion to require one or more `break-words` classes instead of the retired metric layout's exact count of two.

- [ ] **Step 6: Run homepage and regression tests**

Run:

```powershell
& 'C:\Program Files\nodejs\npm.cmd' test -- --test-name-pattern="connected platform|project-card qualitative|architecture preview"
& 'C:\Program Files\nodejs\npm.cmd' test
```

Expected: all selected and full tests pass, with only the permitted Windows symlink skips.

- [ ] **Step 7: Commit the homepage integration**

```powershell
git add src/data/fleetPlatform.js src/components/FleetPlatformOverview.jsx src/components/sections/ProjectsSection.jsx src/components/ProjectCard.jsx tests/reference-form.test.js tests/task-9-remediation.test.js
git commit -m "feat: show connected fleet platform overview"
```

---

### Task 3: Add Related-Service Navigation to Every Case Study

**Files:**
- Modify: `src/pages/ProjectDetail.jsx`
- Modify: `tests/reference-form.test.js`
- Modify: `tests/profile-data.test.js`

**Interfaces:**
- Consumes: `projects` from Task 1 and existing React Router `Link`.
- Produces: `relatedProjects = projects.filter(({ slug }) => slug !== project.slug)` and a visible `Related Platform Services` section with exactly two links.

- [ ] **Step 1: Write failing detail-page assertions**

Add this test to `tests/reference-form.test.js`:

```js
test('each case study identifies its platform role and links related services', async () => {
  const detail = await source('../src/pages/ProjectDetail.jsx');

  assert.match(detail, /project\.serviceLabel/);
  assert.match(detail, /project\.overview\.platform/);
  assert.match(detail, /relatedProjects/);
  assert.match(detail, /Related Platform Services/);
  assert.match(detail, /projects\.filter/);
  assert.doesNotMatch(detail, /Delivery Scope & Highlights/);
});
```

Remove `Delivery Scope & Highlights` from the heading arrays in `tests/reference-form.test.js` and `tests/profile-data.test.js`.

- [ ] **Step 2: Run the detail test and verify it fails**

Run:

```powershell
& 'C:\Program Files\nodejs\npm.cmd' test -- --test-name-pattern="platform role and links related services|complete approved case-study form"
```

Expected: FAIL because the page does not render service labels, the platform field, or related links and still contains the retired delivery section.

- [ ] **Step 3: Update the detail-page header and overview**

In `ProjectDetail.jsx`, immediately after the `if (!project) { ... }` early-return block, define:

```js
const relatedProjects = projects.filter((item) => item.slug !== project.slug);
```

Replace the fixed header eyebrow with:

```jsx
<p className='font-mono text-xs uppercase tracking-[0.18em] text-accent'>
  {project.serviceLabel} · NDA-friendly case study
</p>
```

Add the platform row to the Overview card:

```jsx
{project.overview.platform && (
  <div className='sm:col-span-2'>
    <span className='font-mono text-xs'>Platform:</span> {project.overview.platform}
  </div>
)}
```

- [ ] **Step 4: Remove the retired delivery section and add related links**

Delete the conditional `Delivery Scope & Highlights` section that reads `project.scaling`.

After `Lessons Learned`, add:

```jsx
<Section title='Related Platform Services' when={relatedProjects.length > 0}>
  <div className='grid gap-3 sm:grid-cols-2'>
    {relatedProjects.map((relatedProject) => (
      <Link
        key={relatedProject.slug}
        className='rounded-xl border border-border bg-panel p-5 text-text no-underline transition hover:border-accent/40 hover:bg-white/[0.06]'
        to={`/projects/${relatedProject.slug}`}
        aria-label={`Read the ${relatedProject.title} case study`}
      >
        <span className='font-mono text-[10px] uppercase tracking-[0.18em] text-accent'>
          {relatedProject.serviceLabel}
        </span>
        <span className='mt-2 block text-lg font-bold'>{relatedProject.title}</span>
        <span className='mt-2 block text-sm leading-6 text-muted'>{relatedProject.subtitle}</span>
      </Link>
    ))}
  </div>
</Section>
```

- [ ] **Step 5: Run detail, accessibility, and full tests**

Run:

```powershell
& 'C:\Program Files\nodejs\npm.cmd' test -- --test-name-pattern="platform role|large project pages|not-found routes|architecture modal"
& 'C:\Program Files\nodejs\npm.cmd' test
```

Expected: all tests pass; related links use router navigation and project-specific accessible names.

- [ ] **Step 6: Commit the detail integration**

```powershell
git add src/pages/ProjectDetail.jsx tests/reference-form.test.js tests/profile-data.test.js
git commit -m "feat: connect related fleet case studies"
```

---

### Task 4: Publish the Three New Routes

**Files:**
- Modify: `scripts/prerender.js`
- Modify: `public/sitemap.xml`
- Modify: `tests/profile-data.test.js`
- Modify: `tests/prerender-html.test.js`
- Modify: `tests/prerender-paths.test.js`

**Interfaces:**
- Consumes: the three `project.slug` values defined in Task 1.
- Produces: static routes and sitemap entries for `/projects/fleet-operations-core`, `/projects/fleet-administration-dispatch`, and `/projects/fleet-data-intelligence-hub`.

- [ ] **Step 1: Change route tests first**

In the publishing test in `tests/profile-data.test.js`, replace the old slug array with:

```js
const approvedSlugs = [
  'fleet-operations-core',
  'fleet-administration-dispatch',
  'fleet-data-intelligence-hub',
];
```

For every approved slug, assert that both prerender source and sitemap contain `/projects/${slug}`. Add assertions that both retired slugs are absent:

```js
for (const retiredSlug of [
  'fleet-operations-management-platform',
  'fleetops-data-hub',
]) {
  assert.doesNotMatch(prerender, new RegExp(`/projects/${retiredSlug}`));
  assert.doesNotMatch(sitemap, new RegExp(`/projects/${retiredSlug}`));
}
```

Update the project metadata fixture in `tests/prerender-html.test.js` to use Fleet Operations Core, and update its body link to Fleet Data Intelligence Hub. Update the route example in `tests/prerender-paths.test.js` to use Fleet Data Intelligence Hub.

- [ ] **Step 2: Run publishing tests and verify they fail**

Run:

```powershell
& 'C:\Program Files\nodejs\npm.cmd' test -- --test-name-pattern="prerender and sitemap|valid home and project|Vite base paths"
```

Expected: FAIL because the prerender route array and sitemap still contain the retired routes.

- [ ] **Step 3: Update prerender routes**

Replace the `ROUTES` array in `scripts/prerender.js` with:

```js
const ROUTES = [
  '/',
  '/projects/fleet-operations-core',
  '/projects/fleet-administration-dispatch',
  '/projects/fleet-data-intelligence-hub',
];
```

Keep `expectedMetadataForRoute`, base-path normalization, static-file containment, and cleanup behavior unchanged.

- [ ] **Step 4: Update the sitemap**

Replace the two project URL blocks in `public/sitemap.xml` with three monthly, priority `0.9` entries using these exact locations:

```xml
<loc>https://tamtnts.github.io/portfolio/projects/fleet-operations-core</loc>
<loc>https://tamtnts.github.io/portfolio/projects/fleet-administration-dispatch</loc>
<loc>https://tamtnts.github.io/portfolio/projects/fleet-data-intelligence-hub</loc>
```

- [ ] **Step 5: Run publishing, full tests, lint, and production build**

Run:

```powershell
& 'C:\Program Files\nodejs\npm.cmd' test -- --test-name-pattern="prerender and sitemap|valid home and project|Vite base paths"
& 'C:\Program Files\nodejs\npm.cmd' test
& 'C:\Program Files\nodejs\npm.cmd' run lint
& 'C:\Program Files\nodejs\npm.cmd' run build
```

Expected:

- Tests: zero failures; only the two permitted Windows symlink skips.
- Lint: exit code `0` with no ESLint errors.
- Build: exit code `0` and four prerender messages: `/` plus the three new project routes.

- [ ] **Step 6: Commit the publishing contract**

```powershell
git add scripts/prerender.js public/sitemap.xml tests/profile-data.test.js tests/prerender-html.test.js tests/prerender-paths.test.js
git commit -m "feat: publish three fleet service routes"
```

---

### Task 5: Verify Confidentiality, Responsive Layout, and Release Readiness

**Files:**
- Modify only if verification reveals a defect in files already listed above.

**Interfaces:**
- Consumes: completed implementation from Tasks 1–4.
- Produces: verified GitHub Pages build with no private identifiers and usable desktop/mobile project navigation.

- [ ] **Step 1: Run the repository confidentiality test**

```powershell
& 'C:\Program Files\nodejs\npm.cmd' test -- --test-name-pattern="private or legacy identifiers|NDA-safe|qualitative"
```

Expected: PASS with no source path, private fingerprint, or unapproved metric violation.

- [ ] **Step 2: Search explicitly for retired public routes and private path markers**

```powershell
rg -n "fleet-operations-management-platform|fleetops-data-hub" src tests scripts public
```

Expected: no matches for retired slugs outside tests that explicitly assert their absence. Private path and identifier coverage is provided by the repository confidentiality test from Step 1 without repeating sensitive fingerprints in this tracked plan.

- [ ] **Step 3: Inspect the built site at desktop and mobile widths**

Start the preview server:

```powershell
& 'C:\Program Files\nodejs\npm.cmd' run preview -- --host 127.0.0.1
```

Using the browser, verify:

- Homepage at approximately `1440px`: platform diagram is readable and three project cards form one row.
- Homepage at approximately `390px`: diagram controls remain usable and cards form one column without horizontal overflow.
- Each of the three **Preview Architecture** buttons opens a diagram containing all three service names.
- Each case-study route has unique title, subtitle, highlighted architecture, and exactly two related-service links.
- Related links navigate correctly and route changes restore the top position.
- Keyboard focus remains visible on cards, diagram controls, modal close, and related-service links.

Stop the preview server after inspection.

- [ ] **Step 4: Run the final verification gate**

```powershell
git diff --check
& 'C:\Program Files\nodejs\npm.cmd' test
& 'C:\Program Files\nodejs\npm.cmd' run lint
& 'C:\Program Files\nodejs\npm.cmd' run build
git status --short
```

Expected: no whitespace errors; zero test failures; lint and build succeed; Git status is clean after any verified correction has been committed.

- [ ] **Step 5: Commit only if verification required a correction**

Stage only the corrected files and use:

```powershell
git commit -m "fix: finalize connected fleet case studies"
```

If no correction was required, do not create an empty commit.
