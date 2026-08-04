# GTEL OTS Middle Backend Experience Design

## Goal

Strengthen the GTEL OTS experience entry so it presents the expected breadth
of a Middle Backend Developer while remaining concise, recruiter-friendly,
and free of private system details.

## Scope

- Update only the GTEL OTS `highlights` array in `src/data/profile.js`.
- Keep the company, role, period, FPT Software entry, page layout, projects,
  Tech Stack, profile summary, and public CV PDF unchanged.
- Keep the portfolio content in English.
- Do not add quantitative claims, customer names, private identifiers,
  endpoints, event topics, schemas, infrastructure addresses, or proprietary
  architecture details.

## Content Structure

The GTEL OTS entry will contain exactly nine concise bullet points:

1. Develop and maintain Java 17+ and Spring Boot microservices for vehicle lookup, journey data, operational statistics, and record exports.
2. Design Oracle, PostgreSQL, MySQL, and MongoDB data models; optimize SQL queries, indexing, partitioning, transactions, and persistence with Spring Data JPA/Hibernate.
3. Build resilient Kafka consumers and asynchronous synchronization workers with retry, idempotency, and dead-letter handling.
4. Use Redis for caching, distributed locking, rate limiting, and temporary state coordination.
5. Integrate microservices through gRPC and REST APIs; implement JWT/OAuth2 authentication, RBAC authorization, and API security practices.
6. Optimize backend latency, throughput, and scalability for high-concurrency operational workloads.
7. Build, deploy, and troubleshoot services with Maven/Gradle, Docker, Kubernetes, and CI/CD pipelines.
8. Write unit and integration tests; monitor services through Prometheus, Grafana, ELK, and log analysis.
9. Participate in code reviews, technical design discussions, cross-functional collaboration, and mentoring junior developers.

## Data and Rendering

`ExperienceSection.jsx` already renders every item in
`profile.experience[*].highlights`; no component or styling change is needed.
The update is therefore limited to profile data and its contract test.

## Verification

- Add a profile-data contract asserting that the GTEL OTS entry has exactly
  nine highlights.
- Assert coverage of Java/Spring, databases, Kafka resilience, Redis,
  security, performance, Docker/Kubernetes/CI/CD, testing/monitoring, and
  collaboration.
- Run the focused profile test, full test suite, lint, and production build.
- Confirm the public-content privacy test still passes.

## Acceptance Criteria

- GTEL OTS displays exactly nine English highlights in the approved order.
- All approved capability groups are present.
- No other experience entry or portfolio section changes.
- No quantitative or private operational claims are introduced.
- Tests, lint, build, and privacy verification pass.
