# Nguyen Thanh Tam Portfolio - Reference Form and NDA-Safe Case Studies

Date: 2026-07-27
Status: Approved direction; awaiting final written-spec review

## 1. Goal

Update the Nguyen Thanh Tam portfolio so that it preserves the visual form, information density, navigation, project cards, architecture preview, and large-project case-study structure of the approved reference portfolio while publishing only Nguyen Thanh Tam's identity and work.

The portfolio remains an English-language, recruiter-first website for Middle Backend Developer opportunities. It must demonstrate backend depth through concrete but NDA-safe project narratives without copying private source code, internal identifiers, customer information, production data, or proprietary diagrams.

This change updates the portfolio website only. It does not modify or regenerate Nguyen Thanh Tam's CV PDF.

## 2. Approved Direction

The selected approach is a **domain-transformed technical case study**:

- Preserve technical patterns that can be supported by the private reference implementation.
- Rewrite the business domain as a fictionalized logistics and fleet-operations context.
- Preserve only contribution counts explicitly supplied by Nguyen Thanh Tam.
- Rebuild all diagrams from neutral components and generic data flows.
- Omit facts that are unknown, sensitive, personally unattributed, or not approved for publication.

Rejected approaches:

1. A fully generic enterprise platform was rejected because it would weaken the relevance to Java backend and logistics work.
2. A rename-only transformation was rejected because exact routes, schemas, workflows, topology, templates, and terminology could re-identify the private system.

## 3. Visual and Interaction Fidelity

The public site will return to the approved reference form rather than the current full-width console redesign.

### 3.1 Global visual system

- Charcoal background close to `#0b0f14`.
- White and soft-gray text with sky, purple, and green accents.
- Subtle page-level glow and grid treatment.
- Thin borders, translucent dark cards, restrained shadows, and medium rounded corners.
- Sans-serif body copy and monospace metadata labels.
- Compact section headings and tighter vertical rhythm than the current Tam branch.
- Motion remains short and respects `prefers-reduced-motion`.

### 3.2 Navigation and page geometry

- Compact sticky navbar with a backend-oriented Nguyen Thanh Tam wordmark.
- Centered hero rather than a split-screen hero.
- One main desktop container with a sticky left table of contents and a single content column.
- Smooth scrolling and scrollspy behavior for homepage sections.
- Responsive collapse to a single column on smaller screens.
- No outdated CV download link. A resume CTA is added only after an updated PDF is explicitly approved.

### 3.3 Homepage section order

1. Hero
2. Highlights
3. Tech Stack
4. Featured Projects
   - two large project cards
   - compact Selected Projects cards beneath them
5. Experience
   - employment timeline
   - education, certifications, and English level in the same compact visual language
6. Contact

This preserves the original form while retaining all approved Nguyen Thanh Tam content.

## 4. Homepage Content

### 4.1 Hero

- Name: Nguyen Thanh Tam
- Role: Middle Backend Developer
- Status: Open to Work & Freelance Projects
- Location: Ho Chi Minh City
- Work modes: Onsite, Hybrid, Remote
- Primary CTA: View Case Studies
- Secondary CTA: Contact Me
- Supporting line focuses on Java, Spring Boot, data services, and service integrations rather than a seniority or leadership claim.

### 4.2 Highlights

Use the original two-column, border-left list form for these capabilities:

1. REST APIs & service design
2. Database design & query optimization
3. Event-driven processing and synchronization workers
4. gRPC/REST service integration
5. Caching, operational search, and document-generation workflows

### 4.3 Tech Stack

Use two original-style cards:

- Core Stack: Java 17, Spring Boot, REST, gRPC, PostgreSQL, Redis, Kafka, Elasticsearch
- Delivery & Supporting: Docker, MySQL, SQL Server, C#/.NET, ASP.NET, React, HTML, CSS, Firebase, Figma

Core Java backend skills receive stronger visual emphasis.

### 4.4 Selected Projects

The three previously approved projects remain compact snapshots, not large case studies:

