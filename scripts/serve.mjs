import http from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { PORT } from './config.mjs';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

export async function startServer(port = PORT, rootDir = 'public') {
  const root = path.resolve(rootDir);
  const server = http.createServer(async (req, res) => {
    const rawPath = decodeURIComponent(req.url.split('?')[0]);
    const reqPath = path.normalize(rawPath).replace(/^\/+/, '');
    let filePath = path.join(root, reqPath);
    if (!filePath.startsWith(root)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      return res.end('Forbidden');
    }
    // Normalize directory requests to always serve index.html
    let stat;
    try {
      stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }
    } catch {}
    try {
      const data = await fs.readFile(filePath);
      const ext = path.extname(filePath).toLowerCase();
      res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      if (req.method === 'HEAD') {
        res.statusCode = 200;
        return res.end();
      }
      res.statusCode = 200;
      res.end(data);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  });
  return new Promise(resolve => server.listen(port, () => resolve(server)));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startServer().then(() => {
    console.log(`Serving http://localhost:${PORT}`);
  });
}
