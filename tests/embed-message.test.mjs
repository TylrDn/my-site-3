import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

test('embed.html includes responsive iframe script and required attributes', async () => {
  const html = await readFile(path.join('public', 'embed.html'), 'utf8');
  assert.match(html, /responsive-iframe\.js/, 'responsive-iframe script is referenced');
  assert.match(html, /<iframe/i, 'iframe present');
  assert.ok(/<iframe[^>]+title=/.test(html) || /<iframe[^>]+data-ri/.test(html), 'iframe has title or data-ri');
});
