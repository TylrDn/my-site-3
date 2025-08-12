import { test, expect } from '@playwright/test';

const pages = ['/home.html', '/about.html'];

test.describe('HTML structure', () => {
  for (const path of pages) {
    test(`validate structure for ${path}`, async ({ page }) => {
      await page.goto(path);
      const badHeadScripts = await page.$$eval(
        'head script:not([type="application/ld+json"])',
        els => els.length
      );
      expect(badHeadScripts).toBe(0);

      const linksInBody = await page.$$eval('body link[rel="stylesheet"]', els => els.length);
      expect(linksInBody).toBe(0);
    });
  }
});
