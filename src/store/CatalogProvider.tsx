/* ELEZON — storefront catalog source.

   Seeds its initial state so prerendered HTML and the first client render match:
   1. Client, prerendered page: the per-page <script type="application/json"> island.
   2. Build (SSG render): the full catalogue fetched once in the ViteReactSSG setup.
   3. Fallback (SPA-fallback / Supabase unconfigured): the bundled demo data.

   After hydration it refetches the full, current catalogue from Supabase so
   client-side navigation has every product (the island is only this page's slice). */

import { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from 'react';
import { fetchCatalog } from '../lib/db/catalog';
import { fetchStats } from '../lib/db/stats';
import { ELEZON_DATA } from '../data/catalog';
import { defaultStats, type SiteStat } from '../data/siteStats';
import { getBuildData } from '../lib/ssg/buildData';
import { readPageState, type PageStateData } from '../lib/ssg/pageState';
import type { Product, Category } from '../types';

interface CatalogValue {
  products: Product[];
  categories: Category[];
  brands: string[];
  stats: SiteStat[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const CatalogContext = createContext<CatalogValue | null>(null);

/** Seed order: client island → build cache → bundled demo. */
function seedData(): PageStateData {
  const embedded = readPageState();
  if (embedded) return embedded;
  const build = getBuildData();
  if (build) return build;
  return {
    products: ELEZON_DATA.products,
    categories: ELEZON_DATA.categories,
    brands: ELEZON_DATA.brands,
    stats: defaultStats(),
  };
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PageStateData>(seedData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([fetchCatalog(), fetchStats()])
      .then(([cat, st]) => {
        if (cancelled) return;
        setData({ ...cat, stats: st });
        setError(null);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Catalog load failed');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // Effects run on the client only — refresh to the full catalogue after hydration.
  useEffect(() => load(), [load]);

  const value = useMemo<CatalogValue>(
    () => ({
      products: data.products,
      categories: data.categories,
      brands: data.brands,
      stats: data.stats,
      loading,
      error,
      refetch: load,
    }),
    [data, loading, error, load],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within <CatalogProvider>');
  return ctx;
}
