import test from 'node:test';
import assert from 'node:assert/strict';
import { startServer, stopServer } from './helpers/server.mjs';
import { PORT } from '../scripts/config.mjs';

const BASE = `http://localhost:${PORT}`;

test('homepage renders and CSS loads', async () => {
  await startServer(PORT);
  try {
    const res = await fetch(BASE + '/');
    assert.equal(res.status, 200);
    const html = await res.text();
    assert(html.includes('Taylor Dean'), 'core content missing');
    assert(html.includes('href="/styles.css"'), 'styles.css link missing');
    const cssRes = await fetch(BASE + '/styles.css');
    assert.equal(cssRes.status, 200);
  } finally {
    await stopServer();
  }
});
