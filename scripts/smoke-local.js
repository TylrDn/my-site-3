// Serves the site locally and verifies key assets load.
// Tries to use `serve` if installed, otherwise falls back to a tiny Node server.
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const port = 3000;
const publicDir = path.join(process.cwd(), 'public');

function startFallback() {
  return http.createServer((req, res) => {
    const target = req.url === '/' ? '/home.html' : req.url;
    const file = path.join(publicDir, target);
    fs.readFile(file, (err, data) => {
      if (err) {
        res.statusCode = 404;
        return res.end();
      }
      if (file.endsWith('.css')) res.setHeader('Content-Type', 'text/css');
      if (file.endsWith('.html')) res.setHeader('Content-Type', 'text/html');
      res.end(data);
    });
  }).listen(port);
}

function request(p) {
  return new Promise((resolve, reject) => {
    http.get({ host: 'localhost', port, path: p }, res => {
      res.on('data', () => {});
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers }));
    }).on('error', reject);
  });
}

const serveBin = path.join('node_modules', '.bin', process.platform === 'win32' ? 'serve.cmd' : 'serve');
let serverProc;
let server;
if (fs.existsSync(serveBin)) {
  serverProc = spawn(serveBin, ['-l', String(port), 'public'], { stdio: 'ignore' });
} else {
  server = startFallback();
}

const delay = ms => new Promise(r => setTimeout(r, ms));
async function waitForServer(retries = 50) {
  for (let i = 0; i < retries; i++) {
    try {
      await request('/');
      return;
    } catch {}
    await delay(100);
  }
  throw new Error('Server did not start');
}

(async () => {
  await waitForServer();
  try {
    const root = await request('/');
    if (root.status !== 200) throw new Error('/ status ' + root.status);
    if (!(root.headers['content-type'] || '').includes('text/html')) {
      throw new Error('/ content-type ' + root.headers['content-type']);
    }
    const page = await request('/home.html');
    if (page.status !== 200) throw new Error('home.html status ' + page.status);
    const css = await request('/styles.css');
    if (css.status !== 200) throw new Error('styles.css status ' + css.status);
    if (!(css.headers['content-type'] || '').includes('text/css')) {
      throw new Error('styles.css content-type ' + css.headers['content-type']);
    }
    console.log('Local smoke test passed');
  } finally {
    if (serverProc) serverProc.kill();
    if (server) server.close();
  }
})();

