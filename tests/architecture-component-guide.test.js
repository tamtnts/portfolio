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

const privateIdentifierFragments = [
  ['project', '-', '165'],
  ['ttttch', '165'],
  ['data', '-', 'mining', '-', 'service'],
  ['admin', '-', 'service'],
  ['app', '-', 'service'],
];

const privateIdentifierPattern = new RegExp(
  privateIdentifierFragments
    .map((fragments) => escapeRegExp(fragments.join('')))
    .join('|'),
  'i',
);

const privateAddressPattern = String.raw`\b(?:10(?:\.\d{1,3}){3}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2}|192\.168(?:\.\d{1,3}){2})\b`;
const concreteEndpointPattern = String.raw`(?:https?:\/\/[^\s)]+|\b(?:GET|POST|PUT|PATCH|DELETE)\s+\/[a-z0-9_./{}:-]+|\/api\/v\d+(?:\/[a-z0-9_{}.-]+)*)`;
const namedIdentifierPattern = String.raw`\b(?:endpoint|topic|schema|table|deployment)(?:\s+(?:name|identifier))?\s*(?::|=|named\s+)\s*[/'"\x60]?[a-z0-9][a-z0-9_./{}:-]*`;
const guideLeakPattern = new RegExp(
  [privateAddressPattern, concreteEndpointPattern, namedIdentifierPattern].join('|'),
  'i',
);

const diagrams = [
  fleetPlatform.c4.context,
  ...projects.flatMap((project) => [
    project.c4.container,
    project.c4.component,
  ]),
];

const expectedComponentHeadings = diagrams.flatMap(
  (diagram) => diagram.accessibility.elements,
);

function componentEntries(guide) {
  const headings = [...guide.matchAll(/^#### ([^\r\n]+?)\s*$/gm)];

  return headings.map((heading) => {
    const bodyStart = heading.index + heading[0].length;
    const nextHeadingOffset = guide.slice(bodyStart).search(/^#{1,6}\s/m);
    const end = nextHeadingOffset === -1
      ? guide.length
      : bodyStart + nextHeadingOffset;

    return {
      heading: heading[1],
      start: heading.index,
      end,
      body: guide.slice(bodyStart, end),
    };
  });
}

function assertGuideEntries(guide) {
  const entries = componentEntries(guide);

  assert.deepEqual(
    entries.map((entry) => entry.heading),
    expectedComponentHeadings,
    'Architecture component heading sequence must exactly match every C1, C2, and C3 element',
  );

  for (const entry of entries) {
    for (const field of requiredFields) {
      assert.match(
        entry.body,
        new RegExp(`^\\*\\*${field}:\\*\\*`, 'm'),
        `Missing ${field} in architecture component entry: ${entry.heading}`,
      );
    }
  }
}

test('architecture guide gives every public C1 C2 and C3 component its own complete entry', async () => {
  const guide = await readFile(guideUrl, 'utf8');

  for (const project of projects) {
    assert.match(guide, new RegExp(escapeRegExp(project.title)));
  }

  assertGuideEntries(guide);
});

test('architecture guide contract rejects a missing repeated C2 entry', async () => {
  const guide = await readFile(guideUrl, 'utf8');
  const repeatedEntries = [
    ...guide.matchAll(/^#### Operations Client\s*$[\s\S]*?(?=^#### )/gm),
  ];
  const removedEntry = repeatedEntries[1];
  assert.ok(removedEntry, 'Expected a repeated Operations Client entry fixture');

  const incompleteGuide = [
    guide.slice(0, removedEntry.index),
    guide.slice(removedEntry.index + removedEntry[0].length),
  ].join('');

  assert.throws(
    () => assertGuideEntries(incompleteGuide),
    /architecture component/i,
  );
});

test('architecture guide contract rejects duplicate and extra component headings', async () => {
  const guide = await readFile(guideUrl, 'utf8');
  const entries = componentEntries(guide);
  const firstEntry = entries[0];
  const duplicatedGuide = [
    guide.slice(0, firstEntry.end),
    guide.slice(firstEntry.start, firstEntry.end),
    guide.slice(firstEntry.end),
  ].join('');
  const extraGuide = `${guide}\n#### Unsupported Runtime\n`;

  assert.throws(
    () => assertGuideEntries(duplicatedGuide),
    /architecture component/i,
  );
  assert.throws(
    () => assertGuideEntries(extraGuide),
    /architecture component/i,
  );
});

test('architecture guide contract checks all fields in every repeated entry', async () => {
  const guide = await readFile(guideUrl, 'utf8');
  const operationsEntries = componentEntries(guide).filter(
    (entry) => entry.heading === 'Operations Client',
  );
  const repeatedEntry = operationsEntries[1];
  assert.ok(repeatedEntry, 'Expected a repeated Operations Client entry fixture');

  const incompleteEntry = guide
    .slice(repeatedEntry.start, repeatedEntry.end)
    .replace('**\u0110\u1ea7u ra:**', '**Tr\u01b0\u1eddng b\u1ecb thi\u1ebfu:**');
  const incompleteGuide = [
    guide.slice(0, repeatedEntry.start),
    incompleteEntry,
    guide.slice(repeatedEntry.end),
  ].join('');

  assert.throws(
    () => assertGuideEntries(incompleteGuide),
    /Missing \u0110\u1ea7u ra in architecture component entry: Operations Client/,
  );
});

test('architecture guide stays PostgreSQL-based and NDA-safe', async () => {
  const guide = await readFile(guideUrl, 'utf8');

  assert.match(guide, /PostgreSQL/);
  assert.doesNotMatch(guide, /MongoDB/i);
  assert.doesNotMatch(guide, privateIdentifierPattern);
  assert.doesNotMatch(guide, guideLeakPattern);
});

test('architecture guide NDA scan recognizes private infrastructure and concrete identifiers', () => {
  const leakFixtures = [
    ['172', '.16', '.0', '.1'].join(''),
    ['192', '.168', '.1', '.1'].join(''),
    ['endpoint', ': ', '/', 'internal', '-', 'resource'].join(''),
    ['GET', ' ', '/', 'internal', '/', 'resource'].join(''),
    ['topic', ' = ', 'fleet', '.', 'events'].join(''),
    ['schema', ': ', 'operations', '_', 'private'].join(''),
    ['table', ' = ', 'vehicle', '_', 'record'].join(''),
    ['deployment', ' name = ', 'fleet', '-', 'production'].join(''),
  ];

  for (const fixture of leakFixtures) {
    assert.match(fixture, guideLeakPattern, `Leak fixture was not detected: ${fixture}`);
  }
});
