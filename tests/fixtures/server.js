'use strict';
// Tiny static server that mirrors intended Netlify headers for tests.
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const root = path.join(__dirname, '..', '..', 'public');
const PORT = process.env.PORT || 4173;

// Simple content-type mapping (no external deps).
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
};

// ---- Header policies modeled after netlify.toml ----
const globalHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // Default deny framing everywhere:
  'Content-Security-Policy':
    "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none';",
};

const perPathOverrides = new Map([
  ['/embed.html', {
    'Content-Security-Policy':
      "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' https://cdn.jsdelivr.net; connect-src 'self' https://www.macrosight.net https://macrosight.netlify.app; frame-ancestors https://*.wixsite.com https://*.editorx.io; base-uri 'self'; form-action 'self'; object-src 'none';",
  }],
  ['/resume.html', {
    'Content-Security-Policy':
      "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; frame-ancestors https://*.wixsite.com https://*.editorx.io; base-uri 'self'; form-action 'self'; object-src 'none';",
  }],
  ['/invest.html', {
    'Content-Security-Policy':
      "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; frame-ancestors https://*.wixsite.com https://*.editorx.io; base-uri 'self'; form-action 'self'; object-src 'none';",
  }],
]);

const server = http.createServer((req, res) => {
  const { pathname = '/' } = url.parse(req.url);
  const safePath = path.normalize(pathname).replace(/^\/+/, '');
  const filePath = path.join(root, safePath);
  if (!filePath.startsWith(root)) {
    res.statusCode = 403;
    return res.end('Forbidden');
  }

  // Apply headers
  for (const [k, v] of Object.entries(globalHeaders)) res.setHeader(k, v);
  const override = perPathOverrides.get(pathname);
  if (override) for (const [k, v] of Object.entries(override)) res.setHeader(k, v);

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.statusCode = 404;
      return res.end('Not found');
    }
    const ext = path.extname(filePath);
    const type = mimeTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', type);

    if (ext === '.html') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Vary', 'Origin');
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    } else if (/\.(css|js|svg|png|jpg|jpeg|webp|avif|ico)$/.test(ext)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }

    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Test server listening at http://localhost:${PORT}`);
});
