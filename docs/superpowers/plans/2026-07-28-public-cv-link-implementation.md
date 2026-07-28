# Public CV Link Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the existing CV at a stable website URL and add a conditional `View CV` Hero action that opens it in a new tab.

**Architecture:** Keep the PDF as a static Vite public asset named `NguyenThanhTam-CV.pdf`. Store the deployment-base-aware URL in `profile.resumeUrl`, using a root fallback so the same data module remains importable by plain Node tests. Render the new action conditionally in `HeroSection` and lock the asset, URL, privacy, and anchor behavior with focused tests.

**Tech Stack:** React 19, Vite 7, Tailwind CSS 3, Node test runner, static PDF asset

## Global Constraints

- Copy the approved existing PDF without altering, redacting, regenerating, or compressing it.
- Publish it only as `public/NguyenThanhTam-CV.pdf`.
- Never commit the source file's local absolute path or expose it in generated output.
- `profile.resumeUrl` must work at both `/NguyenThanhTam-CV.pdf` and `/portfolio/NguyenThanhTam-CV.pdf`.
- The Hero action label is exactly `View CV`, uses `button-secondary`, opens with `target="_blank"`, and includes `rel="noreferrer"`.
- Render the action only when `profile.resumeUrl` is truthy.
- Preserve the existing Hero copy, two existing actions, responsive wrapping, and spacing.
- Future CV updates must require replacing only `public/NguyenThanhTam-CV.pdf` when the filename is unchanged.

---

### Task 1: Add the Stable Public CV Action

**Files:**
- Create: `public/NguyenThanhTam-CV.pdf`
- Modify: `src/data/profile.js`
- Modify: `src/components/sections/HeroSection.jsx`
- Modify: `tests/profile-data.test.js`
- Modify: `tests/reference-form.test.js`

**Interfaces:**
- Produces: `profile.resumeUrl: string`, resolving to the active Vite deployment base plus `NguyenThanhTam-CV.pdf`
- Consumes: `profile.resumeUrl` in `HeroSection`
- Produces: a conditional `View CV` anchor that opens the static PDF in a new tab

- [ ] **Step 1: Update the profile and Hero tests first**

In `tests/profile-data.test.js`, add:

```js
const publicCv = new URL('../public/NguyenThanhTam-CV.pdf', import.meta.url);
```

Replace both existing `profile.resumeUrl` null assertions with:

```js
assert.equal(profile.resumeUrl, '/NguyenThanhTam-CV.pdf');
```

Add this test:

```js
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
  assert.match(hero, />View CV<\//);
  assert.match(hero, /target="_blank"/);
  assert.match(hero, /rel="noreferrer"/);
  assert.doesNotMatch(
    [hero, profileSource].join(' '),
    /[A-Za-z]:\\Users\\|\/Users\/|\/home\//,
  );
});
```

In `tests/reference-form.test.js`, replace:

```js
assert.doesNotMatch(hero, /resume|CV_/i);
```

with:

```js
assert.match(hero, />View CV<\//);
assert.match(hero, /profile\.resumeUrl &&/);
```

- [ ] **Step 2: Run the focused tests and confirm RED**

Run:

```powershell
node --test tests/profile-data.test.js tests/reference-form.test.js
```

Expected: FAIL because `profile.resumeUrl` is still null, the PDF asset does not exist, and `HeroSection` does not render `View CV`.

- [ ] **Step 3: Copy the approved PDF without modifying it**

Run:

```powershell
$cvSource = Join-Path $env:USERPROFILE 'Downloads\NguyenThanhTam-CV.pdf'
$cvDestination = 'public\NguyenThanhTam-CV.pdf'
Copy-Item -LiteralPath $cvSource -Destination $cvDestination
$header = Get-Content -LiteralPath $cvDestination -Encoding Byte -TotalCount 5
[pscustomobject]@{
  Header = [Text.Encoding]::ASCII.GetString($header)
  Length = (Get-Item -LiteralPath $cvDestination).Length
}
```

Expected:

```text
Header Length
------ ------
%PDF-  54844
```

- [ ] **Step 4: Make the profile URL deployment-base-aware**

Add before the exported profile in `src/data/profile.js`:

