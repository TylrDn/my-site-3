import http from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export async function startServer(port = 4173, rootDir = 'public') {
  const root = path.resolve(rootDir);
  const server = http.createServer(async (req, res) => {
    const rawPath = decodeURIComponent(req.url.split('?')[0]);
    const reqPath = path.normalize(rawPath).replace(/^\/+/, '');
    let filePath = path.join(root, reqPath);
    if (!filePath.startsWith(root)) {
      res.statusCode = 403;
      res.setHeader('Content-Type', 'text/plain');
      return res.end('Forbidden');
    }
    if (reqPath === '' || filePath.endsWith(path.sep)) filePath = path.join(filePath, 'index.html');
    try {
      const data = await fs.readFile(filePath);
      res.statusCode = 200;
      res.end(data);
    } catch {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Not Found');
    }
  });
  return new Promise(resolve => server.listen(port, () => resolve(server)));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startServer().then(() => {
    console.log(`Serving http://localhost:${process.env.PORT || 4173}`);
  });
}
