import test from 'node:test';
import assert from 'node:assert/strict';
import { patternToRegex, isAllowedOrigin } from '../src/config/origins.js';

test('patternToRegex handles wildcard and escapes dots', () => {
  const r = patternToRegex('https://*.macrosight.net');
  assert.ok(r.test('https://sub.macrosight.net'));
  assert.ok(!r.test('https://a.b.macrosight.net'));
  assert.ok(!r.test('https://macrosight.net'));
});

test('isAllowedOrigin matches allowed origins only', () => {
  assert.ok(isAllowedOrigin('https://www.wix.com'));
  assert.ok(isAllowedOrigin('https://sub.wixsite.com'));
  assert.ok(!isAllowedOrigin('https://evilwix.com'));
});
