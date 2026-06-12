// ELEZON — one-off scraper for the OLD live site (1C-Bitrix) at elezon.ru.
// Preserves the product catalogue before the domain is repointed to the new
// site. Walks the sitemap, fetches every /catalog/ page, and extracts product
// fields (name, article, category, specs, image URLs) into JSON + CSV.
//
// Run:  node scripts/scrape-old-site.mjs
// Out:  scrape/old-site/products.json, products.csv, sections.json, images.txt

import { writeFile, mkdir } from 'node:fs/promises';

const ORIGIN = 'https://elezon.ru';
const SITEMAPS = [`${ORIGIN}/sitemap-iblock-23.xml`];
const UA = 'Mozilla/5.0 (compatible; elezon-catalog-backup/1.0)';
const CONCURRENCY = 6;
const OUT_DIR = 'scrape/old-site';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getText(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (e) {
      if (attempt === 2) throw e;
      await sleep(800 * (attempt + 1));
    }
  }
  return '';
}

function decode(s) {
  return (s || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function parseProduct(url, html) {
  const name = decode((html.match(/<h1[^>]*id="pagetitle"[^>]*>([\s\S]*?)<\/h1>/i) || [])[1]);

  let article = '';
  const am = html.match(/Артикул:<\/span>([\s\S]{0,160}?)<\/(?:div|span|li|p)>/i);
  if (am) article = decode(am[1]);

  // Spec pairs — Bitrix renders js-prop-title (label) then js-prop-value (value) in order.
  const titles = [...html.matchAll(/js-prop-title[^>]*>([\s\S]*?)<\/[^>]+>/gi)].map((m) => decode(m[1]).replace(/[:\s—–]+$/, ''));
  const values = [...html.matchAll(/js-prop-value[^>]*>([\s\S]*?)<\/[^>]+>/gi)].map((m) => decode(m[1]));
  const specs = {};
  for (let i = 0; i < Math.min(titles.length, values.length); i++) {
    if (titles[i]) specs[titles[i]] = values[i];
  }

  // Category — from breadcrumb (drop Главная/Каталог and the product itself).
  const crumbs = [...new Set([...html.matchAll(/breadcrumbs__item-name[^>]*>([^<]{1,80})/gi)].map((m) => decode(m[1])))];
  const trail = crumbs.filter((c) => c && c !== 'Главная' && c !== 'Каталог');
  const category = trail.length >= 2 ? trail[trail.length - 2] : (trail[0] || '');

  // Category slug from the URL too (more stable than breadcrumb text).
  const seg = url.replace(`${ORIGIN}/catalog/`, '').replace(/\/$/, '').split('/');
  const categorySlug = seg.length >= 2 ? seg[0] : '';

  const price = decode((html.match(/itemprop="price"[^>]*content="([^"]*)"/i) || [])[1]);

  // Images — keep originals (under /upload/), skip derived resize_cache thumbnails.
  const images = [...new Set(
    [...html.matchAll(/src="(\/upload\/[^"]+\.(?:jpe?g|png|webp))"/gi)]
      .map((m) => m[1])
      .filter((p) => !p.includes('/resize_cache/'))
      .map((p) => ORIGIN + p),
  )];

  const isProduct = !!(article || titles.length);
  return { url, name, article, category, categorySlug, price, image: images[0] || '', images, specs, isProduct };
}

async function pool(items, worker) {
  const out = new Array(items.length);
  let i = 0;
  const runners = Array.from({ length: CONCURRENCY }, async () => {
    while (i < items.length) {
      const idx = i++;
      try { out[idx] = await worker(items[idx], idx); }
      catch (e) { out[idx] = { error: String(e), url: items[idx] }; }
    }
  });
  await Promise.all(runners);
  return out;
}

async function main() {
  // 1) Collect catalog URLs from the sitemaps.
  const urls = [];
  for (const sm of SITEMAPS) {
    const xml = await getText(sm);
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      if (m[1].includes('/catalog/')) urls.push(m[1]);
    }
  }
  console.log(`[scrape] ${urls.length} catalog URLs from sitemap`);

  // 2) Fetch + parse each, reporting progress.
  let done = 0;
  const parsed = await pool(urls, async (url) => {
    const html = await getText(url);
    const rec = parseProduct(url, html);
    if (++done % 25 === 0) console.log(`[scrape] ${done}/${urls.length}`);
    return rec;
  });

  const ok = parsed.filter((r) => r && !r.error);
  const products = ok.filter((r) => r.isProduct).map(({ isProduct, ...r }) => r);
  const sections = ok.filter((r) => !r.isProduct).map((r) => ({ url: r.url, name: r.name }));
  const errors = parsed.filter((r) => r && r.error);

  // 3) Write outputs.
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(`${OUT_DIR}/products.json`, JSON.stringify(products, null, 2));
  await writeFile(`${OUT_DIR}/sections.json`, JSON.stringify(sections, null, 2));

  const allImages = [...new Set(products.flatMap((p) => p.images))];
  await writeFile(`${OUT_DIR}/images.txt`, allImages.join('\n') + '\n');

  // CSV: flat columns + specs serialised as "key: value | key: value".
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csvRows = [['name', 'article', 'category', 'categorySlug', 'price', 'image', 'specs', 'url'].join(',')];
  for (const p of products) {
    const specsStr = Object.entries(p.specs).map(([k, v]) => `${k}: ${v}`).join(' | ');
    csvRows.push([p.name, p.article, p.category, p.categorySlug, p.price, p.image, specsStr, p.url].map(esc).join(','));
  }
  await writeFile(`${OUT_DIR}/products.csv`, '﻿' + csvRows.join('\n') + '\n');

  console.log(`\n[scrape] DONE`);
  console.log(`  products: ${products.length}`);
  console.log(`  sections: ${sections.length}`);
  console.log(`  images:   ${allImages.length}`);
  console.log(`  errors:   ${errors.length}`);
  console.log(`  → ${OUT_DIR}/products.json | products.csv | images.txt`);
  if (errors.length) console.log('  failed:', errors.slice(0, 5).map((e) => e.url));
}

main().catch((e) => { console.error(e); process.exit(1); });
