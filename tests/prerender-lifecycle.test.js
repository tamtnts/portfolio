import test from 'node:test';
import assert from 'node:assert/strict';
import { withCleanup } from '../scripts/prerender-lifecycle.js';

test('runs cleanup and preserves the operation failure when cleanup also fails', async () => {
  const primaryError = new Error('primary failure');
  let cleaned = false;

  await assert.rejects(
    withCleanup(
      async () => { throw primaryError; },
      async () => {
        cleaned = true;
        throw new Error('cleanup failure');
      },
    ),
    (error) => error === primaryError,
  );
  assert.equal(cleaned, true);
});

test('bounds never-settling cleanup while preserving the operation failure', async () => {
  const primaryError = new Error('primary failure');
  const startedAt = Date.now();

  await assert.rejects(
    withCleanup(
      async () => { throw primaryError; },
      async () => new Promise(() => {}),
      { timeoutMs: 20 },
    ),
    (error) => error === primaryError,
  );
  assert.ok(Date.now() - startedAt < 500);
});

test('reports a cleanup timeout when a successful operation cleanup never settles', async () => {
  await assert.rejects(
    withCleanup(
      async () => 'completed',
      async () => new Promise(() => {}),
      { timeoutMs: 20 },
    ),
    /Cleanup timed out after 20ms/,
  );
});
