import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

test('embed.html includes message handler', async () => {
  const html = await fs.readFile('public/embed.html', 'utf8');
  assert(html.includes('addEventListener("message"'), 'missing postMessage listener');
  assert(html.includes('ALLOWED_ORIGINS'), 'missing origin whitelist');
});
