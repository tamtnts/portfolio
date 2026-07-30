# Architecture Component Guide Design

## Objective

Create one Vietnamese reference document that explains the responsibility and
purpose of every component currently shown in the public C1, C2, and C3
architecture diagrams for the three connected fleet-platform case studies.

Technical component names remain in English so the guide matches the diagrams
and portfolio source. Explanations are written in Vietnamese at a practical,
intermediate level.

## Output

Create:

`docs/architecture/fleet-platform-component-guide.md`

The document is a portfolio companion and internal editing reference. It is not
rendered as a new page in the public website in this change.

## Sources of truth

The guide must derive its component names and relationships from:

- `src/data/fleetPlatform.js` for the shared C1 System Context;
- `src/data/projects.js` for each project's C2 Container View and C3 Component
  View;
- the approved public case-study descriptions in `src/data/projects.js` when
  clarifying responsibilities and generalized flows.

The guide must not introduce a component, database, integration, workflow, or
operational claim that is absent from those sources.

## Document structure

1. Purpose and reading instructions
2. C4 notation used by the portfolio
3. Shared C1 — Fleet Operations Platform
4. Project 1 — Fleet Operations Core
   - C2 Container View
   - C3 Component View
   - Generalized end-to-end flow
5. Project 2 — Fleet Administration & Dispatch
   - C2 Container View
   - C3 Component View
   - Generalized end-to-end flow
6. Project 3 — Fleet Data Intelligence Hub
   - C2 Container View
   - C3 Component View
   - Generalized end-to-end flow
7. Shared technology glossary
8. Confidentiality and modeling scope

## Component explanation format

Each component entry uses the following fields:

- **Nhiệm vụ:** the responsibility owned by the component;
- **Tác dụng:** why the component exists in the architecture;
- **Đầu vào:** generalized requests, events, commands, or data received;
- **Đầu ra:** generalized responses, events, stored data, or calls produced;
- **Quan hệ chính:** the components it communicates with and the interaction
  style when the diagram confirms it.

When an input or output is not explicitly present in the public model, the
guide says that it is not specified rather than inferring a private contract.

## C1 coverage

Explain the four shared elements:

- Fleet Operations Staff;
- Administrator / Dispatcher;
- Fleet Operations Platform;
- Approved Operational Data Sources.

Also explain the three generalized relationships already present in the C1
model. C1 remains system-level and does not expose the three internal services.

## C2 coverage

For every project, explain the complete shared container topology:

- Operations Client;
- Administration Client;
- Fleet Operations Core;
- Fleet Administration & Dispatch;
- Fleet Data Intelligence Hub;
- Kafka;
- Operations PostgreSQL;
- Operational Redis cache;
- Administration PostgreSQL;
- Administration Redis cache;
- Intelligence PostgreSQL;
- Elasticsearch.

The wording highlights the current project service while still describing the
other connected containers. Repetition is intentional so each project section
can be read independently.

## C3 coverage

### Fleet Operations Core

Explain:

- REST/gRPC API;
- Workflow and Query Use Cases;
- Persistence Adapter;
- Cache Adapter;
- Service Integration Adapters;
- Event Adapter;
- Document Renderer;
- PostgreSQL;
- Redis;
- Related Platform Services;
- Kafka.

### Fleet Administration & Dispatch

Explain:

- REST/gRPC API;
- Planning and Coordination Use Cases;
- Resource and Device Use Cases;
- Configuration and Reference Use Cases;
- Persistence Adapter;
- Cache and Coordination Adapter;
- Service Integration Adapters;
- Event Adapter;
- Report and Export Renderer;
- PostgreSQL;
- Redis / ShedLock;
- Related Platform Services;
- Kafka.

### Fleet Data Intelligence Hub

Explain:

- Kafka;
- Kafka Consumers;
- Approved Source Systems;
- Integration Adapters;
- Synchronization Workers;
- Normalization and Mapping;
- Data Repositories;
- Search Adapter;
- Integration State Tracking;
- REST/gRPC Lookup API;
- Query and Aggregation Services;
- PostgreSQL;
- Elasticsearch.

## Generalized flows

Each project section ends with a numbered flow derived from the existing
`mainFlow` content. The flow connects the component descriptions without
inventing endpoint names, schemas, topics, tables, timing guarantees, or
production topology.

## Technology glossary

Provide concise definitions for REST, gRPC, Kafka, Redis, PostgreSQL,
Elasticsearch, ShedLock, OpenFeign, and document/report rendering. Definitions
focus on their role in these diagrams rather than general tutorial content.

## Confidentiality rules

- Keep all names, boundaries, and flows generalized and NDA-safe.
- Do not include source repository paths outside this public portfolio.
- Do not include private identifiers, endpoint names, Kafka topics, database
  schemas, table names, deployment names, infrastructure addresses, or metrics.
- Preserve PostgreSQL as the project database.
- MongoDB may remain a general skill elsewhere in the portfolio, but it must
  not appear in this project architecture guide.

## Validation

Before completion:

- confirm every C1/C2/C3 element in the source appears in the guide;
- confirm no extra architecture component appears in the guide;
- scan the guide for MongoDB and private-source fingerprints;
- verify heading structure and Markdown formatting;
- run the existing test suite to ensure the documentation change does not
  disturb the portfolio build.
