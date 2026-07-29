# Connected Fleet C4 Revision Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the three connected fleet case studies to a standard, NDA-safe C4 presentation with one shared C1 view, a highlighted C2 view per project, and a project-specific C3 view.

**Architecture:** Store the shared C1 System Context view in `fleetPlatform`, and store C2 Container plus C3 Component views on each project. The homepage renders C1, architecture previews open C2, and each detail page renders C1, C2, and C3 vertically through one focused `C4Model` component.

**Tech Stack:** React 19, React Router, Tailwind CSS, Mermaid, Node test runner, Vite, Playwright prerendering, GitHub Pages.

## Starting State

- The branch already contains the approved three-project data contract at commit `89c55ca`.
- The branch already contains the three-card homepage and an initial shared diagram at commit `f0ab8b0`.
- The initial shared diagram must be replaced because it mixes container-level services into what is now defined as the C1 view.
- This revision supersedes the architecture portions of Tasks 2 and 3 in `2026-07-29-three-connected-fleet-projects-implementation.md`; the route and final-verification requirements remain binding.

## Global Constraints

- Publish exactly three featured projects: `Fleet Operations Core`, `Fleet Administration & Dispatch`, and `Fleet Data Intelligence Hub`.
- Use one shared C1 System Context view, one C2 Container view per project with the current service highlighted, and one evidence-backed C3 Component view per project.
- Render C1, C2, and C3 vertically on every project page; do not use tabs or hidden state.
- The homepage renders C1; each featured-card architecture preview opens that project's C2 view.
- Do not publish a C4 Code view, class names, packages, modules, endpoints, event topics, schemas, credentials, infrastructure addresses, or deployment topology.
- Label generalized synchronous service boundaries as REST/gRPC and asynchronous synchronization boundaries as Kafka.
- Publish no API counts, data volumes, user counts, latency, throughput, availability, percentages, or other unverified metrics.
- Preserve responsive design, keyboard accessibility, route metadata, prerender validation, sitemap coverage, and GitHub Pages base-path behavior.
- Do not modify unrelated profile, experience, education, certificate, contact, or CV content.

## File Structure

- Modify `src/data/fleetPlatform.js`: expose only the shared C1 System Context view.
- Modify `src/data/projects.js`: replace the mixed architecture diagrams with C2 Container and C3 Component views.
- Modify `src/components/FleetPlatformOverview.jsx`: render the shared C1 view.
- Modify `src/components/sections/ProjectsSection.jsx`: open the selected project's C2 view in the existing modal.
- Create `src/components/C4Model.jsx`: render C1, C2, and C3 vertically with the existing Card and MermaidDiagram components.
- Modify `src/pages/ProjectDetail.jsx`: render `C4Model`, platform identity, and exactly two related-service links.
- Modify data/UI regression tests to enforce C4 levels and reject mixed or private architecture content.
- Modify prerender and sitemap files to publish the three approved project routes.

---

### Task 1: Convert the Shared Homepage Diagram to C1 System Context

**Files:**
- Modify: `src/data/fleetPlatform.js`
- Modify: `src/components/FleetPlatformOverview.jsx`
- Modify: `tests/connected-projects.test.js`
- Modify: `tests/reference-form.test.js`

**Interfaces:**
- Produces: `fleetPlatform.c4.context` with `{ level, title, description, code }`.
- Consumers: `FleetPlatformOverview` now reads `platform.c4.context`.

- [ ] **Step 1: Write failing C1 contract assertions**

Update `tests/connected-projects.test.js` to import `fleetPlatform` and add:

```js
test('publishes a strict shared C1 System Context view', () => {
  const context = fleetPlatform.c4.context;

  assert.equal(context.level, 'C1');
  assert.equal(context.title, 'System Context');
  assert.match(context.code, /Fleet Operations Staff/);
  assert.match(context.code, /Administrator \/ Dispatcher/);
  assert.match(context.code, /Fleet Operations Platform/);
  assert.match(context.code, /Approved Operational Data Sources/);
  assert.match(context.code, /REST\/gRPC/);
  assert.doesNotMatch(context.code, /Fleet Operations Core|Fleet Administration & Dispatch|Fleet Data Intelligence Hub|Kafka|Redis|MongoDB|Elasticsearch/);
});
```

Update the connected-platform test in `tests/reference-form.test.js` to expect `platform.c4.context` instead of `platform.mermaid`.

- [ ] **Step 2: Run the focused test and verify RED**

