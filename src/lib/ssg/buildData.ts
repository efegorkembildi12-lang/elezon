/* ELEZON — build-time (SSG) catalog cache.
   Populated once before rendering in the ViteReactSSG setup (`fn`), then read
   synchronously by CatalogProvider during render-to-string so prerendered HTML
   contains the real catalogue. Never used on the client (the client seeds from
   the per-page JSON island, see pageState.tsx). */

import { fetchCatalog, type CatalogBundle } from '../db/catalog';
import { fetchStats } from '../db/stats';
import type { SiteStat } from '../../data/siteStats';

export interface BuildData extends CatalogBundle {
  stats: SiteStat[];
}

let cache: BuildData | null = null;
let inflight: Promise<BuildData> | null = null;

/** Fetch the full catalogue + stats once; reused across getStaticPaths and setup. */
export function loadBuildData(): Promise<BuildData> {
  if (!inflight) {
    inflight = Promise.all([fetchCatalog(), fetchStats()]).then(([bundle, stats]) => {
      cache = { ...bundle, stats };
      return cache;
    });
  }
  return inflight;
}

/** Synchronous accessor for the cached build data (null until loadBuildData resolves). */
export function getBuildData(): BuildData | null {
  return cache;
}
