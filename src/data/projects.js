export const projects = [
  {
    slug: 'fleet-operations-platform',
    title: 'Fleet Operations Platform',
    subtitle:
      'Backend services for vehicle lookup, journey operations, statistics, and record exports.',
    tags: ['Java 17', 'Spring Boot', 'PostgreSQL', 'Redis', 'REST'],
    context:
      'An NDA-safe logistics platform supporting day-to-day fleet operations.',
    role: 'Java Backend Developer',
    modules: [
      'Vehicle lookup',
      'Journey data',
      'Operational statistics',
      'Record and document exports',
    ],
    contributions: [
      'Built approximately 40 lookup APIs.',
      'Built approximately 20 statistics APIs.',
      'Built approximately 15 record-export APIs.',
      'Optimized approximately 20-30 database queries.',
    ],
    dataFlow: [
      'Client request',
      'Spring Boot service',
      'Domain validation',
      'PostgreSQL query',
      'Response or generated record',
    ],
    decisions: [
      'Keep service contracts explicit and separate lookup, statistics, and export responsibilities.',
      'Optimize query plans and indexes around real operational access patterns.',
    ],
    challenges: [
      'Supporting varied lookup filters without creating unmaintainable queries.',
      'Keeping statistics and exports reliable on operational datasets.',
    ],
    outcome: [
      'Improved maintainability across core operational modules.',
      'Reduced avoidable database work through targeted query optimization.',
    ],
    lessons: [
      'Measure query behavior before optimizing.',
      'Keep export workflows isolated from interactive lookup paths.',
    ],
  },
  {
    slug: 'fleetops-data-hub',
    title: 'FleetOps Data Hub',
    subtitle:
      'A backend integration hub for consolidating logistics data across internal systems.',
    tags: ['Java 17', 'Spring Boot', 'Kafka', 'gRPC', 'Redis', 'Elasticsearch'],
    context:
      'An NDA-safe data platform integrating vehicle, journey, delivery-status, and operational-incident records.',
    role: 'Java Backend Developer',
    modules: [
      'Data lookup and aggregation',
      'Kafka event processing',
      'gRPC/REST integrations',
      'Elasticsearch operational search',
      'Synchronization workers',
    ],
    contributions: [
      'Developed REST APIs for lookup and aggregation.',
      'Built Kafka consumers and synchronization workers.',
      'Integrated internal services through gRPC and REST.',
      'Used Redis for caching and coordination.',
      'Supported Elasticsearch-backed operational search.',
    ],
    dataFlow: [
      'Source systems',
      'Integration adapters',
      'Kafka events',
      'Synchronization workers',
      'PostgreSQL and Elasticsearch',
      'Lookup APIs',
    ],
    decisions: [
      'Use asynchronous events for decoupled synchronization.',
      'Use gRPC/REST where request-response consistency is required.',
      'Use Elasticsearch as a read-optimized search layer rather than the system of record.',
    ],
    challenges: [
      'Keeping data synchronized across multiple logistics systems.',
      'Handling retries and temporary coordination state without duplicating work.',
    ],
    outcome: [
      'Provided a consistent backend access layer for operational data.',
      'Separated integration processing from read-oriented APIs.',
    ],
    lessons: [
      'Make synchronization state observable.',
      'Choose integration style per consistency and latency requirement.',
    ],
  },
];
