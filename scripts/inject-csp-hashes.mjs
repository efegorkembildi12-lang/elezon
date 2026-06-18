/* ELEZON — CSP script-hash injector (postbuild).
   The storefront ships `script-src 'self'` (no 'unsafe-inline') via a <meta> CSP.
   vite-react-ssg emits small inline bootstrap scripts (router hydration data,
   build hash) that this CSP would block. This step runs on the FINAL HTML — after
   all placeholders are substituted — computes the sha256 of every inline
   executable script per page and adds 'sha256-…' to that page's script-src, so
   the hashes match the exact bytes the browser hashes. The non-executable JSON
   state island (type="application/json") is excluded. */

import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const DIST = 'dist';
const inlineScript =
  /<script(?![^>]*\bsrc=)(?![^>]*\btype=["'](?:application\/(?:ld\+)?json|importmap)["'])[^>]*>([\s\S]*?)<\/script>/gi;

function htmlFiles(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) htmlFiles(full, acc);
    else if (name.endsWith('.html')) acc.push(full);
  }
  return acc;
}

let processed = 0;
let total = 0;

for (const file of htmlFiles(DIST)) {
  const html = readFileSync(file, 'utf8');
  if (!/script-src /i.test(html)) continue; // no CSP meta on this page
  total += 1;

  const hashes = new Set();
  inlineScript.lastIndex = 0;
  let m;
  while ((m = inlineScript.exec(html)) !== null) {
    const code = m[1];
    if (!code) continue;
    hashes.add(`'sha256-${createHash('sha256').update(code, 'utf8').digest('base64')}'`);
  }

  const updated = html.replace(/script-src ([^;]*)/i, (_full, value) => {
    // Drop any previously-injected sha256 tokens (idempotent), keep the rest ('self').
    const kept = value
      .split(/\s+/)
      .filter(Boolean)
      .filter((tok) => !tok.startsWith("'sha256-"))
      .join(' ');
    const hashStr = [...hashes].join(' ');
    return `script-src ${hashStr ? `${hashStr} ` : ''}${kept}`.trim();
  });

  if (updated !== html) {
    writeFileSync(file, updated);
    processed += 1;
  }
}

console.log(`[csp] injected script hashes into ${processed}/${total} HTML files with a CSP`);
