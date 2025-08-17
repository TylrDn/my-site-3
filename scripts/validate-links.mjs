import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import http from 'node:http';
import { startServer } from './serve.mjs';
import { PORT } from './config.mjs';

const read = promisify(fs.readFile);
const root = path.resolve('public');

function extractLinks(html) {
  const links = [];
  const re = /<(?:link|script)\s+[^>]*(?:href|src)="([^"]+)"/gi;
  let m;
  while ((m = re.exec(html))) links.push(m[1]);
  return links;
}

async function existsHTTP(urlPath) {
  return new Promise((resolve) => {
    const req = http.request({ host: 'localhost', port: PORT, path: urlPath, method: 'HEAD' }, (res) => {
      resolve(res.statusCode && res.statusCode >= 200 && res.statusCode < 400);
    });
    req.on('error', () => resolve(false));
    req.end();
  });
}

async function main() {
  const server = await startServer(PORT);
  let failures = 0;
  try {
    const htmlFiles = fs.readdirSync(root).filter(f => f.endsWith('.html'));
    for (const file of htmlFiles) {
      const html = await read(path.join(root, file), 'utf8');
      const links = extractLinks(html);
      const fileDir = path.dirname(file);
      for (const href of links) {
        if (!href.startsWith('http') && !href.startsWith('mailto:')) {
          let urlPath;
          if (href.startsWith('/')) {
            urlPath = href;
          } else {
            urlPath = '/' + path.posix.join(fileDir, href);
          }
          const ok = await existsHTTP(urlPath);
          if (!ok) {
            console.error(`❌ Asset missing: ${file} → ${urlPath}`);
            failures++;
          }
        }
      }
    }
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
  if (failures) process.exit(1);
  console.log('✅ All asset links resolved.');
}
main().catch((e) => { console.error(e); process.exit(1); });
