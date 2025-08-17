#!/usr/bin/env node
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const DIR = path.join(process.cwd(), 'public');
const allow = new Set(['embed.html', 'resume.html', 'invest.html']);
const offenders = [];

for (const f of readdirSync(DIR).filter(f => f.endsWith('.html'))) {
  const txt = readFileSync(path.join(DIR, f), 'utf8');
  if ((/postMessage|addEventListener\s*\(\s*['"]message['"]/).test(txt) && !allow.has(f)) {
    offenders.push(f);
  }
}

if (offenders.length) {
  console.error('❌ Unexpected message listeners in:', offenders.join(', '));
  process.exit(1);
}

console.log('✅ No unexpected postMessage listeners found in static HTML');
