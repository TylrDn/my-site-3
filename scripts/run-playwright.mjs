#!/usr/bin/env node
import { spawn } from 'node:child_process';

async function main() {
  try {
    await import('@playwright/test');
  } catch {
    console.log('[@playwright/test] not installed; skipping e2e tests.');
    return;
  }
  const args = process.argv.slice(2);
  const child = spawn('npx', ['playwright', 'test', ...args], { stdio: 'inherit', shell: true });
  child.on('exit', code => process.exit(code));
}

main();
