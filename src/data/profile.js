export const profile = {
  name: 'Nguyen Thanh Tam',
  shortName: 'Tam Nguyen',
  role: 'Java Backend Developer',
  status: 'Open to Work & Freelance Projects',
  location: 'Ho Chi Minh City',
  workModes: ['Onsite', 'Hybrid', 'Remote'],
  email: 'tamtnts@gmail.com',
  phone: { label: '0941 346 209', href: 'tel:+84941346209' },
  github: 'https://github.com/tamtnts',
  linkedin: 'https://www.linkedin.com/in/tam-nguyen-thanh-338983260/',
  resumeUrl: null,
  summary:
    'I build maintainable REST APIs and data-intensive backend services for logistics operations, with a focus on clear service boundaries, reliable integrations, and efficient database access.',
  focus: [
    {
      title: 'REST APIs & Service Design',
      description:
        'Maintainable Spring Boot services with clear contracts and practical boundaries.',
    },
    {
      title: 'Database & Query Optimization',
      description:
        'Data models, indexes, and query improvements for operational workloads.',
    },
    {
      title: 'Event-Driven Integrations',
      description:
        'Kafka workers and gRPC/REST communication across internal services.',
    },
    {
      title: 'Caching & Coordination',
      description:
        'Redis caching, temporary state, rate limiting, and distributed coordination.',
    },
  ],
  stack: {
    backend: ['Java 17', 'Spring Boot', 'REST', 'gRPC'],
    dataMessaging: ['PostgreSQL', 'Redis', 'Kafka', 'Elasticsearch'],
    delivery: ['Docker'],
    supporting: [
      'C#/.NET',
      'ASP.NET',
      'Java Servlet',
      'MySQL',
      'SQL Server',
      'Entity Framework',
      'React',
      'HTML',
      'CSS',
      'Firebase',
      'Figma',
      'UI/UX Fundamentals',
    ],
  },
  experience: [
    {
      company: 'GTEL OTS',
      role: 'Java Backend Developer',
      period: 'Aug 2024 - Present',
      highlights: [
        'Develop and maintain REST APIs for vehicle lookup, journey data, operational statistics, and record exports.',
        'Design database structures and optimize queries for operational workloads.',
        'Build Kafka-based synchronization and asynchronous processing workers.',
        'Use Redis for caching, temporary coordination state, rate limiting, and distributed locking.',
        'Integrate internal services through gRPC and REST.',
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
