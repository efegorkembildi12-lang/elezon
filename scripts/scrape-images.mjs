// ELEZON — re-scrape the REAL per-product image from the old live site.
// The first pass grabbed the generic CMax placeholder (page <img src>); the real
// product photo lives in the <meta property="og:image"> tag. This walks every
// product URL in products.json, extracts og:image, downloads it to
// public/images/products/<id>.<ext>, and writes the filename back into
// products.json as `imageFile` so the import SQL can fill products.image_url.
//
// Run:  node scripts/scrape-images.mjs
// Out:  public/images/products/*.jpg|png  +  updated scrape/old-site/products.json

import { writeFile, mkdir, readFile } from 'node:fs/promises';

const ORIGIN = 'https://elezon.ru';
const UA = 'Mozilla/5.0 (compatible; elezon-catalog-backup/1.0)';
const CONCURRENCY = 6;
const SRC = 'scrape/old-site/products.json';
const IMG_DIR = 'public/images/products';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const idOf = (url) => { const s = url.replace(/\/$/, '').split('/'); return s[s.length - 1] || ''; };

async function fetchRetry(url, asBuffer = false) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return asBuffer ? Buffer.from(await res.arrayBuffer()) : await res.text();
    } catch (e) {
      if (attempt === 2) throw e;
      await sleep(800 * (attempt + 1));
    }
  }
}

function ogImage(html) {
  const m = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  let src = m ? m[1] : '';
  if (src && src.startsWith('/')) src = ORIGIN + src;
  // Reject the known generic placeholder so callers can fall back.
  if (src.includes('/CMax/')) src = '';
  return src;
}

async function pool(items, worker) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (i < items.length) {
      const idx = i++;
      try { out[idx] = await worker(items[idx], idx); }
      catch (e) { out[idx] = { error: String(e) }; }
    }
  }));
  return out;
}

async function main() {
  const products = JSON.parse(await readFile(SRC, 'utf8'));
  await mkdir(IMG_DIR, { recursive: true });
  console.log(`[img] ${products.length} products → extracting og:image`);

  // Keep ids unique exactly the way gen-real-import does (suffix collisions by index).
  const seenId = new Set();
  const ids = products.map((p, idx) => {
    let id = idOf(p.url);
    while (seenId.has(id)) id = id + '-' + idx;
    seenId.add(id);
    return id;
  });

  let done = 0, withImg = 0, noOg = 0, failed = 0;
  const results = await pool(products, async (p, idx) => {
    const html = await fetchRetry(p.url);
    const src = ogImage(html);
    if (++done % 25 === 0) console.log(`[img] ${done}/${products.length}`);
    if (!src) { noOg++; return { imageFile: '' }; }
    const ext = (src.match(/\.(jpe?g|png|webp)(?:\?|$)/i) || [, 'jpg'])[1].toLowerCase().replace('jpeg', 'jpg');
    const file = `${ids[idx]}.${ext}`;
    try {
      const buf = await fetchRetry(src, true);
      await writeFile(`${IMG_DIR}/${file}`, buf);
      withImg++;
      return { imageFile: file, imageSrc: src };
    } catch (e) {
      failed++;
      return { imageFile: '', error: String(e) };
    }
  });

  // Write the resolved filename back into products.json.
  const updated = products.map((p, idx) => ({ ...p, imageFile: results[idx]?.imageFile || '' }));
  await writeFile(SRC, JSON.stringify(updated, null, 2));

  console.log(`\n[img] DONE`);
  console.log(`  downloaded:  ${withImg}/${products.length}`);
  console.log(`  no og:image: ${noOg}`);
  console.log(`  failed dl:   ${failed}`);
  console.log(`  → ${IMG_DIR}/  +  ${SRC} (imageFile added)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
