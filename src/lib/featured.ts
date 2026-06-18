/* ELEZON — homepage "popular" rail selection.
   Shared between the rail render and the embedded per-page slice so the client's
   first render matches the prerendered HTML (the selection is idempotent: re-running
   it on its own output returns the same list). Prefer admin-picked featured
   products; fall back to in-stock, then to any — most of the real catalogue is
   "on order", so an in-stock-only rail would be empty. */

import type { Product } from '../types';

export function featuredRail(products: Product[]): Product[] {
  const featured = products.filter((p) => p.featured);
  const inStock = products.filter((p) => p.stock === 'in');
  return (featured.length ? featured : inStock.length ? inStock : products).slice(0, 8);
}
