# Remove Project Overview Role — Design

## Goal

Remove the `Role: Middle Backend Developer` row from the Overview section of all three project detail pages.

## Scope

- Delete `overview.role` from each project in `src/data/projects.js`.
- Remove the conditional `Role` row from the Overview markup in `src/pages/ProjectDetail.jsx`.
- Keep `profile.role`, company experience roles, and all other project content unchanged.

## Approach

Use a direct, minimal change rather than introducing a dynamic field renderer. The project data will no longer expose a role field, and the page component will no longer contain unused role-specific rendering logic.

## Testing

- Update data contract tests to require `project.overview.role` to be absent for every project.
- Add or update a source-level UI contract to require the Overview markup not to render the `Role:` label or reference `project.overview.role`.
- Run the focused tests, full test suite, lint, and production build.

## Acceptance Criteria

1. None of the three project objects contains `overview.role`.
2. Project Overview sections do not display `Role: Middle Backend Developer`.
3. The public profile and Experience role information remain unchanged.
4. Existing project pages continue to build and pass all tests.
