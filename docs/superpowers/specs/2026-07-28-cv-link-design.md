# Public CV Link Design

## Goal

Add a `View CV` action to the portfolio Hero section that opens Nguyen Thanh Tam's existing CV in a new browser tab. Keep the public filename stable so future CV updates require replacing one PDF file rather than changing application code.

## Approved Source and Public Asset

Use the existing user-provided `NguyenThanhTam-CV.pdf` from outside the repository. The source exists, is readable, is 54,844 bytes, and starts with the `%PDF-` signature.

Copy it without modifying its contents to:

`public/NguyenThanhTam-CV.pdf`

The local source path must never appear in public source code, generated HTML, tests, or metadata.

## URL Strategy

Set `profile.resumeUrl` to a deployment-base-aware URL:

```js
`${import.meta.env.BASE_URL}NguyenThanhTam-CV.pdf`
```

This keeps the link valid at both:

- local root deployments such as `/NguyenThanhTam-CV.pdf`;
- GitHub Pages deployments such as `/portfolio/NguyenThanhTam-CV.pdf`.

The public filename remains constant across future updates.

## Hero Interaction

Add a third action beside `View Case Studies` and `Contact Me`:

- label: `View CV`;
- style: existing `button-secondary`;
- `href`: `profile.resumeUrl`;
- open behavior: `target="_blank"`;
- relationship protection: `rel="noreferrer"`.

Render the action only when `profile.resumeUrl` is truthy. The existing two actions, Hero layout, wrapping behavior, and responsive spacing remain unchanged.

## Accessibility and Privacy

`View CV` remains a normal anchor, so it is keyboard accessible and exposes its label to assistive technology.

The PDF becomes publicly accessible to anyone with the website URL. This is intentional and approved. The implementation will not alter, redact, or regenerate the existing PDF.

## Future Update Workflow

To publish a newer CV later:

1. Replace `public/NguyenThanhTam-CV.pdf` with the new PDF.
2. Keep the same filename.
3. Commit and deploy the replacement.

No React or profile-data change is required when the filename remains unchanged.

## Testing and Verification

Update automated contracts to verify:

- `profile.resumeUrl` is deployment-base-aware and ends with `NguyenThanhTam-CV.pdf`;
- the Hero conditionally renders `View CV`;
- the anchor opens a new tab and includes `rel="noreferrer"`;
- the old contract forbidding Resume/CV content is removed;
- `public/NguyenThanhTam-CV.pdf` exists, is non-empty, and starts with `%PDF-`;
- no public source contains the source file's local absolute path.

Run the full Node test suite, ESLint, production build, three-route prerender, and diff-check.

Browser QA must confirm:

- `View CV` appears beside the existing Hero actions on desktop and wraps cleanly on mobile;
- its resolved URL includes the active deployment base;
- opening it returns the PDF successfully in a new tab;
- no new browser console warning or error appears.

## Publishing

Implement on `agent/add-cv-link`, push to `tamtnts/portfolio`, and open a Draft Pull Request against `main`. Merge and deploy only after explicit user approval.

## Out of Scope

- Editing or redesigning the PDF.
- Replacing any CV content.
- Adding an embedded PDF viewer.
- Adding version selection or multiple CV languages.
- Changing Hero copy or other portfolio sections.
