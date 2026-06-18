/* ELEZON — per-page state island for clean hydration under a strict CSP.

   Each prerendered page embeds the exact catalogue slice it renders as a
   NON-executable <script type="application/json"> block. The browser never
   executes it, so `script-src 'self'` does not block it. Our own bundled JS
   (CatalogProvider) reads it synchronously on first client render, so the
   client's initial tree matches the server-rendered HTML — no hydration flash,
   no inline executable state script (which the CSP would block). */

import type { CatalogBundle } from '../db/catalog';
import type { SiteStat } from '../../data/siteStats';

export const PAGE_STATE_ID = '__ELEZON_STATE__';

export interface PageStateData extends CatalogBundle {
  stats: SiteStat[];
}

/** Read the embedded slice on the client; null during SSG or on non-prerendered (404) loads. */
export function readPageState(): PageStateData | null {
  if (typeof document === 'undefined') return null;
  const el = document.getElementById(PAGE_STATE_ID);
  if (!el || !el.textContent) return null;
  try {
    return JSON.parse(el.textContent) as PageStateData;
  } catch {
    return null;
  }
}

// Escape '<' so a literal "</script>" inside the data can't break out of the island.
function serialize(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/** Renders the JSON island. Place once per page with the slice that page consumes. */
export function PageState({ data }: { data: PageStateData }) {
  return (
    <script
      type="application/json"
      id={PAGE_STATE_ID}
      dangerouslySetInnerHTML={{ __html: serialize(data) }}
    />
  );
}
