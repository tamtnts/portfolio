import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fleetPlatform } from '../src/data/fleetPlatform.js';
import { projects } from '../src/data/projects.js';

const guideUrl = new URL(
  '../docs/architecture/fleet-platform-component-guide.md',
  import.meta.url,
);

const requiredFields = [
  'Nhi\u00e1\u00bb\u2021m v\u00e1\u00bb\u00a5',
  'T\u00c3\u00a1c d\u00e1\u00bb\u00a5ng',
  '\u00c4\u0090\u00e1\u00ba\u00a7u v\u00c3\u00a0o',
  '\u00c4\u0090\u00e1\u00ba\u00a7u ra',
  'Quan h\u00e1\u00bb\u2021 ch\u00c3\u00adnh',
];

test('architecture guide covers every public C1 C2 and C3 component', async () => {
  const guide = await readFile(guideUrl, 'utf8');
  const diagrams = [
    fleetPlatform.c4.context,
    ...projects.flatMap((project) => [
      project.c4.container,
      project.c4.component,
    ]),
  ];

  for (const project of projects) {
    assert.match(guide, new RegExp(project.title.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&')));
  }

  for (const diagram of diagrams) {
    for (const element of diagram.accessibility.elements) {
      assert.ok(
        guide.includes(element),
        `Missing architecture component: ${element}`,
      );
    }
  }

  for (const field of requiredFields) {
    assert.match(guide, new RegExp(`\\*\\*${field}:\\*\\*`));
  }
});

test('architecture guide stays PostgreSQL-based and NDA-safe', async () => {
  const guide = await readFile(guideUrl, 'utf8');

  assert.match(guide, /PostgreSQL/);
  assert.doesNotMatch(guide, /MongoDB/i);
  assert.doesNotMatch(
    guide,
    /project-165|ttttch165|data-mining-service|admin-service|app-service/i,
  );
  assert.doesNotMatch(
    guide,
    /(?:https?:\/\/)?10\.\d+\.\d+\.\d+|\/api\/v\d+|topic\s*[:=]|table\s*[:=]/i,
  );
});
