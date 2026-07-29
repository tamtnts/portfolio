# Three Connected Fleet Projects — Design Specification

**Date:** 2026-07-29  
**Status:** Approved  
**Portfolio owner:** Nguyen Thanh Tam

## Purpose

Replace the two existing featured case studies with three NDA-safe case studies that represent connected backend services within one fictionalized logistics fleet-operations platform.

The public presentation must preserve only evidence-backed service responsibilities and integration styles. It must not expose private repository names, source paths, customers, organizations, business identifiers, internal modules, endpoints, event topics, schemas, infrastructure addresses, credentials, or deployment topology.

## Approved Direction

Use a service-centric presentation. Each featured project is a standalone case-study page, while the homepage and every detail page make it clear that all three services belong to the same platform.

The three public projects are:

1. **Fleet Operations Core** — operational workflows, interactive lookup, statistics, and document generation.
2. **Fleet Administration & Dispatch** — planning, resources, devices, configuration, and operational coordination.
3. **Fleet Data Intelligence Hub** — multi-source synchronization, aggregation, search, and read-oriented data access.

No quantitative contribution or performance claims will be published.

## Platform Relationship

The homepage introduces the three case studies with a generalized C1 System Context diagram. It presents people, the Fleet Operations Platform as one software system, and approved external operational data sources. It does not expose internal services, databases, Kafka, or deployment topology.

The service relationship used by the C2 Container views is:

```mermaid
flowchart LR
  Admin[Fleet Administration & Dispatch]
  Core[Fleet Operations Core]
  Data[Fleet Data Intelligence Hub]
  Events[(Kafka)]

  Admin -->|Plans, resources, configuration| Core
  Core -->|Operational events| Events
  Admin -->|Reference and coordination events| Events
  Events -->|Synchronization| Data
  Core -->|Lookup and search requests| Data
  Data -->|Aggregated read responses| Core
  Admin -->|Lookup and aggregation requests| Data
  Data -->|Aggregated read responses| Admin
```

This container relationship is a public conceptual view, not the private production topology. It communicates only the approved relationships:

- Administration and Dispatch supplies planning, resource, and configuration context to operational workflows.
- Operations Core executes interactive workflows and publishes relevant operational events.
- Data Intelligence Hub consumes synchronization events and provides search-oriented or aggregated reads.
- Administration and Dispatch can also request aggregated data needed by supported coordination views.
- REST/gRPC represent synchronous service communication; Kafka represents asynchronous synchronization boundaries.

## Homepage Information Architecture

Add a **Fleet Operations Platform** introduction immediately before the featured-project cards. It contains:

- a short statement that the case studies represent services in one platform;
- the generalized C1 System Context diagram;
- an NDA note explaining that names and boundaries have been anonymized.

Render three featured cards in a three-column grid on large screens and a single-column layout on small screens. Card labels are:

- `Service 01 / Operational Core`
- `Service 02 / Administration`
- `Service 03 / Data Intelligence`

Each card retains the existing **Read Case Study** and **Preview Architecture** actions.

## Shared Case-Study Form

All three detail pages use the same established sections:

1. Overview
2. Requirements
3. Key Challenges
4. C4 Model
5. Main Flow
6. My Contributions
7. Tech Stack
8. Reliability & Security
9. Trade-offs / Design Decisions
10. Outcome / Impact
11. Lessons Learned

Each page identifies the project as a service within the Fleet Operations Platform. Its C4 section renders three diagrams vertically in this order:

1. **C1 — System Context:** the shared platform-level context.
2. **C2 — Container:** the shared container topology with the current service highlighted.
3. **C3 — Component:** the current service's generalized internal responsibilities.

The vertical layout keeps every level visible in prerendered output and avoids hidden tab state. The featured-card **Preview Architecture** action opens the project's C2 Container view.

No C4 Code diagram is published because source-level class, package, and module details are outside the public confidentiality boundary.

Add **Related Platform Services** at the bottom of each case study, linking to the other two project pages.

## Project Content Boundaries

### 1. Fleet Operations Core

**Public responsibility**

- Receive and validate operational requests through REST or gRPC interfaces.
- Orchestrate operational workflows, lookup, statistics, and document-generation use cases.
- Use planning and configuration context supplied by the administration service.
- Publish selected operational events and use the data service for aggregated lookup and search.

**Main-flow narrative**

1. An operations client submits a request.
2. The API boundary validates and maps it to a use case.
3. The use case applies workflow and state rules.
4. The service reads or writes relational data and uses cache state where appropriate.
5. It calls a related service for planning context or aggregated data when required.
6. It returns a normalized response, generates an approved document, or publishes an event.

