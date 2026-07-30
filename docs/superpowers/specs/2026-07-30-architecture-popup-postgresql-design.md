# Architecture Diagram Clarity and Connected Platform Preview

## Objective

Improve the public architecture presentation without exposing private implementation details:

- reduce overlapping Mermaid relationships across the C1, C2, and C3 views;
- describe PostgreSQL, rather than MongoDB, as the project database;
- let visitors open the homepage Connected platform diagram in the existing zoomable architecture modal.

The portfolio-wide Tech Stack section remains unchanged and may continue to list MongoDB as a general skill. MongoDB must not appear in the three fleet-project case studies or their architecture data.

## Diagram layout

### C1 - System Context

Keep the four existing actors and systems. Replace the two parallel relationships between the Fleet Operations Platform and Approved Operational Data Sources with one generalized bidirectional relationship. This preserves the public meaning (approved REST/gRPC requests, responses, and events) while avoiding two lines on the same path.

### C2 - Container View

Change the container layout from a single left-to-right row to a top-to-bottom layered diagram. Use subgraphs or explicit ordering for:

1. client applications;
2. the three backend services;
3. Kafka/event infrastructure;
4. service-owned data stores and search infrastructure.

Keep the current service highlight for each project. Each service connects to its own PostgreSQL store; Redis remains attached to the operational and administration services, Kafka remains the asynchronous boundary, and Elasticsearch remains the intelligence service's search projection. Remove the MongoDB document store and avoid adding replacement infrastructure that is not confirmed.

### C3 - Component Views

Use a top-to-bottom flow for API/input adapters, use cases or workers, outbound adapters, and infrastructure. Preserve the existing responsibilities and public relationships, but group related nodes so fan-out occurs downward rather than across a single horizontal row.

All relational storage labels in the project architecture become PostgreSQL. The Intelligence Hub repository relationship targets PostgreSQL and Elasticsearch; MongoDB is removed.

## Project content consistency

Within `src/data/projects.js` and related accessible architecture summaries:

- replace MongoDB labels with PostgreSQL;
- replace generic relational-database project tags with PostgreSQL where the tag describes the fleet project database;
- remove MongoDB from the Fleet Data Intelligence Hub tags and project-specific tech stack;
- preserve MongoDB in the homepage's general Tech Stack data, because the user explicitly limited this change to Architecture and the three projects.

The public descriptions remain qualitative and NDA-safe. No private table, collection, schema, source path, or operational metric is introduced.

## Connected platform popup

The homepage Connected platform card remains a compact overview. Its diagram is presented as a preview rather than an inline pan/zoom workspace.

`FleetPlatformOverview` receives an open callback from `ProjectsSection`. Visitors can open the C1 view by either:

- clicking the diagram preview; or
- clicking a visible `Open Architecture` control.

The preview uses button semantics and keyboard activation. It must not contain nested interactive zoom controls. The existing `DiagramModal` displays the C1 diagram and reuses `MermaidDiagram` for zoom, pan, and reset.

`ProjectsSection` continues to own a single modal state for both the Connected platform C1 preview and project-card C2 previews. Opening either source supplies the corresponding title, Mermaid code, and structured diagram summary.

Existing modal behavior remains required:

- close button;
- Escape-to-close;
- backdrop-to-close;
- focus containment while open;
- focus restoration after close;
- structured screen-reader description linked to the diagram.

## Component boundaries

- `FleetPlatformOverview`: renders platform copy and the accessible clickable C1 preview; it does not own modal state.
- `ProjectsSection`: maps a diagram into modal state and owns opening/closing behavior.
- `DiagramModal`: remains the reusable dialog shell for C1 and C2 diagrams.
- `MermaidDiagram`: supports interactive mode for modal/detail views and a non-interactive preview mode for the homepage.
- `fleetPlatform.js` and `projects.js`: remain the source of public C4 data and accessible summaries.

## Error handling

If Mermaid rendering fails, the existing explicit error state remains visible. The Connected platform open control must still have an accessible name, while the modal receives the same render error behavior. No silent fallback to private diagram source or raw Mermaid code is allowed.

## Testing strategy

Follow red-green-refactor:

1. Add a failing data test proving fleet project and C4 content contains PostgreSQL and no MongoDB.
2. Add a failing source-level test proving the Connected platform preview supplies the shared C1 diagram to the common modal and exposes an accessible open control.
3. Add a failing layout contract test proving the revised C1 avoids duplicate opposite-direction edges and the C2/C3 diagrams use the approved layered direction/grouping.
4. Implement the smallest data and component changes that make each test pass.
5. Run the complete test suite, ESLint, and production build/prerender.

Manual verification should confirm that the Connected platform preview opens the modal, zoom controls work inside the modal, Escape closes it, focus returns to the opener, and the architecture remains readable at desktop and mobile widths.

## Out of scope

- changing the general Tech Stack section;
- adding or removing project case studies;
- changing project routes or sitemap entries;
- publishing code-level C4 diagrams;
- adding unverified databases, infrastructure, or delivery metrics;
- redesigning project-detail modal behavior beyond shared compatibility.