```powershell
& 'C:\Program Files\nodejs\npm.cmd' test -- --test-name-pattern="strict shared C1|three services as one connected platform"
```

Expected: FAIL because the current shared diagram contains internal services and exposes `platform.mermaid` instead of `platform.c4.context`.

- [ ] **Step 3: Replace shared data with an exact C1 view**

Replace `src/data/fleetPlatform.js` with:

```js
const systemContextDiagram = [
  'flowchart LR',
  '  OperationsStaff[Person: Fleet Operations Staff]',
  '  Administrator[Person: Administrator / Dispatcher]',
  '  Platform[Software System: Fleet Operations Platform]',
  '  Sources[External System: Approved Operational Data Sources]',
  '  OperationsStaff -->|Uses for workflow, lookup, and reporting| Platform',
  '  Administrator -->|Uses for planning, resources, and coordination| Platform',
  '  Platform -->|REST/gRPC requests or approved events| Sources',
  '  Sources -->|Approved responses or events| Platform',
].join('\n');

export const fleetPlatform = {
  name: 'Fleet Operations Platform',
  summary: 'Three connected backend services separate operational workflows, administration and dispatch, and read-oriented data intelligence.',
  disclaimer: 'The system boundary and relationships are generalized for confidentiality and do not reproduce a private production topology.',
  c4: {
    context: {
      level: 'C1',
      title: 'System Context',
      description: 'People and approved external systems interacting with the Fleet Operations Platform.',
      code: systemContextDiagram,
    },
  },
};
```

- [ ] **Step 4: Point the overview at the C1 interface**

In `FleetPlatformOverview.jsx`, define `const context = platform.c4.context;` and render:

```jsx
<MermaidDiagram title={`${context.level} — ${context.title}`} code={context.code} />
```

Keep the existing summary, confidentiality note, Card, responsive layout, and diagram controls.

- [ ] **Step 5: Run focused and full tests**

```powershell
& 'C:\Program Files\nodejs\npm.cmd' test -- --test-name-pattern="strict shared C1|connected platform"
& 'C:\Program Files\nodejs\npm.cmd' test
```

Expected: zero failures; the two Windows symlink tests may remain skipped.

- [ ] **Step 6: Commit**

```powershell
git add src/data/fleetPlatform.js src/components/FleetPlatformOverview.jsx tests/connected-projects.test.js tests/reference-form.test.js
git commit -m "feat: add C1 fleet system context"
```

---

### Task 2: Define C2 Container and C3 Component Views

**Files:**
- Modify: `src/data/projects.js`
- Modify: `src/components/sections/ProjectsSection.jsx`
- Modify: `tests/connected-projects.test.js`
- Modify: `tests/reference-form.test.js`

**Interfaces:**
- Produces: `project.c4.container` and `project.c4.component`, each with `{ level, title, description, code }`.
- Consumes: `ProjectsSection.openDiagram(project)` reads `project.c4.container`.
- Removes: the retired `project.mermaid` field.

- [ ] **Step 1: Write failing C2/C3 contract tests**

Replace the per-project Mermaid assertions in `tests/connected-projects.test.js` with:

```js
for (const project of projects) {
  assert.equal(project.c4.container.level, 'C2');
  assert.equal(project.c4.component.level, 'C3');
  assert.equal(project.mermaid, undefined);

  for (const [, title] of expectedProjects) {
    assert.match(project.c4.container.code, new RegExp(title));
  }

  assert.match(project.c4.container.code, /REST\/gRPC/);
  assert.match(project.c4.container.code, /Kafka/);
  assert.match(project.c4.container.code, new RegExp(`class ${project.c4.container.currentId} current`));
  assert.doesNotMatch(project.c4.component.code, /Person:|Software System:|External System:/);
}
```

Update `tests/reference-form.test.js` so the project section contract expects `project.c4.container` when opening the architecture modal.

- [ ] **Step 2: Run the focused tests and verify RED**

```powershell
& 'C:\Program Files\nodejs\npm.cmd' test -- --test-name-pattern="connected fleet-platform|architecture preview"
```

Expected: FAIL because projects still expose one mixed `mermaid` view.

- [ ] **Step 3: Add the exact shared C2 topology builder**

At the top of `src/data/projects.js`, replace the three mixed diagrams with:

