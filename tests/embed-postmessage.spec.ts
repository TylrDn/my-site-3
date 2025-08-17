import { test, expect } from '@playwright/test';
import { chromium } from 'playwright-core';
import fs from 'fs';

const browserInstalled = fs.existsSync(chromium.executablePath());
test.skip(!browserInstalled, 'Chromium browser not installed');

const parentHtml = (embedUrl: string) => `
<!doctype html>
<html><body>
<iframe id="child" src="${embedUrl}" style="width:800px;height:400px;border:0"></iframe>
<script>
  window.send = (payload) => {
    const f = document.getElementById('child');
    f.contentWindow.postMessage(payload, '*');
  };
</script>
</body></html>`;

test('allowed origin renders provided HTML', async ({ page, baseURL }) => {
  await page.setContent(parentHtml(`${baseURL}/embed.html`), { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => window.send('<div id="ok">Hi</div>'));
  const frame = page.frameLocator('#child');
  await expect(frame.locator('#ok')).toBeVisible();
});

test('script injection from allowed origin is rejected', async ({ page, baseURL }) => {
  await page.setContent(parentHtml(`${baseURL}/embed.html`), { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => window.send('<div id="bad"><script>window.hacked=1</script></div>'));
  const frame = page.frameLocator('#child');
  await expect(frame.locator('#bad')).toHaveCount(0);
  const bodyText = await frame.locator('body').textContent();
  expect(bodyText || '').toContain('content failed to load');
  const hacked = await frame.evaluate(() => (window as any).hacked);
  expect(hacked).toBeUndefined();
});

test('disallowed origin message is ignored', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/embed.html`);
  await page.evaluate(() => {
    window.dispatchEvent(new MessageEvent('message', {
      data: '<div id="hack">Hi</div>',
      origin: 'https://evil.example',
      source: window
    }));
  });
  await expect(page.locator('#hack')).toHaveCount(0);
  await expect(page.locator('.loader')).toBeVisible();
});
