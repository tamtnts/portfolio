# Remove Project Overview Role Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the project role field from all three case studies and stop rendering the Role row in every project Overview.

**Architecture:** Keep the existing static project-data model and explicit Overview markup. Remove the obsolete field at its source and remove its dedicated conditional renderer, with data and source-contract tests preventing regression.

**Tech Stack:** React, JavaScript, Node.js test runner, ESLint, Vite

## Global Constraints

- Delete `overview.role` from all three project objects.
- Remove only the project Overview Role row; keep `profile.role` and Experience roles unchanged.
- Do not refactor the Overview into a dynamic renderer.
- Preserve all other project data and page layout.

---

### Task 1: Remove the role field and Overview row

**Files:**
- Modify: `tests/connected-projects.test.js`
- Modify: `tests/profile-data.test.js`
- Modify: `tests/reference-form.test.js`
- Modify: `src/data/projects.js`
- Modify: `src/pages/ProjectDetail.jsx`

**Interfaces:**
- Consumes: `projects`, an array whose items expose an `overview` object.
- Produces: project Overview data without a `role` property and UI markup without a Role row.

- [ ] **Step 1: Write failing data and UI contract tests**

In both project loops, replace the role equality assertion with:

```js
assert.equal(project.overview.role, undefined);
```

In the existing large-project-page source test in `tests/reference-form.test.js`, add:

```js
assert.doesNotMatch(detail, /project\.overview\.role|Role:/);
```

- [ ] **Step 2: Run focused tests and verify RED**

Run:

```powershell
node --test tests/connected-projects.test.js tests/profile-data.test.js tests/reference-form.test.js
```

Expected: FAIL because all three project objects still contain `overview.role` and `ProjectDetail.jsx` still renders `Role:`.

- [ ] **Step 3: Remove role data and rendering**

Delete this property from each of the three `overview` objects in `src/data/projects.js`:

```js
role: 'Middle Backend Developer',
```

Delete this row from `src/pages/ProjectDetail.jsx`:

```jsx
{project.overview.role && <div><span className='font-mono text-xs'>Role:</span> {project.overview.role}</div>}
```

- [ ] **Step 4: Run focused tests and verify GREEN**

Run:

```powershell
node --test tests/connected-projects.test.js tests/profile-data.test.js tests/reference-form.test.js
```

Expected: PASS with zero failures.

- [ ] **Step 5: Run complete verification**

Run:

```powershell
npm test
npm run lint
npm run build
git diff --check
```

Expected: all commands exit with code 0. The two Windows symlink tests may remain skipped.

- [ ] **Step 6: Commit the implementation**

```powershell
git add src/data/projects.js src/pages/ProjectDetail.jsx tests/connected-projects.test.js tests/profile-data.test.js tests/reference-form.test.js
git commit -m "ui: remove project overview role"
```
