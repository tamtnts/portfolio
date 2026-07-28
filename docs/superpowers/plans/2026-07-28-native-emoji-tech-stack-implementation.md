# Native Emoji Tech Stack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all 16 Tech Stack brand-logo icons with the approved native emoji mapping while preserving the existing layout and removing the now-unused `react-icons` dependency.

**Architecture:** Keep `profile.stack` as the source of truth for labels and group membership. Replace the component registry in `StackSection.jsx` with a local name-to-emoji string map, and render each emoji as a decorative fixed-width span inside the existing semantic pill list. Update the focused source contract before implementation, then verify the complete application and responsive browser output.

**Tech Stack:** React 19, Vite 7, Tailwind CSS 3, Node test runner, ESLint, native Unicode emoji

## Global Constraints

- Preserve the approved Core Stack and Infrastructure labels and order exactly.
- Preserve the two-card layout, pill geometry, list semantics, headings, spacing, and responsive breakpoints.
- Use native Unicode emoji only; add no SVG, raster image, Twemoji, or replacement icon dependency.
- Render every emoji as decorative with `aria-hidden="true"` while retaining the visible tool label.
- Remove `react-icons` from both manifest and lockfile because no other source file consumes it.
- Validate at 1440×900 and 390×844 with 16 emoji, 16 labels, no overflow, and no new console warning or error.

---

### Task 1: Replace Brand Icons with Native Emoji

**Files:**
- Modify: `tests/tech-stack-section.test.js`
- Modify: `src/components/sections/StackSection.jsx`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Consumes: `profile.stack.core: string[]` and `profile.stack.infrastructure: string[]` from `src/data/profile.js`
- Produces: `toolEmoji: Record<string, string>` local to `StackSection.jsx`
- Produces: `ToolPill({ name: string })` rendering one decorative emoji span and one visible label span

- [ ] **Step 1: Replace the focused contract with a failing native-emoji test**

Replace `tests/tech-stack-section.test.js` with:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { profile } from '../src/data/profile.js';