1. Academic Blog at FPTU
2. FPT Software Academy Training Management System
3. Contract Management System

They use Nguyen Thanh Tam's links only when those links are verified and safe. No legacy-owner route, link, or content is restored.

### 4.5 Experience and education

Timeline entries:

- GTEL OTS - Middle Backend Developer - Aug 2024 to Present
- FPT Software - Internship - period omitted by request
- FPT University, Ho Chi Minh City - Software Engineering - 2019 to 2023 - Good classification

Certifications:

1. Web Design for Everybody: Basics of Web Development & Coding
2. Software Development Lifecycle
3. CertNexus Certified Ethical Emerging Technologist
4. Google Project Management

English: Intermediate - able to communicate and read technical documentation.

## 5. Featured Project One

### 5.1 Public identity

- Title: **Fleet Operations Management Platform**
- Slug: `fleet-operations-management-platform`
- Domain: NDA-safe logistics fleet operations
- Subtitle: a Spring backend that unifies multi-source vehicle and journey lookup, operational workflows, analytics, and document generation.
- Disclaimer: names, business rules, data, topology, and customer details are fictionalized or generalized for confidentiality.

Duration and team size remain absent until Nguyen Thanh Tam supplies and approves them.

### 5.2 Requirements

- Provide consistent vehicle and journey lookup across multiple internal and partner data sources.
- Support both immediate responses and asynchronous lookup completion for slower integrations.
- Preserve lookup history and normalized results for later review and export.
- Provide operational statistics and search over journey/event records.
- Generate standardized DOCX, PDF, and spreadsheet outputs from approved templates.
- Publish and consume workflow events without coupling interactive API paths to background processing.

These are public, domain-shifted capabilities. They must not reproduce private route names, request fields, form names, or regulatory rules.

### 5.3 Key challenges

- Normalizing heterogeneous integration responses into stable domain models.
- Supporting synchronous and asynchronous lookups while preserving a consistent history model.
- Keeping complex operational filters and aggregation queries maintainable.
- Separating interactive lookup traffic from statistics, indexing, and document-generation workloads.
- Coordinating cached state and event-driven updates without exposing stale or duplicated results.
- Producing repeatable documents while hiding private templates and workflow terminology.

### 5.4 Architecture diagram

Create a new generic diagram. Do not trace or reuse the private system topology.

```text
Operations Web/Mobile Clients
        |
    API Gateway
        |
Fleet Operations Backend
  |       |          |             |
Lookup  Journey   Statistics   Document Export
  |       |          |             |
  +-------+----------+-------------+
          |
Integration Adapters -- REST/gRPC --> Internal/Partner Systems
          |
       Kafka Events --> Synchronization Workers / Notifications
          |
PostgreSQL ----- Redis ----- Elasticsearch ----- Object Storage
```

The public diagram may show component categories and directions only. It must not show real service names, topic names, schema names, hostnames, network zones, ports, deployment counts, or partner identities.

### 5.5 Main flow

1. A client submits a lookup or operational query.
2. The API validates the request and records the lookup context.
3. The application orchestrates one or more REST/gRPC integration adapters.
4. Fast sources return synchronously; slower sources can complete through an event callback.
5. Responses are normalized and aggregated into a stable domain result.
6. History and result state are persisted; cache and search projections are updated where applicable.
7. The client reads the completed result or requests a generated document.

### 5.6 My contributions

Only the following user-approved claims are published:

- Built approximately 40 lookup APIs for vehicle, journey, and operational records.
- Built approximately 20 statistics APIs for operational reporting and aggregation.
- Built approximately 15 document and record-export APIs.
- Integrated internal services through gRPC and REST.
- Contributed to Kafka-based event processing and data-synchronization workers.
- Applied Redis for caching and short-lived coordination state where appropriate.

Do not infer ownership of the entire private platform from repository size or static route counts.

### 5.7 Technology stack

- Java 17
- Spring Boot
- PostgreSQL
- Redis
- Kafka
- gRPC
- REST/OpenFeign-style integrations
- Elasticsearch
- Docker
- Template-based DOCX/PDF/spreadsheet generation

