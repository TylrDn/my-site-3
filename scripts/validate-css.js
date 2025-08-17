// Ensures each public HTML page references the global stylesheet.
// Prevents regressions where pages miss styles.css.
const fs = require('node:fs/promises');
const path = require('node:path');

(async () => {
  const publicDir = path.join(process.cwd(), 'public');
  const entries = await fs.readdir(publicDir);
  const htmlFiles = entries.filter(f => f.endsWith('.html') && f !== 'header.html');

  const missing = [];
  const linkRe = /<link\s+rel=["']stylesheet["']\s+href=["']\/styles\.css(?:\?v=[^"']+)?["']\s*\/?>/i;

  for (const file of htmlFiles) {
    const content = await fs.readFile(path.join(publicDir, file), 'utf8');
    if (!linkRe.test(content)) missing.push(file);
  }

  if (missing.length) {
    console.error('Missing stylesheet link in:', missing.join(', '));
    process.exit(1);
  }

  console.log('All HTML files reference /styles.css');
})();
