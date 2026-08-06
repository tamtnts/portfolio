const deploymentBase = import.meta.env?.BASE_URL ?? '/';

export const profile = {
  name: 'Nguyen Thanh Tam',
  shortName: 'Tam Nguyen',
  role: 'Middle Backend Developer',
  status: 'Open to Work & Freelance Projects',
  location: 'Ho Chi Minh City',
  workModes: ['Onsite', 'Hybrid', 'Remote'],
  email: 'tamtnts@gmail.com',
  phone: { label: '0941 346 209', href: 'tel:+84941346209' },
  github: 'https://github.com/tamtnts',
  linkedin: 'https://www.linkedin.com/in/tam-nguyen-thanh-338983260/',
  resumeUrl: `${deploymentBase}NguyenThanhTam-CV.pdf`,
  summary:
    'I build maintainable REST APIs and data-intensive backend services for logistics operations, with a focus on clear service boundaries, reliable integrations, and efficient database access.',
  focus: [
    {
      title: 'REST APIs & Service Design',
      description:
        'Maintainable Spring Boot services with explicit contracts and practical boundaries.',
    },
    {
      title: 'Database & Query Optimization',
      description:
        'Data models, indexes, and measured query improvements for operational workloads.',
    },
    {
      title: 'Event-Driven Processing',
      description:
        'Kafka consumers and synchronization workers for reliable asynchronous workflows.',
    },
    {
      title: 'Service Integration',
      description:
        'gRPC and REST adapters that normalize data from multiple internal services.',
    },
    {
      title: 'Search & Document Workflows',
      description:
        'Elasticsearch-backed operational search and template-driven document generation.',
    },
  ],
  stack: {
    core: [
      'Java (Spring Boot)',
      'Kafka',
      'EMQX / MQTT',
      'Redis',
      'Oracle DB',
      'PostgreSQL',
      'MongoDB',
      'Elasticsearch',
    ],
    infrastructure: [
      'Kubernetes',
      'Rancher',
      'GitLab CI',
      'MinIO / S3',
    ],
  },
  experience: [
    {
      company: 'GTEL OTS',
      role: 'Middle Backend Developer',
      period: 'Aug 2024 - Present',
      highlights: [
        'Develop and maintain Java 17+ and Spring Boot microservices for vehicle lookup, journey data, operational statistics, and record exports.',
        'Design Oracle, PostgreSQL, and MongoDB data models; optimize SQL queries, indexing, partitioning, transactions, and persistence with Spring Data JPA/Hibernate.',
        'Build resilient Kafka consumers and asynchronous synchronization workers with retry, idempotency, and dead-letter handling.',
        'Use Redis for caching, distributed locking, rate limiting, and temporary state coordination.',
        'Integrate microservices through gRPC and REST APIs; implement JWT/OAuth2 authentication, RBAC authorization, and API security practices.',
        'Optimize backend latency, throughput, and scalability for high-concurrency operational workloads.',
        'Build, deploy, and troubleshoot services with Maven/Gradle, Docker, Kubernetes, and CI/CD pipelines.',
        'Write unit and integration tests; monitor services through Prometheus, Grafana, ELK, and log analysis.',
        'Participate in code reviews, technical design discussions, cross-functional collaboration, and mentoring junior developers.',
      ],
    },
    {
      company: 'FPT Software',
      role: 'Internship',
      period: null,
      highlights: [
        'Contributed to a Spring Boot training-management project and strengthened backend fundamentals.',
      ],
    },
  ],
  education: {
    school: 'FPT University, Ho Chi Minh City',
    degree: 'Software Engineering',
    period: '2019 - 2023',
    classification: 'Good',
  },
  english: 'Intermediate - able to communicate and read technical documentation',
  certifications: [
    {
      name: 'Web Design for Everybody: Basics of Web Development & Coding',
      url: 'https://coursera.org/share/884f37a2eb1a316e2da33b64f11efa01',
    },
    {
      name: 'Software Development Lifecycle',
      url: 'https://coursera.org/share/9e77b39f66399779fb476e5123772be5',
    },
    {
      name: 'CertNexus Certified Ethical Emerging Technologist',
      url: 'https://coursera.org/share/cd0bd9b46ae288b425571cfaa69a89ae',
    },
    {
      name: 'Google Project Management',
      url: 'https://coursera.org/share/401bf59e8823dadb6dcb91bb063623e7',
    },
  ],
};
