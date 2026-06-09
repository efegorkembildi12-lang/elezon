/* ELEZON — storefront catalog source. Fetches products/categories/brands/stats
   from Supabase once on mount and provides them via useCatalog(). Initial state
   is the bundled demo data (ELEZON_DATA) so there's no empty flash and the app
   works even before Supabase is configured. */

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { fetchCatalog } from '../lib/db/catalog';
import { fetchStats } from '../lib/db/stats';
import { ELEZON_DATA } from '../data/catalog';
import { defaultStats, type SiteStat } from '../data/siteStats';
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

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(ELEZON_DATA.products);
  const [categories, setCategories] = useState<Category[]>(ELEZON_DATA.categories);
  const [brands, setBrands] = useState<string[]>(ELEZON_DATA.brands);
  const [stats, setStats] = useState<SiteStat[]>(() => defaultStats());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([fetchCatalog(), fetchStats()])
      .then(([cat, st]) => {
        if (cancelled) return;
        setProducts(cat.products);
        setCategories(cat.categories);
        setBrands(cat.brands);
        setStats(st);
        setError(null);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Catalog load failed');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => load(), [load]);

  return (
    <CatalogContext.Provider value={{ products, categories, brands, stats, loading, error, refetch: load }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog(): CatalogValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within <CatalogProvider>');
  return ctx;
}
