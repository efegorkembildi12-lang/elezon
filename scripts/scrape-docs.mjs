// ELEZON — scrape per-product documents (datasheets/PDFs) from the old live site.
// Each product page has a "Документы" block listing files:
//   <a class="dark_link" href="/upload/iblock/....pdf">Title</a>
//   <span class="size ...">2,3 мб</span>
// Pass 1 (default): collect metadata only, report distinct count + total size so we
// can pick a host. Pass 2 (--download): fetch the files into public/docs/products/
// and write `documents:[{title,file}]` back into products.json.
//
// Run:  node scripts/scrape-docs.mjs            (measure only)
//       node scripts/scrape-docs.mjs --download (download + update products.json)

import { writeFile, mkdir, readFile } from 'node:fs/promises';

const ORIGIN = 'https://elezon.ru';
const UA = 'Mozilla/5.0 (compatible; elezon-catalog-backup/1.0)';
const CONCURRENCY = 6;
const SRC = 'scrape/old-site/products.json';
const DOC_DIR = 'public/docs/products';
const DOWNLOAD = process.argv.includes('--download');

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

const decode = (s) => (s || '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();

// "2,3 мб" / "323,8 кб" / "1,1 гб" -> bytes
function sizeToBytes(txt) {
  const m = (txt || '').toLowerCase().replace(',', '.').match(/([\d.]+)\s*(гб|мб|кб|б)/);
  if (!m) return 0;
  const n = parseFloat(m[1]);
  return { 'гб': n * 1e9, 'мб': n * 1e6, 'кб': n * 1e3, 'б': n }[m[2]] || 0;
}

// Extract the documents listed on a product page.
function parseDocs(html) {
  // Narrow to the "Документы" ordered block so we don't catch unrelated links.
  const blockStart = html.search(/ordered-block[^>]*>\s*<div class="ordered-block__title[^>]*>\s*Документы/i);
  const region = blockStart >= 0 ? html.slice(blockStart, blockStart + 8000) : '';
  const docs = [];
  const re = /<a[^>]+href="(\/upload\/[^"]+\.(?:pdf|docx?|xlsx?|zip))"[^>]*class="[^"]*dark_link[^"]*"[^>]*>([\s\S]*?)<\/a>\s*<span class="size[^"]*">([\s\S]*?)<\/span>/gi;
  for (const m of region.matchAll(re)) {
    const src = ORIGIN + m[1];
    const ext = m[1].split('.').pop().toLowerCase();
    docs.push({ title: decode(m[2]) || 'Документ', src, ext, bytes: sizeToBytes(decode(m[3])) });
  }
  return docs;
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
  if (DOWNLOAD) await mkdir(DOC_DIR, { recursive: true });
  console.log(`[docs] ${products.length} products — scanning "Документы" blocks${DOWNLOAD ? ' + downloading' : ' (measure only)'}`);

  const seenId = new Set();
  const ids = products.map((p, idx) => {
    let id = idOf(p.url);
    while (seenId.has(id)) id = id + '-' + idx;
    seenId.add(id);
    return id;
  });

  let done = 0, withDocs = 0, totalLinks = 0, downloaded = 0;
  const bySrc = new Map(); // src -> { bytes, file }  (dedupe shared datasheets)

  const results = await pool(products, async (p, idx) => {
    const html = await fetchRetry(p.url);
    const docs = parseDocs(html);
    if (++done % 25 === 0) console.log(`[docs] ${done}/${products.length}`);
    if (docs.length) withDocs++;
    totalLinks += docs.length;

    const out = [];
    for (let d = 0; d < docs.length; d++) {
      const doc = docs[d];
      let entry = bySrc.get(doc.src);
      if (!entry) {
        const file = `${ids[idx]}${docs.length > 1 ? '-' + (d + 1) : ''}.${doc.ext}`;
        entry = { bytes: doc.bytes, file };
        bySrc.set(doc.src, entry);
        if (DOWNLOAD) {
          try { await writeFile(`${DOC_DIR}/${entry.file}`, await fetchRetry(doc.src, true)); downloaded++; }
          catch { entry.file = ''; }
        }
      }
      if (!DOWNLOAD || entry.file) out.push({ title: doc.title, file: entry.file });
    }
    return out;
  });

  const distinct = bySrc.size;
  const totalBytes = [...bySrc.values()].reduce((s, e) => s + (e.bytes || 0), 0);

  if (DOWNLOAD) {
    const updated = products.map((p, idx) => ({ ...p, documents: results[idx]?.error ? [] : (results[idx] || []) }));
    await writeFile(SRC, JSON.stringify(updated, null, 2));
  }

  console.log(`\n[docs] ${DOWNLOAD ? 'DONE' : 'MEASURE'}`);
  console.log(`  products with docs: ${withDocs}/${products.length}`);
  console.log(`  total doc links:    ${totalLinks}`);
  console.log(`  distinct files:     ${distinct}`);
  console.log(`  total size:         ${(totalBytes / 1e6).toFixed(1)} MB (from listed sizes)`);
  if (DOWNLOAD) console.log(`  downloaded:         ${downloaded} → ${DOC_DIR}/  + products.json (documents added)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
