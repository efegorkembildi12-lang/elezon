/* ELEZON — sitemap generator (postbuild).
   Walks the prerendered dist/ tree and emits dist/sitemap.xml listing every
   public route (home, catalogue, categories, ~700 products, info pages). Reflects
   exactly what was statically generated. Excludes the admin panel and the private
   request list / privacy redirect. */

import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const SITE_URL = 'https://elezon.ru';
const DIST = 'dist';
const EXCLUDE = new Set(['/admin', '/request', '/privacy']);

function findRouteDirs(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) findRouteDirs(full, acc);
    else if (name === 'index.html') acc.push(dir);
  }
  return acc;
}

const lastmod = new Date().toISOString().slice(0, 10);

const paths = findRouteDirs(DIST)
  .map((d) => {
    const rel = relative(DIST, d).split(sep).join('/');
    return rel ? `/${rel}` : '/';
  })
  .filter((p) => p === '/' || (!p.startsWith('/admin') && !EXCLUDE.has(p)));

const unique = [...new Set(paths)].sort((a, b) =>
  a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b),
);

const urls = unique
  .map((p) => {
    // Trailing slash to match the nested-dirStyle URL GitHub Pages serves (and
    // the self-referencing canonical), so the sitemap lists no-redirect URLs.
    const loc = p === '/' ? `${SITE_URL}/` : `${SITE_URL}${encodeURI(p)}/`;
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

writeFileSync(join(DIST, 'sitemap.xml'), xml);
console.log(`[sitemap] ${unique.length} URLs written to dist/sitemap.xml`);
