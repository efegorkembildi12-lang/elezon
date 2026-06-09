/* ELEZON — catalog search matching. Single source of truth shared by the
   search autocomplete (SearchBox) and the catalog query filter (Catalog). */

import { ELEZON_DATA } from '../data/catalog';
import type { Product, Category } from '../types';

type Translate = (s: string) => string;

const norm = (s: string): string => s.toLowerCase().trim();

/** Case-insensitive match across article, name (RU + translated), type and brand. */
export function matchProduct(p: Product, q: string, t: Translate): boolean {
  const needle = norm(q);
  if (!needle) return true;
  const hay = [p.article, p.name, t(p.name), p.type, t(p.type), p.brand].map(norm);
  return hay.some((h) => h.includes(needle));
}

export interface Suggestions {
  products: Product[];
  categories: Category[];
}

/** Top suggestions for the autocomplete dropdown. */
export function searchSuggestions(q: string, t: Translate, limit = 6): Suggestions {
  const needle = norm(q);
  if (!needle) return { products: [], categories: [] };
  const products = ELEZON_DATA.products.filter((p) => matchProduct(p, q, t)).slice(0, limit);
  const categories = ELEZON_DATA.categories
    .filter((c) => [c.name, t(c.name), c.short, t(c.short)].map(norm).some((h) => h.includes(needle)))
    .slice(0, 3);
  return { products, categories };
}