**My Contributions wording**

Describe REST API development, business-rule handling, database queries, Redis usage, REST/gRPC integrations, Kafka integration, and document-generation work. Do not attach counts or claim ownership of the whole service.

### 2. Fleet Administration & Dispatch

**Public responsibility**

- Manage planning, resources, devices, configuration, and operational reference data.
- Validate lifecycle and assignment state for supported administration workflows.
- Provide administration context to Operations Core through REST/gRPC boundaries.
- Publish selected changes for asynchronous synchronization.

**Main-flow narrative**

1. An administrator submits a planning, resource, device, or configuration request.
2. The API boundary validates the request and authorization context.
3. The use case applies state, assignment, and consistency rules.
4. The service persists the approved change and updates explicit cache state where relevant.
5. It exposes updated context synchronously or publishes a change event.
6. Operations Core and Data Intelligence Hub consume the appropriate result through their respective boundaries.

**My Contributions wording**

Describe administration APIs, validation, relational queries, Redis cache or coordination patterns, event integration, service-to-service communication, and supported reports. Do not publish counts or unverified ownership claims.

### 3. Fleet Data Intelligence Hub

**Public responsibility**

- Receive data from asynchronous events and approved service integrations.
- Normalize and synchronize records from multiple sources.
- Build read-oriented data for aggregation and operational search.
- Provide REST/gRPC lookup responses to other platform services.
- Track integration and resynchronization state at a generalized level.

**Main-flow narrative**

1. Kafka consumers or integration adapters receive source changes.
2. Synchronization workers validate, map, and normalize the records.
3. The service persists operational read data and updates search projections.
4. REST/gRPC interfaces accept lookup or aggregation requests.
5. Query services select relational, document-oriented, or search-backed access according to the request.
6. A normalized result is returned to Operations Core or Administration and Dispatch.

**My Contributions wording**

Describe synchronization workers, lookup APIs, query handling, Elasticsearch integration, data processing, Kafka consumers, and REST/gRPC integration. Do not publish source-specific entity names or volume claims.

## Approved Public Technology Mapping

| Project | Public technologies |
| --- | --- |
| Fleet Operations Core | Java 17, Spring Boot, REST, gRPC, Kafka, Redis, Elasticsearch, relational database, OpenFeign, PDF/document generation, Docker |
| Fleet Administration & Dispatch | Java 17, Spring Boot, REST, gRPC, Kafka, Redis, Elasticsearch, relational database, ShedLock, Docker |
| Fleet Data Intelligence Hub | Java 17, Spring Boot, REST, gRPC, Kafka, Elasticsearch, MongoDB, relational database, OpenFeign, Docker |

Technology lists describe evidenced integration boundaries. They must not imply sole ownership, universal use across every flow, or a specific production deployment.

## Approved C4 Model

### C1 — Shared System Context

**People**

- Fleet Operations Staff uses the Fleet Operations Platform for supported workflow, lookup, reporting, and document-generation needs.
- Administrator / Dispatcher uses the Fleet Operations Platform for supported planning, resource, device, configuration, and coordination needs.

**Software systems**

- Fleet Operations Platform is the single system in scope.
- Approved Operational Data Sources is the generalized external-system boundary.

**Relationships**

- Fleet Operations Staff uses the Fleet Operations Platform.
- Administrator / Dispatcher administers and coordinates work through the Fleet Operations Platform.
- Fleet Operations Platform exchanges approved data with external sources through generalized REST/gRPC or event boundaries.

### C2 — Container Views

Every project page uses the same platform container topology and highlights its current service.

**Clients and service containers**

- Operations Client calls Fleet Operations Core through REST/gRPC.
- Administration Client calls Fleet Administration & Dispatch through REST/gRPC.
- Fleet Administration & Dispatch supplies plans, resources, and configuration context to Fleet Operations Core through REST/gRPC.
- Fleet Operations Core requests aggregated lookup and search data from Fleet Data Intelligence Hub through REST/gRPC.
- Fleet Administration & Dispatch can request supported aggregated lookup data from Fleet Data Intelligence Hub through REST/gRPC.
- Fleet Operations Core and Fleet Administration & Dispatch publish selected events to Kafka.
- Fleet Data Intelligence Hub consumes selected synchronization events from Kafka.

**Generalized data containers**