```js
function buildContainerDiagram(currentId) {
  return [
    'flowchart LR',
    '  OperationsClient[Operations Client]',
    '  AdministrationClient[Administration Client]',
    '  Core[Fleet Operations Core<br/>Java 17 / Spring Boot]',
    '  Admin[Fleet Administration & Dispatch<br/>Java 17 / Spring Boot]',
    '  Data[Fleet Data Intelligence Hub<br/>Java 17 / Spring Boot]',
    '  Events[(Kafka)]',
    '  CoreStore[(Operational Relational Store)]',
    '  CoreCache[(Redis)]',
    '  AdminStore[(Administration Relational Store)]',
    '  AdminCache[(Redis)]',
    '  ReadStore[(Read Data Store)]',
    '  Documents[(MongoDB)]',
    '  Search[(Elasticsearch)]',
    '  OperationsClient -->|REST/gRPC| Core',
    '  AdministrationClient -->|REST/gRPC| Admin',
    '  Admin -->|REST/gRPC plans, resources, configuration| Core',
    '  Core -->|REST/gRPC lookup and search| Data',
    '  Admin -->|REST/gRPC aggregated lookup| Data',
    '  Core -->|Kafka operational events| Events',
    '  Admin -->|Kafka reference and coordination events| Events',
    '  Events -->|Kafka synchronization events| Data',
    '  Core --> CoreStore',
    '  Core --> CoreCache',
    '  Admin --> AdminStore',
    '  Admin --> AdminCache',
    '  Data --> ReadStore',
    '  Data --> Documents',
    '  Data --> Search',
    `  class ${currentId} current`,
    '  classDef current fill:#123047,stroke:#38bdf8,color:#e6edf3,stroke-width:2px',
  ].join('\n');
}
```

- [ ] **Step 4: Add the exact C3 component diagrams**

Add:

```js
const operationsComponentDiagram = [
  'flowchart LR',
  '  API[REST/gRPC API] --> UseCases[Workflow and Query Use Cases]',
  '  UseCases --> Persistence[Persistence Adapter]',
  '  UseCases --> Cache[Cache Adapter]',
  '  UseCases --> Integrations[Service Integration Adapters]',
  '  UseCases --> Events[Event Adapter]',
  '  UseCases --> Documents[Document Renderer]',
  '  Persistence --> Store[(Relational Store)]',
  '  Cache --> Redis[(Redis)]',
  '  Integrations -->|REST/gRPC| Related[Related Platform Services]',
  '  Events -->|Kafka| Kafka[(Kafka)]',
].join('\n');

const administrationComponentDiagram = [
  'flowchart LR',
  '  API[REST/gRPC API] --> Planning[Planning and Coordination Use Cases]',
  '  API --> Resources[Resource and Device Use Cases]',
  '  API --> Config[Configuration and Reference Use Cases]',
  '  Planning --> Persistence[Persistence Adapter]',
  '  Resources --> Persistence',
  '  Config --> Persistence',
  '  Planning --> Cache[Cache and Coordination Adapter]',
  '  Resources --> Cache',
  '  Config --> Integrations[Service Integration Adapters]',
  '  Planning --> Events[Event Adapter]',
  '  Planning --> Reports[Report and Export Renderer]',
  '  Persistence --> Store[(Relational Store)]',
  '  Cache --> Redis[(Redis / ShedLock)]',
  '  Integrations -->|REST/gRPC| Related[Related Platform Services]',
  '  Events -->|Kafka| Kafka[(Kafka)]',
].join('\n');

const intelligenceComponentDiagram = [
  'flowchart LR',
  '  Kafka[(Kafka)] --> Consumers[Kafka Consumers]',
  '  Sources[Approved Source Systems] -->|REST/gRPC| Integrations[Integration Adapters]',
  '  Consumers --> Workers[Synchronization Workers]',
  '  Integrations --> Workers',
  '  Workers --> Mapping[Normalization and Mapping]',
  '  Mapping --> Repositories[Data Repositories]',
  '  Mapping --> Search[Search Adapter]',
  '  Mapping --> State[Integration State Tracking]',
  '  API[REST/gRPC Lookup API] --> Queries[Query and Aggregation Services]',
  '  Queries --> Repositories',
  '  Queries --> Search',
  '  Repositories --> Relational[(Relational Read Data)]',
  '  Repositories --> Mongo[(MongoDB)]',
  '  Search --> Elastic[(Elasticsearch)]',
].join('\n');
```

- [ ] **Step 5: Attach C2/C3 to each existing project record**

Remove each `mermaid` field. Add:

