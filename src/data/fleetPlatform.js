const ecosystemDiagram = [
  'flowchart LR',
  '  Admin[Fleet Administration & Dispatch]',
  '  Core[Fleet Operations Core]',
  '  Data[Fleet Data Intelligence Hub]',
  '  Events[(Kafka)]',
  '  Admin -->|Plans, resources, configuration| Core',
  '  Core -->|Operational events| Events',
  '  Admin -->|Reference and coordination events| Events',
  '  Events -->|Synchronization| Data',
  '  Core -->|Lookup and search requests| Data',
  '  Data -->|Aggregated read responses| Core',
  '  Admin -->|Lookup and aggregation requests| Data',
  '  Data -->|Aggregated read responses| Admin',
].join('\n');

export const fleetPlatform = {
  name: 'Fleet Operations Platform',
  summary: 'Three connected backend services separate operational workflows, administration and dispatch, and read-oriented data intelligence.',
  disclaimer: 'The service names and diagram are generalized for confidentiality and do not reproduce a private production topology.',
  mermaid: {
    title: 'Connected service ecosystem',
    code: ecosystemDiagram,
  },
};
