# Architecture Component Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create one Vietnamese Markdown guide that explains the responsibility, purpose, inputs, outputs, and primary relationships of every public C1, C2, and C3 architecture component across the three fleet-platform case studies.

**Architecture:** Treat `src/data/fleetPlatform.js` and `src/data/projects.js` as the source of truth. Add a documentation-contract test that requires every approved component and project section, then write one standalone guide under `docs/architecture/`. The guide remains repository documentation and is not added to the public React routes.

**Tech Stack:** Markdown, Node.js built-in test runner, JavaScript regular-expression assertions, existing npm test/lint/build workflow.

## Global Constraints

- **Authoritative component-entry contract:** every unique public C1, C2, or C3
  component has an exact \`#### <component name>\` heading. Its five required
  fields must appear after that heading and before the next \`####\` component
  heading.
- **Authoritative field labels:** \`**Nhi&#7879;m v&#7909;:**\`,
  \`**T&aacute;c d&#7909;ng:**\`, \`**&#272;&#7847;u v&agrave;o:**\`,
  \`**&#272;&#7847;u ra:**\`, and \`**Quan h&#7879; ch&iacute;nh:**\`.
  These exact Vietnamese labels replace any mojibake text in earlier examples.
- Write explanations in Vietnamese while preserving technical component names in English.
- Use the fields **Nhiệm vụ**, **Tác dụng**, **Đầu vào**, **Đầu ra**, and **Quan hệ chính** for every component.
- Use only component names, relationships, and generalized flows confirmed by `src/data/fleetPlatform.js` and `src/data/projects.js`.
- Do not introduce private endpoint names, Kafka topics, schemas, tables, identifiers, deployment names, infrastructure addresses, metrics, or source-repository paths.
- PostgreSQL is the database in all three project architectures.
- MongoDB must not appear in the architecture guide.
- Do not add a public website route or navigation item for the guide.

---

### Task 1: Define the architecture-guide documentation contract

**Files:**
- Create: `tests/architecture-component-guide.test.js`
- Read: `src/data/fleetPlatform.js`
- Read: `src/data/projects.js`

**Interfaces:**
- Consumes: exported `fleetPlatform` from `src/data/fleetPlatform.js` and exported `projects` from `src/data/projects.js`.
- Produces: a test contract for `docs/architecture/fleet-platform-component-guide.md`.

- [ ] **Step 1: Write the failing guide-contract test**

Create `tests/architecture-component-guide.test.js`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fleetPlatform } from '../src/data/fleetPlatform.js';
import { projects } from '../src/data/projects.js';

const guideUrl = new URL(
  '../docs/architecture/fleet-platform-component-guide.md',
  import.meta.url,
);

const requiredFields = [
  'Nhiệm vụ',
  'Tác dụng',
  'Đầu vào',
  'Đầu ra',
  'Quan hệ chính',
];

test('architecture guide covers every public C1 C2 and C3 component', async () => {
  const guide = await readFile(guideUrl, 'utf8');
  const diagrams = [
    fleetPlatform.c4.context,
    ...projects.flatMap((project) => [
      project.c4.container,
      project.c4.component,
    ]),
  ];

  for (const project of projects) {
    assert.match(guide, new RegExp(project.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  for (const diagram of diagrams) {
    for (const element of diagram.accessibility.elements) {
      assert.ok(
        guide.includes(element),
        `Missing architecture component: ${element}`,
      );
    }
  }

  for (const field of requiredFields) {
    assert.match(guide, new RegExp(`\\*\\*${field}:\\*\\*`));
  }
});

test('architecture guide stays PostgreSQL-based and NDA-safe', async () => {
  const guide = await readFile(guideUrl, 'utf8');

  assert.match(guide, /PostgreSQL/);
  assert.doesNotMatch(guide, /MongoDB/i);
  assert.doesNotMatch(
    guide,
    /project-165|ttttch165|data-mining-service|admin-service|app-service/i,
  );
  assert.doesNotMatch(
    guide,
    /(?:https?:\/\/)?10\.\d+\.\d+\.\d+|\/api\/v\d+|topic\s*[:=]|table\s*[:=]/i,
  );
});
```