const source = (path) => readFile(new URL(path, import.meta.url), 'utf8');
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test('tech stack publishes the approved two-card native-emoji layout', async () => {
  const [stackSection, home, packageJson] = await Promise.all([
    source('../src/components/sections/StackSection.jsx'),
    source('../src/pages/Home.jsx'),
    source('../package.json').then(JSON.parse),
  ]);

  assert.deepEqual(profile.stack.core, [
    'Java (Spring Boot)',
    'Netty / TCP',
    'Kafka',
    'EMQX / MQTT',
    'Redis',
    'Oracle DB',
    'PostgreSQL',
    'MongoDB',
    'Elasticsearch',
  ]);
  assert.deepEqual(profile.stack.infrastructure, [
    'Kubernetes',
    'Rancher',
    'Nginx',
    'Grafana',
    'GitLab CI',
    'Linux',
    'MinIO / S3',
  ]);

  const expectedEmoji = {
    'Java (Spring Boot)': '☕',
    'Netty / TCP': '🪄',
    Kafka: '💻',
    'EMQX / MQTT': '🏃',
    Redis: '⚡',
    'Oracle DB': '🚪',
    PostgreSQL: '🐘',
    MongoDB: '🐊',
    Elasticsearch: '🔎',
    Kubernetes: '⚛️',
    Rancher: '🐮',
    Nginx: '🚦',
    Grafana: '📊',
    'GitLab CI': '🔥',
    Linux: '🐧',
    'MinIO / S3': '📦',
  };

  for (const [tool, emoji] of Object.entries(expectedEmoji)) {
    assert.match(
      stackSection,
      new RegExp(`['"]${escapeRegex(tool)}['"]\\s*:\\s*['"]${emoji}['"]`),
    );
  }

  assert.equal(packageJson.dependencies['react-icons'], undefined);
  assert.match(stackSection, /const toolEmoji/);
  assert.match(stackSection, /Tools I ship with/);
  assert.match(stackSection, /CORE STACK/);
  assert.match(stackSection, /INFRASTRUCTURE/);
  assert.match(stackSection, /grid[^'"]*md:grid-cols-2/);
  assert.match(stackSection, /<ul[^>]*flex[^>]*flex-wrap/);
  assert.match(stackSection, /<li[^>]*rounded-full/);
  assert.match(stackSection, /<span[^>]*aria-hidden=['"]true['"][^>]*>\s*\{emoji\}\s*<\/span>/);
  assert.doesNotMatch(stackSection, /react-icons|<Icon|toolIcons|Si[A-Z]|Fa[A-Z]|GrOracle|LuNetwork/);
  assert.doesNotMatch(stackSection, /description|Delivery & Supporting|Tools I work with/);
  assert.match(home, /\.\.\.profile\.stack\.core/);
  assert.match(home, /\.\.\.profile\.stack\.infrastructure/);
});
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run:

```powershell
node --test tests/tech-stack-section.test.js
```

Expected: FAIL because `react-icons` still exists, `toolEmoji` is absent, and the approved emoji mappings are not present.

- [ ] **Step 3: Replace `StackSection.jsx` with the minimal emoji implementation**

Replace `src/components/sections/StackSection.jsx` with:

```jsx
import Card from '../Card';
import Reveal from '../Reveal';
import { profile } from '../../data/profile';

const toolEmoji = {
  'Java (Spring Boot)': '☕',
  'Netty / TCP': '🪄',
  Kafka: '💻',
  'EMQX / MQTT': '🏃',
  Redis: '⚡',
  'Oracle DB': '🚪',
  PostgreSQL: '🐘',
  MongoDB: '🐊',
  Elasticsearch: '🔎',
  Kubernetes: '⚛️',
  Rancher: '🐮',
  Nginx: '🚦',
  Grafana: '📊',
  'GitLab CI': '🔥',
  Linux: '🐧',
  'MinIO / S3': '📦',
};

const groups = [
  { title: 'CORE STACK', items: profile.stack.core },
  { title: 'INFRASTRUCTURE', items: profile.stack.infrastructure },
];

function ToolPill({ name }) {
  const emoji = toolEmoji[name];

  return (
    <li className='inline-flex min-h-8 items-center gap-2 rounded-full border border-border bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-muted sm:text-sm'>
      <span
        aria-hidden='true'
        className='w-4 shrink-0 text-center text-sm leading-none'
        style={{ fontFamily: "'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif" }}
      >
        {emoji}
      </span>
      <span>{name}</span>
    </li>
  );
}

export default function StackSection() {
  return (
    <section id='tech-stack' className='scroll-mt-20'>
      <Reveal>
        <div className='font-mono text-xs text-muted'>Tech Stack</div>
        <h2 className='mt-2 text-xl font-black text-text'>Tools I ship with</h2>
      </Reveal>
      <div className='mt-7 grid gap-4 md:grid-cols-2'>
        {groups.map((group) => (
          <Reveal key={group.title}>
            <Card className='h-full p-5 sm:p-6'>
              <h3 className='font-mono text-[11px] font-bold tracking-[0.08em] text-muted'>
                {group.title}
              </h3>
              <ul className='mt-5 flex flex-wrap gap-2'>
                {group.items.map((item) => <ToolPill key={item} name={item} />)}
              </ul>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Remove the unused icon dependency**

Run:

```powershell
& 'C:\Users\ADMIN\AppData\Local\Temp\node-v22.23.1-win-x64\npm.cmd' uninstall react-icons
```

Expected:

- `package.json` no longer contains `"react-icons": "^5.7.0"`;
- the root dependency list and `node_modules/react-icons` package record are removed from `package-lock.json`;
- no new dependency is added.

- [ ] **Step 5: Run the focused test and confirm GREEN**

Run:

```powershell
node --test tests/tech-stack-section.test.js
```

Expected: 1 test passed, 0 failed.

- [ ] **Step 6: Run the complete automated verification**

Run:

```powershell
node --test
node node_modules/eslint/bin/eslint.js .
node node_modules/vite/bin/vite.js build
node scripts/prerender.js
git diff --check
```

Expected:

- 42 tests passed, 0 failed, with 2 Windows symlink tests skipped;
- ESLint exits 0;
- Vite production build exits 0;
- prerender completes `/`, `/projects/fleet-operations-management-platform`, and `/projects/fleetops-data-hub`;
- `git diff --check` exits 0.

- [ ] **Step 7: Perform desktop and mobile browser QA**

Start the local server:

```powershell
node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 8096
```

Inspect `http://127.0.0.1:8096/#tech-stack` at 1440×900 and 390×844.

Expected at both sizes:

- 16 emoji spans and 16 visible tool labels;
- no SVG brand icons;
- two equal desktop cards and stacked mobile cards;
- no pill or document horizontal overflow;
- no console warning or error introduced by this change.

- [ ] **Step 8: Commit the implementation**

Run:

```powershell
git add src/components/sections/StackSection.jsx tests/tech-stack-section.test.js package.json package-lock.json
git commit -m "feat: use native emoji for tech stack"
```

Expected: one focused implementation commit after the existing design and plan commits.

---

### Task 2: Review and Publish the Verified Branch

**Files:**
- Review only: all files changed from `origin/main`
- No production file should change unless review identifies a concrete defect

**Interfaces:**
- Consumes: verified commit from Task 1
- Produces: pushed branch `agent/native-emoji-tech-stack` and a Draft Pull Request against `main`

- [ ] **Step 1: Review the complete branch diff**

Run:

```powershell
git diff --stat origin/main...HEAD
git diff --check origin/main...HEAD
git status -sb
```

Expected: only the design spec, implementation plan, component, focused test, manifest, and lockfile differ; tracked worktree is clean.

- [ ] **Step 2: Push the branch**

Run:

```powershell
git push -u origin agent/native-emoji-tech-stack
```

Expected: the branch is created on `tamtnts/portfolio` without rewriting any existing remote branch.

- [ ] **Step 3: Open a Draft Pull Request**

Create a Draft PR from `agent/native-emoji-tech-stack` to `main` with:

- title: `Use native emoji for Tech Stack icons`
- summary of the 16-icon migration and dependency cleanup;
- validation results from focused tests, full tests, lint, build, prerender, and browser QA;
- note that native emoji rendering can vary slightly by operating system.

Expected: an open Draft PR targeting `main`. Do not merge without a separate explicit user instruction.
