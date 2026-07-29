import test from 'node:test';
import assert from 'node:assert/strict';
import { projects } from '../src/data/projects.js';
import { fleetPlatform } from '../src/data/fleetPlatform.js';

const expectedProjects = [
  ['fleet-operations-core', 'Fleet Operations Core', 'Service 01 / Operational Core'],
  ['fleet-administration-dispatch', 'Fleet Administration & Dispatch', 'Service 02 / Administration'],
  ['fleet-data-intelligence-hub', 'Fleet Data Intelligence Hub', 'Service 03 / Data Intelligence'],
];

function assertAccessibleDiagram(diagram) {
  assert.ok(diagram.accessibility, `${diagram.level} accessibility content is missing`);
  assert.ok(Array.isArray(diagram.accessibility.elements));
  assert.ok(diagram.accessibility.elements.length > 0);
  assert.ok(diagram.accessibility.elements.every((element) => typeof element === 'string' && element.length > 0));
  assert.ok(Array.isArray(diagram.accessibility.relationships));
  assert.ok(diagram.accessibility.relationships.length > 0);
  assert.ok(diagram.accessibility.relationships.every((relationship) => typeof relationship === 'string' && relationship.length > 0));
  assert.equal(diagram.accessibility.code, undefined);
}

test('publishes three connected fleet-platform services', () => {
  assert.deepEqual(
    projects.map(({ slug, title, serviceLabel }) => [slug, title, serviceLabel]),
    expectedProjects,
  );

  for (const project of projects) {
    assert.equal(project.featured, true);
    assert.equal(project.overview.role, 'Middle Backend Developer');
    assert.match(project.overview.platform, /Fleet Operations Platform/);
    assert.equal(project.highlights.length, 3);
    assert.equal(project.scaling, undefined);

    assert.equal(project.c4.container.level, 'C2');
    assert.equal(project.c4.component.level, 'C3');
    assert.equal(project.mermaid, undefined);

    for (const [, title] of expectedProjects) {
      assert.match(project.c4.container.code, new RegExp(title));
    }

    assert.match(project.c4.container.code, /REST\/gRPC/);
    assert.match(project.c4.container.code, /Kafka/);
    assert.match(project.c4.container.code, new RegExp(`class ${project.c4.container.currentId} current`));
    assert.doesNotMatch(project.c4.component.code, /Person:|Software System:|External System:/);
  }
});

test('publishes a strict shared C1 System Context view', () => {
  const context = fleetPlatform.c4.context;

  assert.equal(context.level, 'C1');
  assert.equal(context.title, 'System Context');
  assert.match(context.code, /Fleet Operations Staff/);
  assert.match(context.code, /Administrator \/ Dispatcher/);
  assert.match(context.code, /Fleet Operations Platform/);
  assert.match(context.code, /Approved Operational Data Sources/);
  assert.match(context.code, /REST\/gRPC/);
  assert.doesNotMatch(context.code, /Fleet Operations Core|Fleet Administration & Dispatch|Fleet Data Intelligence Hub|Kafka|Redis|MongoDB|Elasticsearch/);
});

test('keeps the three case studies qualitative and NDA-safe', () => {
  const publicText = JSON.stringify(projects);
  assert.doesNotMatch(publicText, /~?\d+\s*(?:apis?|ms|%|users?|requests?|records?)/i);
  assert.doesNotMatch(publicText, /\b[a-z]:\\|src\/(?:main|test)|localhost|private network|consumer group/i);
  assert.doesNotMatch(publicText, /owned the entire|designed the entire|solely responsible/i);
});

test('publishes only approved contribution themes', () => {
  const operations = projects[0].contributions.join(' ');
  const administration = projects[1].contributions.join(' ');
  const intelligence = projects[2].contributions.join(' ');

  assert.match(operations, /REST|gRPC|Redis|Kafka|document/i);
  assert.match(administration, /API|database|Redis|Kafka|gRPC/i);
  assert.match(intelligence, /worker|lookup|Elasticsearch|Kafka|gRPC/i);
});

test('publishes structured accessible content for every C1 C2 and C3 diagram', () => {
  assertAccessibleDiagram(fleetPlatform.c4.context);

  for (const project of projects) {
    assertAccessibleDiagram(project.c4.container);
    assertAccessibleDiagram(project.c4.component);
  }
});

test('identifies the current highlighted service in every C2 accessible summary', () => {
  for (const project of projects) {
    assert.equal(
      project.c4.container.accessibility?.currentService,
      `Current highlighted service: ${project.title}.`,
    );
  }
});

test('keeps accessible C4 content generalized and free of Mermaid source', () => {
  const summaries = JSON.stringify([
    fleetPlatform.c4.context.accessibility,
    ...projects.flatMap((project) => [
      project.c4.container.accessibility,
      project.c4.component.accessibility,
    ]),
  ]);

  assert.doesNotMatch(summaries, /flowchart|-->|classDef|\bclass\s+\w+\s+current/i);
  assert.doesNotMatch(summaries, /\b[a-z]:\\|src\/(?:main|test)|localhost|private network|consumer group/i);
});

test('shared confidentiality copy explicitly anonymizes names boundaries and relationships', () => {
  assert.match(fleetPlatform.disclaimer, /names/i);
  assert.match(fleetPlatform.disclaimer, /boundaries/i);
  assert.match(fleetPlatform.disclaimer, /relationships/i);
  assert.match(fleetPlatform.disclaimer, /generalized/i);
  assert.match(fleetPlatform.disclaimer, /anonymized/i);
});
