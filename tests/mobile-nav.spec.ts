import { test, expect } from '@playwright/test';
import { chromium } from 'playwright-core';
import fs from 'fs';

const browserInstalled = fs.existsSync(chromium.executablePath());
test.skip(!browserInstalled, 'Chromium browser not installed');

test.describe.configure({ retries: 2 });
test.use({ viewport: { width: 375, height: 667 } });

test.beforeEach(async ({ page }) => {
  await page.route('https://fonts.googleapis.com/*', route => route.fulfill({ body: '' }));
  await page.route('https://fonts.gstatic.com/*', route => route.fulfill({ body: '' }));
});

test('mobile menu overlay behaviour', async ({ page }) => {
  await page.goto('/home.html');
  await page.waitForSelector('#menu-toggle');
  const toggle = page.locator('#menu-toggle');
  await toggle.click();

  await page.waitForSelector('#mobile-nav');
  const panel = page.locator('#mobile-nav');
  await expect(panel).toBeVisible();

  const height = await panel.evaluate(el => el.getBoundingClientRect().height);
  const vh = await page.evaluate(() => window.innerHeight);
  expect(Math.abs(height - vh)).toBeLessThan(vh * 0.02);
  const position = await panel.evaluate(el => getComputedStyle(el).position);
  expect(position).toBe('fixed');

  await panel.evaluate(el => el.scrollTo(0, 100));
  const scrollTop = await page.evaluate(() => document.scrollingElement.scrollTop);
  expect(scrollTop).toBe(0);

  const closeBtn = panel.locator('.close-nav');
  await expect(closeBtn).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  const lastLink = panel.locator('nav a').last();
  await expect(lastLink).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(closeBtn).toBeFocused();

  const firstLink = panel.locator('nav a').first();
  const box = await firstLink.boundingBox();
  expect(box?.height || 0).toBeGreaterThanOrEqual(44);
  expect(box?.width || 0).toBeGreaterThanOrEqual(44);

  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(toggle).toBeFocused();

  await toggle.click();
  await panel.click({ position: { x: 5, y: 5 } });
  await expect(panel).toBeHidden();
  await expect(toggle).toBeFocused();
});
