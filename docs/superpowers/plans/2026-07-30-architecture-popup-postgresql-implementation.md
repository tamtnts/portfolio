# Architecture Popup and PostgreSQL Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish clearer layered C4 diagrams, describe PostgreSQL consistently in the three fleet projects, and open the homepage Connected platform diagram in the existing zoomable modal.

**Architecture:** Keep C4 data in `fleetPlatform.js` and `projects.js`, but reshape Mermaid graphs into layered top-to-bottom groups and remove duplicated reverse edges. Keep modal state in `ProjectsSection`; add a preview mode to `MermaidDiagram` so the homepage diagram is a keyboard-accessible opener while modal/detail diagrams retain pan and zoom controls.

**Tech Stack:** React 19, Mermaid 11, react-zoom-pan-pinch, Node test runner, ESLint, Vite.

## Global Constraints

- MongoDB must not appear in the three fleet project objects, their C2/C3 Mermaid code, or their accessible summaries.
- The general homepage Tech Stack section remains unchanged and may continue to list MongoDB.
- All fleet project relational storage labels and project-specific tags use PostgreSQL.
- The Connected platform preview opens the shared C1 diagram through the existing `DiagramModal`.
- Preview mode must not render nested zoom controls; zoom, pan, and reset remain available inside the modal.
- Existing Escape, backdrop, focus trap, focus restoration, and accessible summary behavior remains intact.
- Public project copy stays qualitative and NDA-safe.

---

### Task 1: PostgreSQL and layered C4 data

**Files:**
- Modify: `tests/connected-projects.test.js`
- Modify: `src/data/fleetPlatform.js`
- Modify: `src/data/projects.js`

**Interfaces:**
- Consumes: existing `fleetPlatform.c4.context` and each project's `c4.container`, `c4.component`, `tags`, and `techStack`.
- Produces: the same public data shape, with PostgreSQL-only project database content and layered Mermaid code.

- [ ] **Step 1: Write failing database consistency tests**

Add to `tests/connected-projects.test.js`:

```js
test('uses PostgreSQL throughout fleet project architecture and content', () => {
  const projectText = JSON.stringify(projects);

  assert.doesNotMatch(projectText, /MongoDB/i);
  assert.match(projectText, /PostgreSQL/);

  for (const project of projects) {
    assert.match(project.c4.container.code, /PostgreSQL/);
    assert.match(project.techStack.join(' '), /PostgreSQL/);
  }
});
```

- [ ] **Step 2: Run the database test and verify RED**

Run:

```powershell
& 'C:\Program Files\nodejs\npm.cmd' test -- --test-name-pattern "uses PostgreSQL throughout"
```

Expected: FAIL because the Intelligence Hub still contains `MongoDB` and project tech stacks still use generic relational labels.

- [ ] **Step 3: Write failing layout tests**

Add to `tests/connected-projects.test.js`:

```js
test('uses layered C4 layouts without duplicate source relationships', () => {
  const context = fleetPlatform.c4.context.code;
  const sourceRelationships = context
    .split('\n')
    .filter((line) => /Platform.*Sources|Sources.*Platform/.test(line));

  assert.equal(sourceRelationships.length, 1);
  assert.match(sourceRelationships[0], /<-->/);

  for (const project of projects) {
    assert.match(project.c4.container.code, /^flowchart TB/m);
    assert.match(project.c4.container.code, /subgraph Clients/);
    assert.match(project.c4.container.code, /subgraph Services/);
    assert.match(project.c4.container.code, /subgraph DataStores/);
    assert.match(project.c4.component.code, /^flowchart TB/m);
  }
});
```

- [ ] **Step 4: Run the layout test and verify RED**

Run:

```powershell
& 'C:\Program Files\nodejs\npm.cmd' test -- --test-name-pattern "uses layered C4 layouts"
```

Expected: FAIL because C2/C3 still use `flowchart LR` and C1 has two opposite source relationships.

- [ ] **Step 5: Implement the C1 relationship cleanup**

In `src/data/fleetPlatform.js`, keep the existing nodes and replace the two source edges with one line:

```js
'  Platform <-->|REST/gRPC requests, responses, and approved events| Sources',
```

Replace the two matching accessibility relationships with:

```js
'The Fleet Operations Platform exchanges approved REST or gRPC requests, responses, and events with Approved Operational Data Sources.',
```

- [ ] **Step 6: Implement layered C2 containers and PostgreSQL stores**

Change `buildContainerDiagram` to emit a top-to-bottom graph with named groups:

```js
function buildContainerDiagram(currentId) {
  return [
    'flowchart TB',
    '  subgraph Clients[Client Applications]',
    '    direction LR',
    '    OperationsClient[Operations Client]',
    '    AdministrationClient[Administration Client]',
    '  end',
    '  subgraph Services[Backend Services]',
    '    direction LR',
    '    Admin[Fleet Administration & Dispatch<br/>Java 17 / Spring Boot]',
    '    Core[Fleet Operations Core<br/>Java 17 / Spring Boot]',
    '    Data[Fleet Data Intelligence Hub<br/>Java 17 / Spring Boot]',
    '  end',
    '  subgraph Messaging[Event Infrastructure]',
    '    Events[(Kafka)]',
    '  end',
    '  subgraph DataStores[Data Stores and Search]',
    '    direction LR',
    '    AdminStore[(Administration PostgreSQL)]',
    '    AdminCache[(Redis)]',
    '    CoreStore[(Operations PostgreSQL)]',
    '    CoreCache[(Redis)]',
    '    ReadStore[(Intelligence PostgreSQL)]',
    '    Search[(Elasticsearch)]',
    '  end',
    '  OperationsClient -->|REST/gRPC| Core',
    '  AdministrationClient -->|REST/gRPC| Admin',
    '  Admin -->|plans, resources, configuration| Core',
    '  Core -->|lookup and search| Data',
    '  Admin -->|aggregated lookup| Data',
    '  Core -->|operational events| Events',
    '  Admin -->|reference and coordination events| Events',
    '  Events -->|synchronization events| Data',
    '  Core --> CoreStore',
    '  Core --> CoreCache',
    '  Admin --> AdminStore',
    '  Admin --> AdminCache',
    '  Data --> ReadStore',
    '  Data --> Search',
    `  class ${currentId} current`,
    '  classDef current fill:#123047,stroke:#38bdf8,color:#e6edf3,stroke-width:2px',
  ].join('\n');
}
```

Update `buildContainerAccessibility` to list `Operations PostgreSQL`, `Administration PostgreSQL`, and `Intelligence PostgreSQL`; remove the MongoDB element and relationship.

- [ ] **Step 7: Implement layered C3 component diagrams**

Change all three C3 declarations to `flowchart TB`. Preserve their existing nodes and relationships, but define API/input nodes first, orchestration nodes second, adapters third, and infrastructure nodes last. In the intelligence diagram replace:

```js
'  Repositories --> Mongo[(MongoDB)]',
```

with:

```js
'  Repositories --> PostgreSQL[(PostgreSQL)]',
```

Update the intelligence accessible elements and relationship to say PostgreSQL.

- [ ] **Step 8: Update project-specific tags and tech stacks**

For all three project objects, replace project-specific `Relational database` entries with `PostgreSQL`. In Fleet Data Intelligence Hub, replace `MongoDB` in `tags` and `techStack` with `PostgreSQL` and avoid duplicate entries.

- [ ] **Step 9: Run Task 1 tests and verify GREEN**

Run:

```powershell
& 'C:\Program Files\nodejs\npm.cmd' test -- --test-name-pattern "PostgreSQL|layered C4"
```

Expected: both new tests PASS.

- [ ] **Step 10: Commit Task 1**

```powershell
git add tests/connected-projects.test.js src/data/fleetPlatform.js src/data/projects.js
git commit -m "fix: clarify fleet C4 storage and layout"
```

---

### Task 2: Clickable Connected platform preview

**Files:**
- Modify: `tests/reference-form.test.js`
- Modify: `src/components/MermaidDiagram.jsx`
- Modify: `src/components/FleetPlatformOverview.jsx`
- Modify: `src/components/sections/ProjectsSection.jsx`

**Interfaces:**
- `MermaidDiagram` adds optional props `preview = false` and `onOpen`.
- `FleetPlatformOverview` adds prop `onOpenDiagram(context)`.
- `ProjectsSection` continues to own `{ open, title, code, diagram }` modal state.

- [ ] **Step 1: Write the failing source contract test**

Add to `tests/reference-form.test.js`:

```js
test('Connected platform preview opens the shared C1 diagram in the modal', async () => {
  const [overview, section, diagram] = await Promise.all([
    source('../src/components/FleetPlatformOverview.jsx'),
    source('../src/components/sections/ProjectsSection.jsx'),
    source('../src/components/MermaidDiagram.jsx'),
  ]);

  assert.match(overview, /onOpenDiagram/);
  assert.match(overview, /Open Architecture/);
  assert.match(overview, /preview/);
  assert.match(section, /openPlatformDiagram/);
  assert.match(section, /fleetPlatform\.c4\.context/);
  assert.match(section, /onOpenDiagram=\{openPlatformDiagram\}/);
  assert.match(diagram, /preview\s*=\s*false/);
  assert.match(diagram, /onOpen/);
});
```

