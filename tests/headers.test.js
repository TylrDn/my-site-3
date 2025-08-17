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

test('embed.html exposes required CORS headers', () => {
  const block = findHeaderBlock('/embed.html');
  assert(block, 'header block missing');
  assert(block.includes('Access-Control-Allow-Origin'), 'CORS header missing');
});

test('all html files allow CORS', () => {
  const block = findHeaderBlock('/*.html');
  assert(block, 'html header block missing');
  assert(block.includes('Access-Control-Allow-Origin'), 'CORS header missing');
});