- Fleet Operations Core uses a relational store and explicit Redis state.
- Fleet Administration & Dispatch uses a relational store and Redis-backed cache or coordination state.
- Fleet Data Intelligence Hub uses read-oriented relational data, MongoDB where relevant, and Elasticsearch search projections.

The C2 diagrams do not contain hosts, clusters, topics, database schemas, service addresses, or production deployment details.

### C3 — Fleet Operations Core Components

- REST/gRPC API accepts and maps supported requests.
- Workflow & Query Use Cases orchestrates workflow, lookup, statistics, and document-generation responsibilities.
- Persistence Adapter accesses the generalized relational store.
- Cache Adapter accesses explicit Redis state.
- Service Integration Adapters call Administration & Dispatch and Data Intelligence Hub through REST/gRPC.
- Event Adapter exchanges selected asynchronous events through Kafka.
- Document Renderer produces approved document outputs.

### C3 — Fleet Administration & Dispatch Components

- REST/gRPC API accepts supported administration requests.
- Planning & Coordination Use Cases handles supported plan and assignment workflows.
- Resource & Device Use Cases handles supported resource and device responsibilities.
- Configuration & Reference Use Cases handles supported configuration and reference-data responsibilities.
- Persistence Adapter accesses the generalized relational store.
- Cache & Coordination Adapter uses Redis and ShedLock where relevant.
- Service Integration Adapters call Operations Core and Data Intelligence Hub through REST/gRPC.
- Event Adapter exchanges selected asynchronous events through Kafka.
- Report & Export Renderer produces approved administration outputs.

### C3 — Fleet Data Intelligence Hub Components

- Kafka Consumers receive selected synchronization events.
- Integration Adapters receive approved data through service integrations.
- Synchronization Workers coordinate synchronization and resynchronization flows.
- Normalization & Mapping converts approved source contracts into read-oriented records.
- Data Repositories access generalized relational and MongoDB data.
- Search Adapter maintains and queries Elasticsearch projections.
- Integration State Tracking records generalized integration and resynchronization state.
- REST/gRPC Lookup API accepts supported lookup and aggregation requests.
- Query & Aggregation Services select data-repository or search access according to the read need.

## Reliability and Design-Decision Themes

Use only qualitative, defensible themes:

- clear separation between API, use-case, persistence, integration, event, cache, and search boundaries;
- explicit validation of workflow state and ownership before supported writes;
- asynchronous synchronization with acknowledged eventual consistency;
- Redis used for explicit cache or coordination responsibilities, not presented as the relational source of truth;
- search indexes treated as read-oriented projections rather than undisclosed sources of truth;
- bounded retry, locking, or fallback descriptions only where relevant;
- sensitive data and production details omitted from public artifacts.

Outcomes remain qualitative: clearer service responsibilities, consistent access to operational data, and reduced direct coupling through explicit synchronous and asynchronous boundaries.

## Confidentiality Guardrails

Public source and generated artifacts must not contain:

- private repository names or filesystem paths;
- customer, organization, or product identifiers;
- private class, package, module, method, endpoint, topic, table, index, or collection names;
- credentials, environment values, network addresses, or deployment topology;
- domain-specific records that can identify the original system;
- API counts, data volumes, user counts, latency, throughput, availability, or other unverified metrics;
- claims that the portfolio owner designed or owned an entire service unless separately confirmed.

All names, diagrams, and descriptions are fictionalized and generalized while preserving the verified service roles and integration patterns.

## Acceptance Criteria

- The homepage presents exactly three featured case studies.
- The shared platform relationship is visible before the three cards.
- Each project has a unique route, architecture preview, and full case-study page.
- The homepage and every detail page show the shared C1 System Context view.
- Every project page shows a C2 Container view with the current service highlighted.
- Every project page shows its own evidence-backed C3 Component view.
- C1, C2, and C3 render vertically and remain present in prerendered output.
- Each architecture preview opens the corresponding project's C2 view.
- Every detail page links to the other platform services.
- Existing responsive, accessible, SEO, prerender, sitemap, and GitHub Pages behavior remains valid.
- Automated tests expect three approved routes and reject legacy or private identifiers.
- Production build, lint, tests, and confidentiality checks pass.

## Explicit Non-Goals

- Reproducing the private system's exact architecture or business domain.
- Publishing a C4 Code view or source-level class/package structure.
- Publishing source-derived names, metrics, schemas, or infrastructure details.
- Adding claims about team size, duration, performance, availability, or business impact without user confirmation.
- Changing unrelated profile, experience, education, certificate, contact, or CV content.
