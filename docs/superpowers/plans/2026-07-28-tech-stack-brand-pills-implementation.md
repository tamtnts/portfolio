# Tech Stack Brand Pills Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current homepage Tech Stack cards with the approved two-card brand-icon pill layout.

**Architecture:** Keep stack labels as plain serializable strings in `profile.stack.core` and `profile.stack.infrastructure`. `StackSection` owns a small label-to-icon registry using individually imported `react-icons` components, while `Home` consumes the same two arrays for structured data.

**Tech Stack:** React 19, Tailwind CSS, `react-icons` 5.7.0, Node test runner, Vite

## Global Constraints

- Keep the existing `tech-stack` anchor and homepage position.
- Use `Tech Stack` and `Tools I ship with` as the two headings.
- Publish exactly the approved Core Stack and Infrastructure lists.
- Render equal-width cards on medium and larger screens and stacked cards on small screens.
- Render every technology as visible text in a non-interactive wrapping pill with one decorative SVG icon.
- Remove the current descriptions and asymmetric accent treatment.
- Do not change any other homepage section or any project-detail page.
- Do not deploy or push this change without separate user approval.

---

### Task 1: Brand-icon Tech Stack section

**Files:**
- Create: `tests/tech-stack-section.test.js`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/data/profile.js`
- Modify: `src/pages/Home.jsx`
- Modify: `src/components/sections/StackSection.jsx`

**Interfaces:**
- Consumes: `profile.stack.core: string[]` and `profile.stack.infrastructure: string[]`
- Produces: a `StackSection` with the existing `tech-stack` anchor, two semantic tool lists, and decorative SVG icons

- [ ] **Step 1: Write the failing regression test**

Create `tests/tech-stack-section.test.js`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { profile } from '../src/data/profile.js';

const source = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('tech stack publishes the approved two-card brand-icon layout', async () => {
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

  assert.equal(packageJson.dependencies['react-icons'], '^5.7.0');
  assert.match(stackSection, /Tools I ship with/);
  assert.match(stackSection, /CORE STACK/);
  assert.match(stackSection, /INFRASTRUCTURE/);
  assert.match(stackSection, /grid[^'"]*md:grid-cols-2/);
  assert.match(stackSection, /<ul[^>]*flex[^>]*flex-wrap/);
  assert.match(stackSection, /<li[^>]*rounded-full/);
  assert.match(stackSection, /aria-hidden=['"]true['"]/);
  assert.doesNotMatch(stackSection, /description|Delivery & Supporting|Tools I work with/);
  assert.match(home, /\.\.\.profile\.stack\.core/);
  assert.match(home, /\.\.\.profile\.stack\.infrastructure/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
node --test tests/tech-stack-section.test.js
```

Expected: FAIL because `profile.stack.core`, `profile.stack.infrastructure`, the new headline, and the `react-icons` dependency do not exist.

- [ ] **Step 3: Install the SVG icon dependency**

Run:

```powershell
npm install react-icons@^5.7.0
```

Expected: `package.json` and `package-lock.json` contain `react-icons` version `^5.7.0`.

- [ ] **Step 4: Replace the stack data contract**

Replace the existing `profile.stack` value in `src/data/profile.js` with:

```js
  stack: {
    core: [
      'Java (Spring Boot)',
      'Netty / TCP',
      'Kafka',
      'EMQX / MQTT',
      'Redis',
      'Oracle DB',
      'PostgreSQL',
      'MongoDB',
      'Elasticsearch',
    ],
    infrastructure: [
      'Kubernetes',
      'Rancher',
      'Nginx',
      'Grafana',
      'GitLab CI',
      'Linux',
      'MinIO / S3',
    ],
  },
```

- [ ] **Step 5: Update homepage structured data**

Replace the `knowsAbout` stack entries in `src/pages/Home.jsx` with:

```js
    knowsAbout: [
      ...profile.stack.core,
      ...profile.stack.infrastructure,
    ],
```

- [ ] **Step 6: Implement the two-card SVG pill layout**

Replace `src/components/sections/StackSection.jsx` with:

```jsx
import { FaJava, FaLinux } from 'react-icons/fa';
import { LuNetwork } from 'react-icons/lu';
import {
  SiApachekafka,
  SiElasticsearch,
  SiGitlab,
  SiGrafana,
  SiKubernetes,
  SiMinio,
  SiMongodb,
  SiMqtt,
  SiNginx,
  SiOracle,
  SiPostgresql,
  SiRancher,
  SiRedis,
} from 'react-icons/si';
import Card from '../Card';
import Reveal from '../Reveal';
import { profile } from '../../data/profile';

const toolIcons = {
  'Java (Spring Boot)': { Icon: FaJava, color: 'text-[#f89820]' },
  'Netty / TCP': { Icon: LuNetwork, color: 'text-[#00a1d6]' },
  Kafka: { Icon: SiApachekafka, color: 'text-text' },
  'EMQX / MQTT': { Icon: SiMqtt, color: 'text-[#660066]' },
  Redis: { Icon: SiRedis, color: 'text-[#dc382d]' },
  'Oracle DB': { Icon: SiOracle, color: 'text-[#f80000]' },
  PostgreSQL: { Icon: SiPostgresql, color: 'text-[#4169e1]' },
  MongoDB: { Icon: SiMongodb, color: 'text-[#47a248]' },
  Elasticsearch: { Icon: SiElasticsearch, color: 'text-[#00bfb3]' },
  Kubernetes: { Icon: SiKubernetes, color: 'text-[#326ce5]' },
  Rancher: { Icon: SiRancher, color: 'text-[#0075a8]' },
  Nginx: { Icon: SiNginx, color: 'text-[#009639]' },
  Grafana: { Icon: SiGrafana, color: 'text-[#f46800]' },
  'GitLab CI': { Icon: SiGitlab, color: 'text-[#fc6d26]' },
  Linux: { Icon: FaLinux, color: 'text-[#fcc624]' },
  'MinIO / S3': { Icon: SiMinio, color: 'text-[#c72e49]' },
};

const groups = [
  { title: 'CORE STACK', items: profile.stack.core },
  { title: 'INFRASTRUCTURE', items: profile.stack.infrastructure },
];

function ToolPill({ name }) {
  const { Icon, color } = toolIcons[name];

  return (
    <li className='inline-flex min-h-8 items-center gap-2 rounded-full border border-border bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-muted sm:text-sm'>
      <Icon aria-hidden='true' className={`shrink-0 text-sm ${color}`} />
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

- [ ] **Step 7: Run the focused test and verify GREEN**

Run:

```powershell
node --test tests/tech-stack-section.test.js
```

Expected: 1 test passed, 0 failed.

- [ ] **Step 8: Update the existing reference-form expectation**

In `tests/reference-form.test.js`, replace:

```js
  assert.match(stack, /Core Stack/);
  assert.match(stack, /Delivery & Supporting/);
```

with:

```js
  assert.match(stack, /CORE STACK/);
  assert.match(stack, /INFRASTRUCTURE/);
```

- [ ] **Step 9: Run the complete automated verification**

Run:

```powershell
node --test
node .\node_modules\eslint\bin\eslint.js .
$env:VITE_BASE='/portfolio/'; node .\node_modules\vite\bin\vite.js build
$env:VITE_BASE='/portfolio/'; node .\scripts\prerender.js
git diff --check
```

Expected:

- All Node tests pass, except the two existing Windows symlink-policy skips.
- ESLint exits with code 0 and no errors.
- Vite build completes successfully.
- Prerender completes `/`, `/projects/fleet-operations-management-platform`, and `/projects/fleetops-data-hub`.
- `git diff --check` reports no whitespace errors.

- [ ] **Step 10: Verify the layout in the browser**

Inspect the homepage at approximately `1440x900` and `390x844`.

Expected:

- Desktop shows two equal-width cards in one row.
- Mobile shows two stacked cards.
- Every pill wraps fully without ellipsis or horizontal document overflow.
- Icons remain aligned with their labels and are visible on the dark background.
- The section resembles the supplied reference without changing neighboring sections.
- Browser console contains no errors.

- [ ] **Step 11: Commit the implementation**

Run:

```powershell
git add package.json package-lock.json src/data/profile.js src/pages/Home.jsx src/components/sections/StackSection.jsx tests/tech-stack-section.test.js tests/reference-form.test.js
git commit -m "feat: restyle tech stack with brand icon pills"
```

Expected: one implementation commit containing only the approved Tech Stack change and its tests.