### 5.8 Scaling and delivery metrics

The project card and case-study metric block use only approved delivery counts:

- `~40` lookup APIs
- `~20` statistics APIs
- `~15` export APIs

No production traffic, latency, availability, data-volume, concurrency, customer, user, or infrastructure-scale claim is published.

### 5.9 Reliability and security

Public wording stays at a defensible pattern level:

- Validate input and integration responses before mapping them into domain records.
- Preserve request/result history for traceability.
- Isolate background processing from interactive request paths.
- Use bounded cache/coordination state instead of treating Redis as the system of record.
- Handle integration failures through explicit fallback or pending-result states.
- Keep customer data, credentials, topology, and operational identifiers out of the public case study.

The portfolio must not claim a compliance certification, security ownership, SLA, or production incident reduction.

### 5.10 Trade-offs and design decisions

- Synchronous integration provides immediate feedback but can couple latency to downstream systems; asynchronous completion improves resilience at the cost of a more complex result lifecycle.
- Redis reduces repeated work but requires explicit freshness and ownership rules.
- Elasticsearch improves operational search and aggregations but introduces eventual consistency with the relational source of truth.
- Template-driven export standardizes documents but increases maintenance across template versions and output formats.

### 5.11 Outcome and lessons

Outcome is qualitative:

- Established a consistent backend layer for lookup, reporting, and export workflows.
- Improved maintainability of operational queries through targeted optimization.
- Separated integration, search, statistics, and document concerns into clearer processing paths.

Lessons:

- Normalize third-party responses at the integration boundary.
- Treat asynchronous lookup completion as an explicit state machine.
- Measure query plans before optimizing.
- Keep generated-document workflows isolated from interactive APIs.

## 6. Featured Project Two

-### 6.1 Public identity

- Title: **FleetOps Data Hub**
- Slug: `fleetops-data-hub`
- Domain: multi-source logistics data integration and search

### 6.2 Confirmed scope

- Consolidate vehicle, journey, delivery-status, and operational-incident data.
- Provide REST APIs for lookup and aggregation.
- Process synchronization events with Kafka.
- Integrate internal services using gRPC and REST.
- Use Elasticsearch for operational-record search.
- Use Redis for caching or short-lived coordination.
- Run data-synchronization workers.

### 6.3 NDA-safe form mapping

The project uses the same case-study form as project one:

1. Overview
2. Requirements
3. Key Challenges
4. Architecture Diagram
5. Main Flow
6. My Contributions
7. Tech Stack
8. Scaling & Metrics
9. Reliability & Security
10. Trade-offs / Design Decisions
11. Outcome / Impact
12. Lessons Learned

Its diagram uses only this generic flow:

```text
Source Systems -> Integration Adapters -> Kafka -> Sync Workers
                                            |
                                      PostgreSQL / Elasticsearch
                                            |
Client -> Lookup API -> Redis Cache --------+
```

Unknown metrics are not invented. Qualitative card highlights may describe `Multi-source`, `Event-driven`, and `Search-optimized` characteristics without presenting them as measured scale.

## 7. Project Page Form

Both large project pages preserve the approved reference case-study presentation:

- Small `Case study (NDA-friendly)` eyebrow.
- Project title, subtitle, technology tags, disclaimer card, and back button.
- Compact monospace section labels.
- Every content section inside the original rounded bordered card form.
- Inline pan/zoom architecture diagram.
- Homepage `Preview Architecture` button opens the original-style diagram modal.
- Homepage `Read Case Study` button opens `/projects/:slug`.
- Invalid slugs show a noindex not-found page and a home link.

Optional sections or fields are hidden when empty; the page must never render temporary placeholder copy, blank cards, `undefined`, or fabricated values.

## 8. Data Architecture

Retain static React data modules with no runtime backend dependency:

- `src/data/profile.js`: Nguyen Thanh Tam identity, contact, experience, education, certifications, language, highlights, and stack.
- `src/data/projects.js`: two large NDA-safe case studies using the original project schema.
- `src/data/earlierProjects.js` or an equivalent selected-project collection: three compact projects.
- Page and card components render data without embedding legacy-owner content.

