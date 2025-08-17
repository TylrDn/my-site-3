import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

test('embed.html includes message handler', async () => {
  const html = await fs.readFile('public/embed.html', 'utf8');
  assert(/addEventListener\(\s*['"]message['"]/m.test(html), 'missing postMessage listener');
  assert(html.includes('ALLOWED_PARENTS'), 'missing origin whitelist');
});
