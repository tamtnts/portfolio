# Tech Stack Brand Pills Design

Date: 2026-07-28

## Goal

Restyle the homepage Tech Stack section to match the supplied dark two-card reference while keeping the rest of the portfolio unchanged.

## Approved Content

### Core Stack

- Java (Spring Boot)
- Netty / TCP
- Kafka
- EMQX / MQTT
- Redis
- Oracle DB
- PostgreSQL
- MongoDB
- Elasticsearch

### Infrastructure

- Kubernetes
- Rancher
- Nginx
- Grafana
- GitLab CI
- Linux
- MinIO / S3

## Layout

- Keep the existing `tech-stack` anchor and homepage position.
- Use the small eyebrow `Tech Stack` and the headline `Tools I ship with`.
- Render two equal-width cards on medium and larger screens.
- Stack the cards vertically on small screens.
- Use compact uppercase monospace labels: `CORE STACK` and `INFRASTRUCTURE`.
- Remove the current card descriptions and the asymmetric accent treatment.
- Render tools as wrapping rounded pills with a subtle border, dark translucent fill, compact spacing, and one brand-style SVG icon.

## Data and Components

- Replace the old backend/data/delivery/supporting stack shape with `profile.stack.core` and `profile.stack.infrastructure`.
- Update the homepage structured-data `knowsAbout` list to use both approved groups.
- Keep the icon registry inside `StackSection` so profile data remains plain serializable strings.
- Add `react-icons` as the SVG icon source and import only the required icons.
- Use the closest available brand icon when a product-specific icon exists; use a restrained protocol or infrastructure fallback only when the package has no exact brand.

## Accessibility

- Icons are decorative and use `aria-hidden="true"`.
- Every tool remains available as visible text.
- Pills are non-interactive list items and do not imply buttons or links.
- Text and borders use the existing portfolio color tokens to preserve contrast.

## Responsive Behavior

- Pills wrap without horizontal scrolling or truncation.
- Card padding and gaps tighten on small screens.
- Both cards preserve equal visual weight on desktop without forcing equal pill counts.

## Testing and Verification

- Add a failing regression test for the new headline, group labels, exact approved tool lists, icon dependency, and removal of old descriptions.
- Run the focused test through red and green states.
- Run the full Node test suite, ESLint, production build, and prerender.
- Inspect the section in the browser at desktop and mobile widths for wrapping, overflow, icon alignment, and visual similarity to the reference.

## Non-goals

- Do not change the project cards, experience, contact, navigation, or project-detail pages.
- Do not add links or skill proficiency levels.
- Do not publish or deploy this change until separately approved.
