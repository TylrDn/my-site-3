import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { startServer, stopServer } from './helpers/server.mjs';

const PORT = process.env.PORT || 4173;

before(async () => {
  await startServer(PORT);
});

after(async () => {
  await stopServer();
});

test('embed.html includes responsive iframe script and required attributes', async () => {
  const html = await readFile(path.join('public', 'embed.html'), 'utf8');
  assert.match(html, /responsive-iframe\.js/, 'responsive-iframe script is referenced');
  assert.match(html, /<iframe/i, 'iframe present');
  assert.ok(/<iframe[^>]+title=/.test(html) || /<iframe[^>]+data-ri/.test(html), 'iframe has title or data-ri');
});
