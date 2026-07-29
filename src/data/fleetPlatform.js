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
  disclaimer: 'The system boundary and relationships are generalized for confidentiality and do not reproduce a private production topology.',
  c4: {
    context: {
      level: 'C1',
      title: 'System Context',
      description: 'People and approved external systems interacting with the Fleet Operations Platform.',
      code: systemContextDiagram,
    },
  },
};
