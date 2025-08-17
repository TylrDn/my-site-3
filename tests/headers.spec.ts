import { test, expect, request } from '@playwright/test';

test('CSP frame-ancestors applied globally and overridden for embed.html', async ({ baseURL }) => {
  const api = await request.newContext();
  const respHome = await api.get(`${baseURL}/home.html`);
  expect(respHome.ok()).toBeTruthy();
  const cspHome = respHome.headers()['content-security-policy'] || '';
  expect(cspHome).toContain("frame-ancestors 'none'");

  const respEmbed = await api.get(`${baseURL}/embed.html`);
  expect(respEmbed.ok()).toBeTruthy();
  const cspEmbed = respEmbed.headers()['content-security-policy'] || '';
  expect(cspEmbed).toMatch(/frame-ancestors .*wixsite\.com .*editorx\.io/);
});

test('CORS only on HTML, long cache on assets', async ({ baseURL }) => {
  const api = await request.newContext();
  const html = await api.get(`${baseURL}/home.html`);
  expect(html.ok()).toBeTruthy();
  expect(html.headers()['access-control-allow-origin']).toBe('*');
  expect(html.headers()['cache-control']).toContain('must-revalidate');

  const css = await api.get(`${baseURL}/styles.css`);
  expect(css.ok()).toBeTruthy();
  expect(css.headers()['cache-control']).toMatch(/max-age=31536000/);

  const js = await api.get(`${baseURL}/mobile-nav.js`);
  expect(js.ok()).toBeTruthy();
  expect(js.headers()['cache-control']).toMatch(/immutable/);
});