**Correction to the Task 1 code example:** the committed test must use the
Unicode escape values from the Global Constraints and derive a \`Set\` of
all public elements. For each component, it must match an exact
\`#### <component name>\` entry and assert every authoritative field label
within that captured entry. It must not accept labels that occur only elsewhere
in the guide.

- [ ] **Step 2: Run the focused test to verify it fails**

Run:

```powershell
& 'C:\Program Files\nodejs\npm.cmd' test -- --test-name-pattern "architecture guide"
```

Expected: FAIL with `ENOENT` for
`docs/architecture/fleet-platform-component-guide.md`.

- [ ] **Step 3: Commit the failing documentation contract**

```powershell
git add tests/architecture-component-guide.test.js
git commit -m "test: define architecture guide coverage"
```

---

### Task 2: Write the Vietnamese component guide

**Files:**
- Create: `docs/architecture/fleet-platform-component-guide.md`
- Test: `tests/architecture-component-guide.test.js`
- Read: `src/data/fleetPlatform.js`
- Read: `src/data/projects.js`

**Interfaces:**
- Consumes: the component lists and relationships required by
  `tests/architecture-component-guide.test.js`.
- Produces: `docs/architecture/fleet-platform-component-guide.md`, a
  standalone Markdown reference document.

- [ ] **Step 1: Create the guide header and reading conventions**

Begin the document with:

```markdown
# Chú thích thành phần Architecture — Fleet Operations Platform

## 1. Mục đích và phạm vi

Tài liệu này giải thích các thành phần xuất hiện trong C4 Model công khai của
ba project thuộc Fleet Operations Platform. Tên và luồng đã được tổng quát hóa
để bảo mật; tài liệu không mô tả nguyên trạng hệ thống production.

Mỗi thành phần được trình bày theo năm ý:

- **Nhiệm vụ:** trách nhiệm chính của thành phần.
- **Tác dụng:** giá trị của thành phần trong kiến trúc.
- **Đầu vào:** loại yêu cầu, sự kiện hoặc dữ liệu được nhận.
- **Đầu ra:** phản hồi, sự kiện, dữ liệu lưu trữ hoặc lời gọi được tạo ra.
- **Quan hệ chính:** thành phần liên quan và kiểu giao tiếp đã được xác nhận.

## 2. Cách đọc C4 Model trong portfolio

- **C1 — System Context:** mô tả con người và hệ thống bên ngoài tương tác với
  Fleet Operations Platform.
- **C2 — Container View:** mô tả ba backend service, client, event
  infrastructure và data store chính.
- **C3 — Component View:** mô tả các khối trách nhiệm bên trong từng backend
  service.
```

Use \`#### <component name>\` for every component entry throughout the
guide. Immediately below the heading, include all five authoritative labels
from Global Constraints before the next \`####\` component heading.

- [ ] **Step 2: Document the shared C1 System Context**

Add `## 3. C1 — Fleet Operations Platform` and create one component entry for
each exact source element:

```text
Fleet Operations Staff
Administrator / Dispatcher
Fleet Operations Platform
Approved Operational Data Sources
```

For each entry, include all five required fields. Describe only these confirmed
relationships:

```text
Fleet Operations Staff -> Fleet Operations Platform
Administrator / Dispatcher -> Fleet Operations Platform
Fleet Operations Platform <-> Approved Operational Data Sources
```

State that C1 intentionally treats the platform as one software system and does
not expose internal services.

- [ ] **Step 3: Document Project 1 C2 and C3**

Add `## 4. Project 1 — Fleet Operations Core`.

Under `### 4.1. C2 — Container View`, document all exact C2 elements:

```text
Operations Client
Administration Client
Fleet Operations Core service
Fleet Administration & Dispatch service
Fleet Data Intelligence Hub service
Kafka event broker
Operations PostgreSQL
Operational Redis cache
Administration PostgreSQL
Administration Redis cache
Intelligence PostgreSQL
Elasticsearch search index
```

Emphasize Fleet Operations Core as the current service. Explain the confirmed
REST/gRPC client and service relationships, Kafka publication path, and
service-owned PostgreSQL/Redis relationships from
`project.c4.container.accessibility.relationships`.

Under `### 4.2. C3 — Component View`, document:

```text
REST and gRPC API
Workflow and Query Use Cases
Persistence Adapter
Cache Adapter
Service Integration Adapters
Event Adapter
Document Renderer
PostgreSQL
Redis
Related Platform Services
Kafka
```

Use the exact relationship meanings from
`operationsComponentAccessibility`: API delegates to use cases; use cases
coordinate outbound adapters; persistence uses PostgreSQL; cache uses Redis;
integrations call related services; event adapter publishes to Kafka.

Under `### 4.3. Luồng tổng quát`, convert the existing
`projects[0].mainFlow` list into a numbered Vietnamese explanation without
adding endpoint, schema, topic, or timing details.

- [ ] **Step 4: Document Project 2 C2 and C3**

Add `## 5. Project 2 — Fleet Administration & Dispatch`.

Under `### 5.1. C2 — Container View`, repeat the complete twelve-element C2
topology so this project section can be read independently. Emphasize Fleet
Administration & Dispatch as the current service.

Under `### 5.2. C3 — Component View`, document:

