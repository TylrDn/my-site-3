import test from 'node:test';
import assert from 'node:assert/strict';
import { waitForIframe } from '../src/public/waitForIframe.js';

function createStubIframe() {
  const handlers = {};
  return {
    contentWindow: {},
    complete: false,
    addEventListener(event, cb) {
      handlers[event] = cb;
    },
    removeEventListener(event) {
      delete handlers[event];
    },
    trigger(event) {
      if (handlers[event]) handlers[event]();
    },
  };
}

test('waitForIframe resolves on load', async () => {
  const iframe = createStubIframe();
  const promise = waitForIframe(iframe, { timeoutMs: 50 });
  setTimeout(() => {
    iframe.complete = true;
    iframe.trigger('load');
  }, 10);
  assert.equal(await promise, iframe.contentWindow);
});

test('waitForIframe rejects on timeout', async () => {
  const iframe = createStubIframe();
  await assert.rejects(() => waitForIframe(iframe, { timeoutMs: 10 }), /timeout/);
});
