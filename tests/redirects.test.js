import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const cases = [
  { from: '/', to: '/home.html', status: 301 },
  { from: '/home', to: '/home.html', status: 301 },
  { from: '/about', to: '/about.html', status: 301 },
  { from: '/experience', to: '/experience.html', status: 301 },
  { from: '/projects', to: '/projects.html', status: 301 },
  { from: '/resume', to: '/resume.html', status: 301 },
  { from: '/contact', to: '/contact.html', status: 301 },
  { from: '/invest', to: '/invest.html', status: 301 },
  { from: '/404', to: '/404.html', status: 404 }
];

const config = fs.readFileSync('netlify.toml', 'utf8');

for (const c of cases) {
  test(`redirect ${c.from} -> ${c.to}`, () => {
    assert(config.includes(`from = "${c.from}"`), 'missing from');
    assert(config.includes(`to = "${c.to}"`), 'missing to');
    assert(config.includes(`status = ${c.status}`), 'missing status');
  });
}
