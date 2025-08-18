import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const config = fs.readFileSync('netlify.toml', 'utf8');

function findHeaderBlock(forPath) {
  return config
    .split('[[headers]]')
    .map(block => block.trim())
    .find(block => block.startsWith(`for = "${forPath}"`));
}

test('global headers include CSP', () => {
  const block = findHeaderBlock('/*');
  assert(block, 'header block missing');
  assert(block.includes('Content-Security-Policy'), 'CSP header missing');
});
