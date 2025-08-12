import { test, expect } from '@playwright/test';

const viewports = [
  { width: 375, height: 667 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 },
];

test.describe.configure({ retries: 2 });

test.beforeEach(async ({ page }) => {
  await page.route('https://fonts.googleapis.com/*', route => route.fulfill({ body: '' }));
  await page.route('https://fonts.gstatic.com/*', route => route.fulfill({ body: '' }));
});

for (const vp of viewports) {
  test(`header responsive at ${vp.width}px`, async ({ page }) => {
    await page.setViewportSize(vp);
    await page.goto('/home.html');
    const header = page.locator('header');
    await expect(header).toHaveAttribute('role', 'banner');

    await page.evaluate(() => window.scrollTo(0, 500));
    const top = await header.evaluate(el => el.getBoundingClientRect().top);
    expect(top).toBe(0);

    if (vp.width < 1024) {
      const toggle = page.locator('#menu-toggle');
      await expect(toggle).toBeVisible();
      await toggle.click();
      const panel = page.locator('#mobile-nav');
      await expect(panel).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(panel).toBeHidden();
    } else {
      await expect(page.locator('.desktop-nav')).toBeVisible();
      await expect(page.locator('#menu-toggle')).toBeHidden();
    }
  });
}
