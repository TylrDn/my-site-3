import { test, expect } from '@playwright/test';

type Case = { from: string; to: string; status: number };

const cases: Case[] = [
  { from: '/', to: '/home.html', status: 200 },
  { from: '/home', to: '/home.html', status: 200 },
  { from: '/about', to: '/about.html', status: 200 },
  { from: '/experience', to: '/experience.html', status: 200 },
  { from: '/projects', to: '/projects.html', status: 200 },
  { from: '/resume', to: '/resume.html', status: 200 },
  { from: '/contact', to: '/contact.html', status: 200 },
  { from: '/invest', to: '/invest.html', status: 200 },
  { from: '/404', to: '/404.html', status: 404 },
];

for (const c of cases) {
  test(`redirect ${c.from} -> ${c.to}`, async ({ request }) => {
    const res = await request.get(c.from);
    expect(res.status()).toBe(c.status);
    const url = new URL(res.url());
    expect(url.pathname).toBe(c.to);
  });
}
