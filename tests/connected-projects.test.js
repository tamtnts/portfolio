import test from 'node:test';
import assert from 'node:assert/strict';
import { projects } from '../src/data/projects.js';

const expectedProjects = [
  ['fleet-operations-core', 'Fleet Operations Core', 'Service 01 / Operational Core'],
  ['fleet-administration-dispatch', 'Fleet Administration & Dispatch', 'Service 02 / Administration'],
  ['fleet-data-intelligence-hub', 'Fleet Data Intelligence Hub', 'Service 03 / Data Intelligence'],
];

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

    for (const [, title] of expectedProjects) {
      assert.match(project.mermaid.code, new RegExp(title.replace('&', '&')));
    }
  }
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