- [ ] **Step 2: Run the preview test and verify RED**

Run:

```powershell
& 'C:\Program Files\nodejs\npm.cmd' test -- --test-name-pattern "Connected platform preview"
```

Expected: FAIL because the overview has no open callback or preview mode.

- [ ] **Step 3: Add preview mode to `MermaidDiagram`**

Extend the signature:

```jsx
export default function MermaidDiagram({
  code,
  title,
  descriptionId,
  className = '',
  preview = false,
  onOpen,
}) {
```

After the ready state and before the existing `TransformWrapper`, render a preview branch:

```jsx
if (preview) {
  return (
    <div data-diagram-status='ready' className={`overflow-hidden rounded-xl border border-border bg-bg/60 ${className}`.trim()}>
      <button
        type='button'
        aria-label={`Open ${title} architecture`}
        className='block w-full cursor-zoom-in p-4 text-left transition hover:bg-white/5 focus-visible:bg-white/5'
        onClick={() => onOpen?.()}
      >
        <span
          role='img'
          aria-label={title}
          aria-describedby={descriptionId}
          className='block w-full max-w-full overflow-hidden [&_svg]:!h-auto [&_svg]:!w-full [&_svg]:!max-w-full'
          dangerouslySetInnerHTML={{ __html: renderState.svg }}
        />
      </button>
    </div>
  );
}
```

Leave the current `TransformWrapper` branch unchanged for modal and detail views.

- [ ] **Step 4: Wire `FleetPlatformOverview` to its opener**

Change the signature and diagram call:

```jsx
export default function FleetPlatformOverview({ platform, onOpenDiagram }) {
```

```jsx
<MermaidDiagram
  title={`${context.level} \u2014 ${context.title}`}
  code={context.code}
  descriptionId={descriptionId}
  preview
  onOpen={() => onOpenDiagram?.(context)}
/>
<button
  type='button'
  className='mt-3 min-h-11 rounded border border-border px-4 py-2 text-sm font-semibold text-text transition hover:border-accent hover:text-accent'
  onClick={() => onOpenDiagram?.(context)}
>
  Open Architecture
</button>
```

- [ ] **Step 5: Reuse modal state in `ProjectsSection`**

Add:

```jsx
const openPlatformDiagram = (context) => {
  setModal({
    open: true,
    title: `${context.level} \u2014 ${fleetPlatform.name}: ${context.title}`,
    code: context.code,
    diagram: context,
  });
};
```

Pass it to the overview:

```jsx
<FleetPlatformOverview
  platform={fleetPlatform}
  onOpenDiagram={openPlatformDiagram}
/>
```

- [ ] **Step 6: Run Task 2 test and verify GREEN**

```powershell
& 'C:\Program Files\nodejs\npm.cmd' test -- --test-name-pattern "Connected platform preview"
```

Expected: PASS.

- [ ] **Step 7: Commit Task 2**

```powershell
git add tests/reference-form.test.js src/components/MermaidDiagram.jsx src/components/FleetPlatformOverview.jsx src/components/sections/ProjectsSection.jsx
git commit -m "feat: open connected platform architecture modal"
```

---

### Task 3: Regression verification and local handoff

**Files:**
- Verify only; modify production files only if a failing regression directly identifies a defect in Tasks 1 or 2.

**Interfaces:**
- Consumes: completed C4 data and preview/modal behavior from Tasks 1 and 2.
- Produces: a clean, buildable branch that the already-running Vite server hot-reloads.

- [ ] **Step 1: Run the full test suite**

```powershell
& 'C:\Program Files\nodejs\npm.cmd' test
```

Expected: 0 failures; the two Windows symlink tests may remain skipped.

- [ ] **Step 2: Run lint**

```powershell
& 'C:\Program Files\nodejs\npm.cmd' run lint
```

Expected: exit code 0 with no ESLint errors.

- [ ] **Step 3: Run production build and prerender**

```powershell
& 'C:\Program Files\nodejs\npm.cmd' run build
```

Expected: build succeeds and prerenders `/` plus the three fleet project routes.

- [ ] **Step 4: Verify privacy and content scope**

```powershell
rg -n "MongoDB" src/data/projects.js src/data/fleetPlatform.js
```

Expected: no matches. `MongoDB` may still exist in the separate general Tech Stack data.

- [ ] **Step 5: Verify repository state**

```powershell
git diff --check
git status --short --branch
```

Expected: no uncommitted production or test changes after the task commits.
