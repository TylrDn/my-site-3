import { spawn } from 'node:child_process';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { PORT } from '../../scripts/config.mjs';

let proc;

export async function startServer(port = PORT) {
  if (proc) return Number(port);
  proc = spawn('node', [path.join('scripts', 'serve.mjs')], {
    env: { ...process.env, PORT: String(port), NODE_ENV: 'test' },
    stdio: 'ignore',
    detached: true
  });
  await delay(300);
  return Number(port);
}

export async function stopServer() {
  if (!proc) return;
  try {
    process.kill(-proc.pid, 'SIGKILL');
  } catch {}
  proc = undefined;
}