The project schema supports:

- identity: slug, title, subtitle, tags, disclaimer
- overview: domain, optional duration, role, optional team size, optional scale
- requirements, challenges, main flow, contributions
- architecture title and Mermaid/SVG source
- tech stack and approved metrics/highlights
- reliability/security, trade-offs, outcome, and lessons

## 9. Confidentiality and Publication Guardrails

### 9.1 Never copy from the private reference

- Source files or snippets
- Package, group, repository, service, image, or branch names
- Git history or author metadata
- Hostnames, URLs, IP addresses, ports, buckets, databases, indexes, topics, consumer groups, namespaces, or deployment topology
- Credentials, tokens, keys, auth headers, signed URLs, or secret-like literals
- Actual request/response payloads, identifiers, schemas, table/entity names, or field names
- Customer, partner, organization, user, or staff identities
- Real document templates, screenshots, logs, stack traces, or proprietary workflow labels
- Unapproved production metrics, business outcomes, security claims, or compliance claims

### 9.2 Evidence labels

- `proven`: the private reference demonstrates the presence of REST/gRPC integrations, event processing, caching/state, relational data access, search indexing, and document-generation patterns.
- `user-asserted`: Nguyen Thanh Tam's personal ownership percentage and approved contribution counts.
- `needs-evidence`: production scale, latency, SLA, team size, project duration, customer impact, personal ownership of unlisted modules, and publication/IP approval.

Security/privacy decision: **Conditional Go** for the rewritten case study; **No-Go** for copying any private artifact.

## 10. Error Handling and Accessibility

- Hide absent optional project fields and whole empty sections.
- Show a safe fallback when a diagram fails to render.
- Keep project routes and homepage anchors keyboard accessible.
- Restore visible focus states.
- Give diagram controls and modal controls accessible labels.
- Support Escape to close the modal and return focus to the trigger.
- Respect `prefers-reduced-motion`.
- Preserve semantic heading order and adequate contrast.

## 11. Verification

### Automated

- Run portfolio data-contract tests.
- Run legacy-owner and private-identifier banlist tests.
- Scan source, public assets, generated output, docs intended for release, and metadata for forbidden names and identifiers.
- Scan for internal URL/IP patterns and secret-like values.
- Verify exactly two large projects and three selected projects.
- Verify both large project records satisfy the project-page schema.
- Run `npm run lint`.
- Run `npm run build` and prerender checks.
- Run `git diff --check`.

### Manual

- Compare desktop and mobile homepage form against the approved reference structure.
- Review both project cards, case-study routes, metric presentation, diagram previews, inline diagrams, and modal controls.
- Test navbar, table of contents, scrollspy, anchors, contact links, certificate links, and not-found handling.
- Confirm that no CV link is shown until an updated PDF is approved.
- Review every case-study sentence for unsupported ownership, scale, impact, security, or compliance claims.
- Review the final public branch as a clean GitHub history that does not expose the private reference or legacy portfolio history.

## 12. Acceptance Criteria

- The homepage visibly follows the approved reference form while containing only Nguyen Thanh Tam's identity and approved content.
- Both featured projects use the original large-project card, architecture-preview, and case-study form.
- Project one is published as `Fleet Operations Management Platform` and is recognizably useful to logistics recruiters without revealing the private source domain.
- Project one displays only the approved contribution counts.
- Project two remains `FleetOps Data Hub` and contains no fabricated numeric metrics.
- Diagrams are newly authored, generic, and editable; no private diagram or asset is copied.
- Unknown duration, team, scale, and impact fields remain hidden.
- No legacy-owner content, private-system identifier, source path, credential, signed URL, internal network value, real schema, or template appears in publishable files or build output.
- Lint, tests, build, prerender, responsive review, keyboard review, and privacy scans pass.
- Release is prepared for the clean GitHub `main` history only and is never pushed to GitLab.