```js
const deploymentBase = import.meta.env?.BASE_URL ?? '/';
```

Replace:

```js
resumeUrl: null,
```

with:

```js
resumeUrl: `${deploymentBase}NguyenThanhTam-CV.pdf`,
```

The optional chain is required: Vite supplies `import.meta.env.BASE_URL`, while plain Node tests use the `/` fallback.

- [ ] **Step 5: Add the conditional Hero action**

Inside the existing Hero action container in `src/components/sections/HeroSection.jsx`, after `Contact Me`, add:

```jsx
{profile.resumeUrl && (
  <a
    className="button-secondary"
    href={profile.resumeUrl}
    target="_blank"
    rel="noreferrer"
  >
    View CV
  </a>
)}
```

Do not change either existing anchor or the parent `mt-9 flex flex-wrap justify-center gap-3` classes.

- [ ] **Step 6: Run the focused tests and confirm GREEN**

Run:

```powershell
node --test tests/profile-data.test.js tests/reference-form.test.js
```

Expected: all tests in both files pass with 0 failures.

- [ ] **Step 7: Run the complete automated verification**

Run:

```powershell
node --test
node node_modules/eslint/bin/eslint.js .
$env:VITE_BASE = '/portfolio/'
node node_modules/vite/bin/vite.js build
node scripts/prerender.js
Remove-Item Env:VITE_BASE
git diff --check
```

Expected:

- full Node suite exits 0 with only the two existing Windows symlink skips;
- ESLint exits 0;
- Vite production build exits 0 with the GitHub Pages base;
- prerender completes `/`, `/projects/fleet-operations-management-platform`, and `/projects/fleetops-data-hub`;
- `dist/index.html` contains `/portfolio/NguyenThanhTam-CV.pdf`;
- `git diff --check` exits 0.

- [ ] **Step 8: Perform browser and PDF QA**

Start Vite with the GitHub Pages base:

```powershell
$env:VITE_BASE = '/portfolio/'
node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 8096
```

Inspect `http://127.0.0.1:8096/portfolio/` at 1440×900 and 390×844.

Expected:

- `View CV` appears with the two existing Hero actions;
- all three actions wrap without document overflow at 390×844;
- the anchor resolves to `/portfolio/NguyenThanhTam-CV.pdf`;
- activating it opens a new tab;
- the new tab returns a readable PDF with at least one page;
- no new console warning or error appears.

- [ ] **Step 9: Commit the implementation**

Run:

```powershell
git add public/NguyenThanhTam-CV.pdf src/data/profile.js src/components/sections/HeroSection.jsx tests/profile-data.test.js tests/reference-form.test.js
git commit -m "feat: add public CV link"
```

Expected: one focused implementation commit containing the unchanged PDF asset, data URL, Hero action, and tests.

---

### Task 2: Review and Publish the CV Branch

**Files:**
- Review only: all files changed from `origin/main`
- No production file should change unless review identifies a concrete defect

**Interfaces:**
- Consumes: the verified Task 1 commit
- Produces: pushed branch `agent/add-cv-link` and a Draft Pull Request against `main`

- [ ] **Step 1: Verify complete branch scope**

Run:

```powershell
git diff --stat origin/main...HEAD
git diff --check origin/main...HEAD
git status -sb
```

Expected: only the design spec, implementation plan, PDF asset, profile data, Hero component, and two focused test files differ; tracked worktree is clean.

- [ ] **Step 2: Push the branch**

Run:

```powershell
git push -u origin agent/add-cv-link
```

Expected: `agent/add-cv-link` is created on `tamtnts/portfolio` without rewriting another branch.

- [ ] **Step 3: Open a Draft Pull Request**

Create a Draft PR from `agent/add-cv-link` to `main` with:

- title: `Add public CV link`;
- summary of the stable public filename and conditional Hero action;
- note that the PDF is intentionally public and unchanged;
- verification results from tests, lint, build, prerender, browser QA, and PDF opening;
- future update instruction: replace `public/NguyenThanhTam-CV.pdf` and redeploy.

Expected: an open Draft PR targeting `main`. Do not merge without a separate explicit user instruction.
