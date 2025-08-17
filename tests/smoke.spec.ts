import { test, expect } from '@playwright/test';

test('homepage renders with CSS applied', async ({ page }) => {
  await page.goto('/');
  // Core content appears
  await expect(page.getByText('Taylor Dean')).toBeVisible();

  // CSS file loads with 200
  const [resp] = await Promise.all([
    page.waitForResponse(r => r.url().endsWith('/styles.css') && r.status() === 200),
    // Trigger network by reading computed style
    page.addStyleTag({ content: '' })
  ]);
  expect(resp.ok()).toBeTruthy();

  // A styled element has non-default computed styles
  const fontWeight = await page.evaluate(() => {
    const el = document.querySelector('h1, h2');
    return el ? getComputedStyle(el).fontWeight : '0';
  });
  expect(Number(fontWeight)).toBeGreaterThanOrEqual(500);
});
