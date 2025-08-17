import { startServer } from './serve.mjs';

const PORT = process.env.PORT || 4173;

async function main() {
  const server = await startServer(PORT);
  try {
    const res = await fetch(`http://localhost:${PORT}/index.html`);
    const html = await res.text();
    let fail = false;
    if (!/<title>[^<]+<\/title>/i.test(html)) {
      console.error('❌ Missing <title> element');
      fail = true;
    }
    const imgWithoutAlt = [...html.matchAll(/<img\b[^>]*>/gi)].filter(tag => !/\balt=/.test(tag[0]));
    for (const tag of imgWithoutAlt) {
      console.error(`❌ Image missing alt attribute: ${tag[0]}`);
      fail = true;
    }
    if (fail) process.exit(1);
    console.log('✅ Basic accessibility checks passed.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    server.close();
  }
}

main();
