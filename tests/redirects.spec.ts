import { test, expect } from '@playwright/test';
import fs from 'fs';

type Case = { from: string; to: string; status: number };

const cases: Case[] = [
  { from: '/', to: '/home.html', status: 301 },
  { from: '/home', to: '/home.html', status: 301 },
  { from: '/about', to: '/about.html', status: 301 },
  { from: '/experience', to: '/experience.html', status: 301 },
  { from: '/projects', to: '/projects.html', status: 301 },
  { from: '/resume', to: '/resume.html', status: 301 },
  { from: '/contact', to: '/contact.html', status: 301 },
  { from: '/invest', to: '/invest.html', status: 301 },
  { from: '/404', to: '/404.html', status: 404 },
];

const config = fs.readFileSync('netlify.toml', 'utf8');

for (const c of cases) {
  test(`redirect ${c.from} -> ${c.to}`, () => {
    const snippet = `from = "${c.from}"`;
    expect(config).toContain(snippet);
    expect(config).toContain(`to = "${c.to}"`);
    expect(config).toContain(`status = ${c.status}`);
  });
}