```js
c4: {
  container: {
    level: 'C2',
    title: 'Container View',
    description: 'The service within the generalized Fleet Operations Platform container topology.',
    currentId: 'Core',
    code: buildContainerDiagram('Core'),
  },
  component: {
    level: 'C3',
    title: 'Component View',
    description: 'Generalized internal components and their primary responsibilities.',
    code: operationsComponentDiagram,
  },
},
```

Use `Admin` plus `administrationComponentDiagram` for Fleet Administration & Dispatch, and `Data` plus `intelligenceComponentDiagram` for Fleet Data Intelligence Hub. Do not change the approved descriptive project copy.

- [ ] **Step 6: Make previews open C2**

Change `openDiagram` in `ProjectsSection.jsx` to:

```js
const openDiagram = (project) => {
  const container = project.c4.container;
  setModal({
    open: true,
    title: `${container.level} — ${project.title}: ${container.title}`,
    code: container.code,
  });
};
```

- [ ] **Step 7: Run tests and commit**

```powershell
& 'C:\Program Files\nodejs\npm.cmd' test -- --test-name-pattern="connected fleet-platform|architecture preview|C2|C3"
& 'C:\Program Files\nodejs\npm.cmd' test
git add src/data/projects.js src/components/sections/ProjectsSection.jsx tests/connected-projects.test.js tests/reference-form.test.js
git commit -m "feat: add C2 and C3 fleet architecture views"
```

Expected: zero failures and a committed C2/C3 contract.

---

### Task 3: Render C1, C2, and C3 Vertically with Related Services

**Files:**
- Create: `src/components/C4Model.jsx`
- Modify: `src/pages/ProjectDetail.jsx`
- Modify: `tests/reference-form.test.js`
- Modify: `tests/profile-data.test.js`

**Interfaces:**
- `C4Model({ context, container, component })` renders three architecture levels in order.
- `ProjectDetail` supplies `fleetPlatform.c4.context`, `project.c4.container`, and `project.c4.component`.
- `ProjectDetail` derives `relatedProjects` by filtering out the current slug.

- [ ] **Step 1: Write failing detail-page tests**

Add to `tests/reference-form.test.js`:

```js
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
```

Remove `Architecture Diagram` and `Delivery Scope & Highlights` from old heading assertions and require `C4 Model`.

- [ ] **Step 2: Verify RED**

```powershell
& 'C:\Program Files\nodejs\npm.cmd' test -- --test-name-pattern="C1 C2 and C3 vertically|complete approved case-study form"
```

Expected: FAIL because `C4Model.jsx` does not exist and the page renders one architecture diagram.

- [ ] **Step 3: Create the exact vertical renderer**

Create `src/components/C4Model.jsx`:

```jsx
import Card from './Card';
import MermaidDiagram from './MermaidDiagram';

export default function C4Model({ context, container, component }) {
  const levels = [context, container, component];

  return (
    <div className='grid gap-4'>
      {levels.map((diagram) => (
        <Card key={diagram.level} className='p-5'>
          <p className='font-mono text-[10px] uppercase tracking-[0.18em] text-accent'>{diagram.level}</p>
          <h3 className='mt-2 text-lg font-bold text-text'>{diagram.title}</h3>
          <p className='mt-2 text-sm leading-6 text-muted'>{diagram.description}</p>
          <div className='mt-4'>
            <MermaidDiagram title={`${diagram.level} — ${diagram.title}`} code={diagram.code} />
          </div>
        </Card>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Integrate C4 and related links**

In `ProjectDetail.jsx`:

- Import `C4Model` and `fleetPlatform`.
- After the not-found early return, define `const relatedProjects = projects.filter((item) => item.slug !== project.slug);`.
- Render `project.serviceLabel` in the case-study eyebrow.
- Render `project.overview.platform` in the Overview card.
- Replace the single `Architecture Diagram` section with:

```jsx
<Section title='C4 Model'>
  <C4Model
    context={fleetPlatform.c4.context}
    container={project.c4.container}
    component={project.c4.component}
  />
