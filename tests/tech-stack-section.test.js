import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { profile } from '../src/data/profile.js';

const source = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('tech stack publishes the approved two-card brand-icon layout', async () => {
  const [stackSection, home, packageJson] = await Promise.all([
    source('../src/components/sections/StackSection.jsx'),
    source('../src/pages/Home.jsx'),
    source('../package.json').then(JSON.parse),
  ]);

  assert.deepEqual(profile.stack.core, [
    'Java (Spring Boot)',
    'Netty / TCP',
    'Kafka',
    'EMQX / MQTT',
    'Redis',
    'Oracle DB',
    'PostgreSQL',
    'MongoDB',
    'Elasticsearch',
  ]);
  assert.deepEqual(profile.stack.infrastructure, [
    'Kubernetes',
    'Rancher',
    'Nginx',
    'Grafana',
    'GitLab CI',
    'Linux',
    'MinIO / S3',
  ]);

  assert.equal(packageJson.dependencies['react-icons'], '^5.7.0');
  assert.match(stackSection, /Tools I ship with/);
  assert.match(stackSection, /CORE STACK/);
  assert.match(stackSection, /INFRASTRUCTURE/);
  assert.match(stackSection, /grid[^'"]*md:grid-cols-2/);
  assert.match(stackSection, /<ul[^>]*flex[^>]*flex-wrap/);
  assert.match(stackSection, /<li[^>]*rounded-full/);
  assert.match(stackSection, /aria-hidden=['"]true['"]/);
  assert.match(
    stackSection,
    /['"]EMQX \/ MQTT['"]:\s*\{\s*Icon:\s*SiMqtt,\s*color:\s*['"]text-accent2['"]\s*\}/,
  );
  assert.doesNotMatch(stackSection, /text-\[#660066\]/);
  assert.doesNotMatch(stackSection, /description|Delivery & Supporting|Tools I work with/);
  assert.match(home, /\.\.\.profile\.stack\.core/);
  assert.match(home, /\.\.\.profile\.stack\.infrastructure/);
});
