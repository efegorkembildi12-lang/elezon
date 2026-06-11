// ELEZON — GitHub Pages SPA fallback.
// GitHub Pages has no rewrite rules, so a direct hit / refresh on a client-side
// route (e.g. /catalog/123, /product/x) would 404. Copying the built index.html
// to 404.html makes Pages serve the SPA shell for any unmatched path; the
// storefront's BrowserRouter then renders the correct page from the URL.
// Runs automatically after `npm run build` (see package.json "postbuild").

import { copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const dist = resolve(process.cwd(), 'dist');
await copyFile(resolve(dist, 'index.html'), resolve(dist, '404.html'));
console.log('[spa-fallback] dist/404.html written');
