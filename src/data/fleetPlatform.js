const systemContextDiagram = [
  'flowchart LR',
  '  OperationsStaff[Person: Fleet Operations Staff]',
  '  Administrator[Person: Administrator / Dispatcher]',
  '  Platform[Software System: Fleet Operations Platform]',
  '  Sources[External System: Approved Operational Data Sources]',
  '  OperationsStaff -->|Uses for workflow, lookup, and reporting| Platform',
  '  Administrator -->|Uses for planning, resources, and coordination| Platform',
  '  Platform -->|REST/gRPC requests or approved events| Sources',
  '  Sources -->|Approved responses or events| Platform',
].join('\n');

export const fleetPlatform = {
  name: 'Fleet Operations Platform',
  summary: 'Three connected backend services separate operational workflows, administration and dispatch, and read-oriented data intelligence.',
  disclaimer: 'Names, boundaries, and relationships are generalized and anonymized for confidentiality.',
  c4: {
    context: {
      level: 'C1',
      title: 'System Context',
      description: 'People and approved external systems interacting with the Fleet Operations Platform.',
      code: systemContextDiagram,
      accessibility: {
        elements: [
          'Fleet Operations Staff (person)',
          'Administrator / Dispatcher (person)',
          'Fleet Operations Platform (software system)',
          'Approved Operational Data Sources (external system)',
        ],
        relationships: [
          'Fleet Operations Staff use the Fleet Operations Platform for workflow, lookup, and reporting.',
          'Administrators and dispatchers use the Fleet Operations Platform for planning, resources, and coordination.',
          'The Fleet Operations Platform sends REST or gRPC requests and approved events to Approved Operational Data Sources.',
          'Approved Operational Data Sources return approved responses or events to the Fleet Operations Platform.',
        ],
      },
    },
  },
};