</Section>
```

- Delete the `Delivery Scope & Highlights` section.
- After Lessons Learned, render exactly two related project links with:

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

- [ ] **Step 5: Run tests and commit**

```powershell
& 'C:\Program Files\nodejs\npm.cmd' test -- --test-name-pattern="C1 C2 and C3 vertically|large project pages|not-found routes|related services"
& 'C:\Program Files\nodejs\npm.cmd' test
git add src/components/C4Model.jsx src/pages/ProjectDetail.jsx tests/reference-form.test.js tests/profile-data.test.js
git commit -m "feat: render vertical C4 project models"
```

Expected: zero failures; each case-study source renders C1, C2, C3 in order and related navigation.

---

### Task 4: Publish the Three Approved Project Routes

**Files:**
- Modify: `scripts/prerender.js`
- Modify: `public/sitemap.xml`
- Modify: `tests/profile-data.test.js`
- Modify: `tests/prerender-html.test.js`
- Modify: `tests/prerender-paths.test.js`

**Interfaces:**
- Publishes `/projects/fleet-operations-core`, `/projects/fleet-administration-dispatch`, and `/projects/fleet-data-intelligence-hub`.

- [ ] **Step 1: Update tests first**

In `tests/profile-data.test.js`, use:

```js
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
```

In `tests/prerender-html.test.js`, use this project fixture and body link:

```js
const project = {
  route: '/projects/fleet-operations-core',
  title: 'Fleet Operations Core - Case Study | Nguyen Thanh Tam',
  canonical: `${siteUrl}/projects/fleet-operations-core`,
  ogImage,
};

// Inside fixture(metadata):
<a href="/portfolio/projects/fleet-data-intelligence-hub">Project</a>
```

In `tests/prerender-paths.test.js`, require:

```js
assert.equal(
  toPrerenderUrl('/projects/fleet-data-intelligence-hub', '/portfolio/'),
  '/portfolio/projects/fleet-data-intelligence-hub',
);
```

- [ ] **Step 2: Verify RED**

```powershell
& 'C:\Program Files\nodejs\npm.cmd' test -- --test-name-pattern="prerender and sitemap|valid home and project|Vite base paths"
```

Expected: FAIL because prerender and sitemap still contain retired routes.

- [ ] **Step 3: Replace route sources**

Use this exact array in `scripts/prerender.js`:

```js
const ROUTES = [
  '/',
  '/projects/fleet-operations-core',
  '/projects/fleet-administration-dispatch',
  '/projects/fleet-data-intelligence-hub',
];
```

Replace `public/sitemap.xml` with:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tamtnts.github.io/portfolio/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://tamtnts.github.io/portfolio/projects/fleet-operations-core</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://tamtnts.github.io/portfolio/projects/fleet-administration-dispatch</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://tamtnts.github.io/portfolio/projects/fleet-data-intelligence-hub</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
```

- [ ] **Step 4: Verify and commit**

```powershell
& 'C:\Program Files\nodejs\npm.cmd' test
& 'C:\Program Files\nodejs\npm.cmd' run lint
& 'C:\Program Files\nodejs\npm.cmd' run build
git add scripts/prerender.js public/sitemap.xml tests/profile-data.test.js tests/prerender-html.test.js tests/prerender-paths.test.js
git commit -m "feat: publish three fleet C4 case studies"
```

Expected: tests and lint pass; build prerenders `/` plus the three approved project routes.

---

### Task 5: Verify C4 Semantics, Confidentiality, and Responsive Release

**Files:**
- Modify only if verification exposes a defect in files already covered by Tasks 1–4.

**Interfaces:**
- Produces a verified release candidate; no new runtime interface.

- [ ] **Step 1: Run automated gates**

```powershell
git diff --check
& 'C:\Program Files\nodejs\npm.cmd' test
& 'C:\Program Files\nodejs\npm.cmd' run lint
& 'C:\Program Files\nodejs\npm.cmd' run build
```

Expected: zero failures; only permitted Windows symlink skips; four prerendered routes.

- [ ] **Step 2: Verify confidentiality and C4 boundaries**

Run the repository privacy test and confirm:

- C1 contains people, one software system, and the generalized external system, but no internal services or data stores.
- Every C2 contains all three services, REST/gRPC, Kafka, generalized stores, and exactly one current-service highlight.
- Every C3 contains only the approved generalized internal component responsibilities.
- No C4 Code diagram or private identifier is published.

- [ ] **Step 3: Verify desktop and mobile behavior**

Preview the production build and inspect approximately `1440px` and `390px` widths:

- Homepage C1 is readable and the three cards form three columns only at the large breakpoint.
- Each Preview Architecture action opens the matching C2 and has an accessible project-specific name.
- Each detail page shows C1, C2, and C3 vertically without horizontal page overflow.
- Mermaid zoom/reset controls remain keyboard accessible.
- Each detail page exposes exactly two working related-service links.

- [ ] **Step 4: Commit only verified corrections**

If verification requires a correction, run the focused covering test and commit only those corrected files with:

```powershell
git commit -m "fix: finalize fleet C4 presentation"
```

If no correction is required, do not create an empty commit.
