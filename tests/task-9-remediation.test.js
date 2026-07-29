import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { projects } from '../src/data/projects.js';

const source = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('project-card qualitative highlights wrap without ellipsis', async () => {
  const card = await source('../src/components/ProjectCard.jsx');

  assert.doesNotMatch(card, /\btruncate\b/);
  assert.equal((card.match(/\bbreak-words\b/g) ?? []).length, 2);
});

test('Mermaid diagram gives the transform viewport and SVG the available width', async () => {
  const diagram = await source('../src/components/MermaidDiagram.jsx');
  const wrapperTag = diagram.match(/<TransformWrapper[\s\S]*?>/)?.[0] ?? '';
  const componentTag = diagram.match(/<TransformComponent[\s\S]*?>/)?.[0] ?? '';

  assert.doesNotMatch(wrapperTag, /wrapperClass|contentClass/);
  assert.match(componentTag, /wrapperClass=['"][^'"]*\bw-full\b/);
  assert.match(componentTag, /contentClass=['"][^'"]*\bw-full\b/);
  assert.match(componentTag, /wrapperStyle=\{\{\s*width:\s*['"]100%['"]/);
  assert.match(componentTag, /contentStyle=\{\{\s*width:\s*['"]100%['"]/);
  assert.match(diagram, /className=['"][^'"]*\bw-full\b[^'"]*\bmax-w-full\b[^'"]*\boverflow-hidden\b/);
  assert.match(diagram, /\[&_svg\]:!w-full/);
  assert.match(diagram, /\[&_svg\]:!max-w-full/);
  assert.doesNotMatch(diagram, /min-w-max|max-w-none/);
});

test('Operations Core publishes qualitative workflow and integration concepts', () => {
  const project = projects.find(({ slug }) => slug === 'fleet-operations-core');
  const projectText = JSON.stringify(project);

  for (const concept of [
    /workflow/i,
    /REST/,
    /gRPC/,
    /relational/i,
    /Redis/,
    /Kafka/,
    /Elasticsearch/,
    /document/i,
  ]) {
    assert.match(projectText, concept);
  }

  assert.doesNotMatch(projectText, /~?\d+\s*apis?/i);
});

test('first case study rejects private evidence fingerprints and source-level identifiers', () => {
  const project = projects.find(({ slug }) => slug === 'fleet-operations-core');
  const projectText = JSON.stringify(project);

  assert.doesNotMatch(projectText, /\b[a-z]:\\/i);
  assert.doesNotMatch(projectText, /src\/(?:main|test)|(?:^|[^\w])package\s+[\w.]+/i);
  assert.doesNotMatch(projectText, /https?:\/\/|(?:\d{1,3}\.){3}\d{1,3}|localhost|:\d{2,5}\b/i);
  assert.doesNotMatch(projectText, /repository|commit count|Kafka topic|consumer group|database name/i);
});
