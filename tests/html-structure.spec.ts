import { test, expect } from '@playwright/test';
import { chromium } from 'playwright-core';
import fs from 'fs';

const browserInstalled = fs.existsSync(chromium.executablePath());
test.skip(!browserInstalled, 'Chromium browser not installed');

const pages = ['/home.html', '/about.html'];

test.beforeEach(async ({ page }) => {
  await page.route('https://fonts.googleapis.com/*', route => route.fulfill({ body: '' }));
  await page.route('https://fonts.gstatic.com/*', route => route.fulfill({ body: '' }));
});

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
