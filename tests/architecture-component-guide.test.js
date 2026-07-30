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
  'Nhi\u1ec7m v\u1ee5',
  'T\u00e1c d\u1ee5ng',
  '\u0110\u1ea7u v\u00e0o',
  '\u0110\u1ea7u ra',
  'Quan h\u1ec7 ch\u00ednh',
];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test('architecture guide gives every public C1 C2 and C3 component its own complete entry', async () => {
  const guide = await readFile(guideUrl, 'utf8');
  const diagrams = [
    fleetPlatform.c4.context,
    ...projects.flatMap((project) => [
      project.c4.container,
      project.c4.component,
    ]),
  ];

  for (const project of projects) {
    assert.match(guide, new RegExp(escapeRegExp(project.title)));
  }

  const components = new Set(
    diagrams.flatMap((diagram) => diagram.accessibility.elements),
  );

  for (const component of components) {
    const entry = guide.match(
      new RegExp(
        `^#### ${escapeRegExp(component)}\\s*$([\\s\\S]*?)(?=^#### |(?![\\s\\S]))`,
        'm',
      ),
    );

    assert.ok(entry, `Missing architecture component entry: ${component}`);

    for (const field of requiredFields) {
      assert.match(
        entry[1],
        new RegExp(`^\\*\\*${field}:\\*\\*`, 'm'),
        `Missing ${field} in architecture component entry: ${component}`,
      );
    }
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
