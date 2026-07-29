const fleetOperationsDiagram = [
  'flowchart LR',
  '  Client[Operations clients] --> Interfaces[REST and gRPC APIs]',
  '  Interfaces --> Backend[Java backend component]',
  '  Backend --> UseCases[Use cases and command-query services]',
  '  UseCases --> Relational[(Relational store)]',
  '  UseCases --> Cache[(Redis cache and locks)]',
  '  UseCases --> Search[(Elasticsearch)]',
  '  UseCases --> Events[(Kafka)]',
  '  UseCases --> Adapters[External adapters]',
  '  UseCases --> Renderer[Document and spreadsheet renderer]',
].join('\n');

const dataHubDiagram = [
  'flowchart LR',
  '  Sources[Source Systems] --> Adapters[Integration Adapters]',
  '  Adapters -->|REST and gRPC| API[Lookup and Aggregation API]',
  '  Adapters --> Bus[(Kafka)]',
  '  Bus --> Workers[Synchronization Workers]',
  '  Workers --> DB[(PostgreSQL)]',
  '  Workers --> Search[(Elasticsearch)]',
  '  Client[Operations Client] --> API',
  '  API --> Cache[(Redis)]',
  '  API --> DB',
  '  API --> Search',
].join('\n');

export const projects = [
  {
    slug: 'fleet-operations-management-platform',
    featured: true,
    title: 'Fleet Operations Management Platform',
    subtitle:
      'A Java 17 and Spring Boot backend component for operational workflows, multi-source lookup, reporting, and asynchronous event processing.',
    tags: ['Java 17', 'Spring Boot', 'PostgreSQL', 'Redis', 'Kafka', 'gRPC'],
    disclaimer:
      'Disclaimer: Due to NDA, details are anonymized and metrics are approximate.',
    overview: {
      domain: 'Generalized fleet operations, workflow, lookup, and reporting',
      role: 'Middle Backend Developer',
      scale: 'One backend component within a larger service ecosystem; public figures are limited to user-approved delivery scope.',
    },
    requirements: [
      'Expose neutral REST and gRPC interfaces for operational lookup and workflow use cases.',
      'Support filtered and paginated relational access with fit-for-purpose projections and aggregation.',
      'Use explicit Redis caches and coordination state without treating Redis as the relational source of truth.',
      'Handle selected Kafka batch, workflow, and notification events at asynchronous boundaries.',
      'Use selected Elasticsearch queries without claiming ownership of index ingestion.',
      'Generate template-driven document and spreadsheet artifacts for supported reporting flows.',
    ],
    challenges: [
      'Map boundaries consistently across REST, gRPC, relational, Redis, Kafka, and Elasticsearch interactions.',
      'Keep optional filters, pagination, projections, and aggregation understandable across read paths.',
      'Apply explicit workflow-state and ownership checks before state changes.',
      'Bound selected retry, token-refresh, and OpenFeign fallback paths without implying universal coverage.',
      'Coordinate selected workflows through Redis-backed distributed locking.',
      'Keep Kafka delivery semantics and Elasticsearch index-ingestion ownership explicitly outside public claims.',
    ],
    mermaid: {
      title: 'Generalized backend component flow',
      code: fleetOperationsDiagram,
    },
    mainFlow: [
      'The API validates and maps an operational request at the REST or gRPC boundary.',
      'A use case orchestrates the relevant command or query services.',
      'Read adapters access relational data, explicit Redis caches, selected Elasticsearch queries, or external interfaces as needed.',
      'Workflow state and ownership are validated before supported persistence changes.',
      'Selected Kafka ingestion or publication paths handle asynchronous workflow boundaries.',
      'The use case returns a normalized response or invokes the document and spreadsheet renderer for a generated artifact.',
    ],
    contributions: [
      'Contributed to the delivery of ~40 lookup APIs, ~20 statistics APIs, and ~15 document/export APIs across supported operational flows.',
      'Worked within REST and gRPC boundaries and their mapping to backend use cases.',
      'Supported filtered, paginated, projected, and aggregated relational access patterns.',
      'Contributed to selected Kafka batch, workflow, and notification event paths.',
      'Supported explicit Redis cache and short-lived coordination-state patterns where relevant.',
      'Supported template-driven document and spreadsheet generation across the approved export scope.',
    ],
    techStack: [
      'Java 17', 'Spring Boot', 'Spring Cloud', 'Gradle', 'Spring Data JPA',
      'PostgreSQL', 'Redis', 'Kafka', 'Elasticsearch', 'gRPC', 'REST / OpenFeign',
      'MapStruct', 'ShedLock', 'Docker', 'Document and spreadsheet generation',
    ],
    scaling: {
      lookupApis: '~40 lookup APIs',
      statisticsApis: '~20 statistics APIs',
      documentExportApis: '~15 document/export APIs',
    },
    reliabilitySecurity: [
      'Apply request validation and selected user or organization checks before supported operations.',
      'Use selected retry, token-refresh, and OpenFeign fallback paths with bounded scope.',
      'Keep Redis cache/state responsibilities explicit and use distributed locking for selected coordination paths.',
      'Use health probes and application logging for supported operational diagnosis.',
      'Redact private evidence and production details from public artifacts.',
    ],
    tradeoffs: [
      'Boundary mapping isolates contracts but adds mapping maintenance.',
      'Flexible filters, projections, and Elasticsearch queries add query and index complexity.',
      'Distributed workflow rules require explicit state and ownership handling.',
      'Retries and fallbacks can add latency and cover only selected failure paths.',
      'Redis-backed locking introduces a coordination dependency that needs bounded ownership.',
      'Elasticsearch queries support operational search, while index-ingestion ownership remains explicit and is not claimed here.',
    ],
    outcome: [
      'The project provided a consistent backend component for supported lookup, workflow, reporting, and export use cases.',
      'The architecture separated protocol, use-case, persistence, cache, event, search, and rendering boundaries.',
      'The public case study captures qualitative engineering decisions without exposing private implementation or production details.',
    ],
    lessons: [
      'Keep protocol and store boundaries separate from use-case orchestration.',
      'Make workflow-state and ownership rules explicit before persistence changes.',
      'Define consistent retry, idempotency, and observability policies across service boundaries.',
      'Make search-index ownership explicit rather than inferring it from query integration.',
      'Preserve verifiable evidence before publishing future quantitative claims.',
    ],
  },
  {
    slug: 'fleetops-data-hub',
    featured: true,
    title: 'FleetOps Data Hub',
    subtitle:
      'A backend integration hub that consolidates logistics records for lookup, aggregation, synchronization, and search.',
    tags: ['Java 17', 'Spring Boot', 'Kafka', 'gRPC', 'Redis', 'Elasticsearch'],
    disclaimer:
      'Disclaimer: Due to NDA, details are anonymized and metrics are approximate.',
    overview: {
      domain: 'Multi-source logistics data integration and search',
      role: 'Middle Backend Developer',
    },
    requirements: [
      'Consolidate vehicle, journey, delivery-status, and operational-incident records.',
      'Provide REST APIs for lookup and aggregation.',
      'Process synchronization events through Kafka workers.',
      'Integrate internal services through gRPC and REST.',
      'Support operational-record search through Elasticsearch.',
    ],
    challenges: [
      'Normalize records arriving from systems with different contracts.',
      'Keep relational and search-oriented views aligned.',
      'Separate synchronization processing from read-oriented APIs.',
      'Coordinate cache freshness without making Redis the source of truth.',
    ],
    mermaid: {
      title: 'Generic multi-source synchronization and search flow',
      code: dataHubDiagram,
    },
    mainFlow: [
      'Source systems provide operational records through integration adapters.',
      'Request-response integrations serve data that must be available immediately.',
      'Kafka events decouple background synchronization from source systems.',
      'Workers normalize and persist relational records and search projections.',
      'Lookup APIs use Redis, PostgreSQL, and Elasticsearch according to the read pattern.',
    ],
    contributions: [
      'Developed REST APIs for operational lookup and aggregation.',
      'Built Kafka consumers and data-synchronization workers.',
      'Integrated internal services through gRPC and REST.',
      'Used Redis for caching and short-lived coordination.',
      'Supported Elasticsearch-backed operational search.',
    ],
    techStack: [
      'Java 17', 'Spring Boot', 'PostgreSQL', 'Redis', 'Kafka',
      'gRPC', 'REST', 'Elasticsearch', 'Docker',
    ],
    scaling: {
      integrationModel: 'Multi-source integration',
      processingModel: 'Event-driven synchronization',
      searchModel: 'Search-optimized reads',
    },
    reliabilitySecurity: [
      'Keep the relational database as the source of truth.',
      'Separate asynchronous synchronization from interactive reads.',
      'Use bounded cache entries with explicit freshness rules.',
      'Keep customer data, credentials, and integration identifiers out of public artifacts.',
    ],
    tradeoffs: [
      'Asynchronous synchronization reduces coupling but introduces eventual consistency.',
      'A search projection improves query flexibility but adds index lifecycle work.',
      'Multiple integration styles improve fit but increase contract-management overhead.',
    ],
    outcome: [
      'Provided a consistent access layer across operational data sources.',
      'Separated integration processing from lookup and search concerns.',
    ],
    lessons: [
      'Choose synchronous or asynchronous integration from consistency needs.',
      'Keep synchronization state observable and bounded.',
      'Treat search indexes as rebuildable projections.',
    ],
  },
];