```text
REST and gRPC API
Planning and Coordination Use Cases
Resource and Device Use Cases
Configuration and Reference Use Cases
Persistence Adapter
Cache and Coordination Adapter
Service Integration Adapters
Event Adapter
Report and Export Renderer
PostgreSQL
Redis and ShedLock
Related Platform Services
Kafka
```

Use only the relationships in `administrationComponentAccessibility`,
including shared persistence, coordination through Redis/ShedLock, related
service integration, Kafka publication, and approved report/export rendering.

Under `### 5.3. Luồng tổng quát`, translate `projects[1].mainFlow` into a
numbered Vietnamese explanation.

- [ ] **Step 5: Document Project 3 C2 and C3**

Add `## 6. Project 3 — Fleet Data Intelligence Hub`.

Under `### 6.1. C2 — Container View`, repeat the complete C2 topology and
emphasize Fleet Data Intelligence Hub as the current service.

Under `### 6.2. C3 — Component View`, document:

```text
Kafka
Kafka Consumers
Approved Source Systems
Integration Adapters
Synchronization Workers
Normalization and Mapping
Data Repositories
Search Adapter
Integration State Tracking
REST and gRPC Lookup API
Query and Aggregation Services
PostgreSQL
Elasticsearch
```

Use only the relationships in `intelligenceComponentAccessibility`: events and
approved service integrations feed synchronization workers; normalization
updates repositories, search, and integration state; lookup delegates to query
services; repositories use PostgreSQL; search uses Elasticsearch.

Under `### 6.3. Luồng tổng quát`, translate `projects[2].mainFlow` into a
numbered Vietnamese explanation. Keep the read path limited to PostgreSQL and
Elasticsearch.

- [ ] **Step 6: Add the glossary and confidentiality section**

Add:

```markdown
## 7. Thuật ngữ kỹ thuật dùng trong architecture

## 8. Ghi chú bảo mật và giới hạn mô hình
```

Define REST, gRPC, Kafka, Redis, PostgreSQL, Elasticsearch, ShedLock,
OpenFeign, and Document/Report Renderer in the context of these diagrams.

End with these explicit limits:

```markdown
- Tên project, ranh giới service và quan hệ đã được tổng quát hóa.
- Tài liệu không công bố endpoint, topic, schema, table, identifier, địa chỉ
  hạ tầng, cấu hình deployment hoặc số liệu production.
- PostgreSQL là database được mô tả trong ba project architecture.
- Những chi tiết không xuất hiện trong C4 Model công khai được xem là ngoài
  phạm vi tài liệu.
```

- [ ] **Step 7: Run the focused test to verify it passes**

Run:

```powershell
& 'C:\Program Files\nodejs\npm.cmd' test -- --test-name-pattern "architecture guide"
```

Expected: PASS for both guide tests.

- [ ] **Step 8: Scan the guide for prohibited content**

Run:

```powershell
rg -n -i "MongoDB|project-165|ttttch165|data-mining-service|admin-service|app-service|10\.\d+\.\d+\.\d+" docs/architecture/fleet-platform-component-guide.md
```

Expected: no matches.

- [ ] **Step 9: Commit the completed guide**

```powershell
git add docs/architecture/fleet-platform-component-guide.md
git commit -m "docs: explain fleet architecture components"
```

---

### Task 3: Verify and publish the documentation update

**Files:**
- Verify: `docs/architecture/fleet-platform-component-guide.md`
- Verify: `tests/architecture-component-guide.test.js`
- Verify: `docs/superpowers/specs/2026-07-30-architecture-component-guide-design.md`
- Verify: `docs/superpowers/plans/2026-07-30-architecture-component-guide-implementation.md`

**Interfaces:**
- Consumes: the completed guide and its coverage contract.
- Produces: a verified commit pushed to the existing
  `agent/architecture-popup-postgresql` Pull Request branch.

- [ ] **Step 1: Run the full test suite**

```powershell
& 'C:\Program Files\nodejs\npm.cmd' test
```

Expected: all runnable tests pass; operating-system symlink tests may remain
skipped as in the current baseline.

- [ ] **Step 2: Run lint and production build**

```powershell
& 'C:\Program Files\nodejs\npm.cmd' run lint
& 'C:\Program Files\nodejs\npm.cmd' run build
```

Expected: both commands exit with code `0`; Vite may retain its existing
large-chunk warning.

- [ ] **Step 3: Verify the final diff**

```powershell
git diff --check
git status --short
git log -3 --oneline
```

Expected: no whitespace errors and no uncommitted files.

- [ ] **Step 4: Push the documentation commits**

```powershell
git push origin agent/architecture-popup-postgresql
```

Expected: the existing GitHub Pull Request branch advances to the final
documentation commit.
