# Native Emoji Tech Stack Design

## Goal

Replace the current brand-logo icons in the portfolio Tech Stack section with the small native emoji-style symbols selected from the visual comparison. Preserve the approved two-card layout, pill geometry, labels, responsiveness, and public profile data.

## Approved Direction

Use native Unicode emoji rendered by the visitor's operating system. This is the lightest implementation and most closely matches the illustrative icon style selected by the user.

Native emoji may vary slightly between Windows, Android, macOS, and browser platforms. This variation is accepted as part of the selected approach.

## Icon Mapping

| Tool | Emoji |
|---|---|
| Java (Spring Boot) | ☕ |
| Netty / TCP | 🪄 |
| Kafka | 💻 |
| EMQX / MQTT | 🏃 |
| Redis | ⚡ |
| Oracle DB | 🚪 |
| PostgreSQL | 🐘 |
| MongoDB | 🐊 |
| Elasticsearch | 🔎 |
| Kubernetes | ⚛️ |
| Rancher | 🐮 |
| Nginx | 🚦 |
| Grafana | 📊 |
| GitLab CI | 🔥 |
| Linux | 🐧 |
| MinIO / S3 | 📦 |

## Component Design

`StackSection.jsx` will replace the React icon-component registry with a simple tool-to-emoji registry. `ToolPill` will render the mapped emoji in a fixed-width inline span before the visible tool label.

The emoji span will:

- be approximately 14 pixels;
- use the platform emoji font stack;
- be hidden from assistive technology with `aria-hidden="true"`;
- remain non-interactive and decorative.

The existing section headings, card markup, list semantics, pill labels, grid behavior, spacing, borders, and responsive breakpoints remain unchanged.

## Dependency Cleanup

`react-icons` is currently used only by `StackSection.jsx`. After the component migrates to native emoji, remove `react-icons` from `package.json` and `package-lock.json`.

No replacement icon dependency or image asset will be added.

## Accessibility

Every tool keeps its visible text label, so the emoji does not carry meaning required by screen-reader users. The emoji is decorative and must not create duplicated spoken labels.

The existing semantic `ul` and `li` structure remains intact.

## Testing

Update the Tech Stack regression test to verify:

- all 16 approved tool-to-emoji mappings;
- emoji spans are decorative;
- no brand SVG icon component or `react-icons` import remains;
- the `react-icons` dependency is removed;
- both approved card groups and responsive layout classes remain present.

Run the complete Node test suite, ESLint, production build, and three-route prerender.

Perform browser QA at 1440×900 and 390×844 to confirm:

- 16 emoji and 16 visible labels render;
- both cards retain the approved desktop and mobile layout;
- no pill or document overflow occurs;
- the browser console has no warning or error introduced by the change.

## Publishing

Commit the implementation to `agent/native-emoji-tech-stack`, push it to `tamtnts/portfolio`, open a Draft Pull Request against `main`, and merge only after validation and explicit user approval.

## Out of Scope

- Changing tool names or group membership.
- Reworking the card or pill layout.
- Adding custom SVG, raster image, Twemoji, or another icon library.
- Changing other portfolio sections or project content.
