# GTEL Middle Backend Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the GTEL OTS experience summary with the approved nine-bullet Middle Backend Developer capability profile.

**Architecture:** Keep rendering unchanged and update only profile data plus its contract test. The test locks the exact approved order and wording so future edits cannot silently remove capability groups or introduce unreviewed claims.

**Tech Stack:** JavaScript ES modules, Node.js built-in test runner, React profile data, ESLint, Vite.

## Global Constraints

- Update only the GTEL OTS highlights and the profile-data contract.
- Keep the company, role, period, FPT Software entry, layout, projects, Tech Stack, summary, and CV PDF unchanged.
- Publish exactly nine English highlights in the approved order.
- Do not add quantitative claims, customer names, private identifiers, endpoints, topics, schemas, infrastructure addresses, or proprietary architecture details.
- Preserve the user's unrelated modification to `docs/superpowers/specs/2026-07-27-reference-form-nda-case-studies-design.md`.

---

### Task 1: Publish the approved GTEL OTS capability profile

**Files:**
- Modify: `tests/profile-data.test.js`
- Modify: `src/data/profile.js`

**Interfaces:**
- Consumes: `profile.experience`, where the GTEL OTS entry is selected by `company === 'GTEL OTS'`.
- Produces: `profile.experience[0].highlights` containing the exact nine approved strings rendered by `ExperienceSection.jsx`.

- [ ] **Step 1: Add the failing contract test**

Append this test after the public identity test in `tests/profile-data.test.js`:

```js
test('GTEL OTS experience presents the approved Middle Backend capability profile', () => {
  const experience = profile.experience.find(({ company }) => company === 'GTEL OTS');

  assert.ok(experience);
  assert.deepEqual(experience.highlights, [
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
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
node --test tests/profile-data.test.js
```

Expected: the new test fails because the current GTEL OTS entry has five highlights.

- [ ] **Step 3: Replace the GTEL OTS highlights**

In `src/data/profile.js`, replace only the GTEL OTS `highlights` array with:

```js
highlights: [
  'Develop and maintain Java 17+ and Spring Boot microservices for vehicle lookup, journey data, operational statistics, and record exports.',
  'Design Oracle, PostgreSQL, MySQL, and MongoDB data models; optimize SQL queries, indexing, partitioning, transactions, and persistence with Spring Data JPA/Hibernate.',
  'Build resilient Kafka consumers and asynchronous synchronization workers with retry, idempotency, and dead-letter handling.',
  'Use Redis for caching, distributed locking, rate limiting, and temporary state coordination.',
  'Integrate microservices through gRPC and REST APIs; implement JWT/OAuth2 authentication, RBAC authorization, and API security practices.',
  'Optimize backend latency, throughput, and scalability for high-concurrency operational workloads.',
  'Build, deploy, and troubleshoot services with Maven/Gradle, Docker, Kubernetes, and CI/CD pipelines.',
  'Write unit and integration tests; monitor services through Prometheus, Grafana, ELK, and log analysis.',
  'Participate in code reviews, technical design discussions, cross-functional collaboration, and mentoring junior developers.',
],
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```powershell
node --test tests/profile-data.test.js
```

Expected: all profile-data tests pass.

- [ ] **Step 5: Run full verification**

Run:

```powershell
npm test
npm run lint
npm run build
node --test tests/privacy-content.test.js
git diff --check
```

Expected: all tests pass except the two baseline Windows symlink skips; lint and build exit `0`; privacy test passes; diff check is clean.

- [ ] **Step 6: Commit only the implementation files**

```powershell
git add src/data/profile.js tests/profile-data.test.js
git commit -m "feat: strengthen GTEL backend experience"
```

- [ ] **Step 7: Merge the feature branch into main and verify the merged result**

Use a clean worktree based on the latest `origin/main`, merge the feature branch without including unrelated working-tree changes, rerun `npm test`, `npm run lint`, and `npm run build`, then push the merge commit to `main`.

