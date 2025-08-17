import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const PORT = Number(process.env.PORT || 4173);

test('iframe scales and has safe attrs', async ({ page }) => {
  const script = readFileSync(path.join('public', 'scripts', 'responsive-iframe.js'), 'utf8');
  await page.setContent(`
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>.box{width:320px;}</style>
    <div class="box">
      <div class="iframe-container" style="--iframe-aspect:4/3">
        <iframe data-ri src="data:text/html,<h1>Hi</h1>"></iframe>
      </div>
    </div>
    <script>${script}</script>
  `, { waitUntil: 'domcontentloaded' });
  const iframe = page.locator('iframe');
  await expect(iframe).toHaveAttribute('sandbox', /allow-scripts/);
  await expect(iframe).toHaveAttribute('allow', /fullscreen/);
  await expect(iframe).toHaveAttribute('loading', /lazy/);
  const ibox = page.locator('.iframe-container');
  const w = await ibox.evaluate(e => e.getBoundingClientRect().width);
  const h = await ibox.evaluate(e => e.getBoundingClientRect().height);
  expect(Math.abs(h / w - 4/3)).toBeLessThan(0.02);
});
