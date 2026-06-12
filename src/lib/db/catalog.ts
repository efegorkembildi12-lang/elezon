/* ELEZON — catalog read layer. Maps Supabase rows (snake_case) to the
   storefront types (camelCase). Falls back to the bundled demo data when
   Supabase isn't configured. */

import { supabase } from '../supabase';
import { ELEZON_DATA } from '../../data/catalog';
import type { Product, Category, Stock } from '../../types';

export interface CatalogBundle {
  products: Product[];
  categories: Category[];
  brands: string[];
}

interface ProductRow {
  id: string; name: string; cat: string; brand: string; type: string;
  article: string; price: number | null; stock: string; qty: number; specs: unknown;
  name_en?: string; description?: string; description_en?: string; specs_en?: unknown;
}
interface CategoryRow {
  id: string; name: string; short: string; code: string; count: number; desc: string; sub: string[] | null;
}
interface BrandRow { id: string; name: string; }

const specArr = (v: unknown): [string, string][] => (Array.isArray(v) ? (v as [string, string][]) : []);
function toProduct(r: ProductRow): Product {
  return {
    id: r.id, name: r.name, cat: r.cat, brand: r.brand, type: r.type, article: r.article,
    price: r.price, stock: (r.stock === 'order' ? 'order' : 'in') as Stock, qty: r.qty,
    specs: specArr(r.specs),
    nameEn: r.name_en || undefined, description: r.description || undefined,
    descriptionEn: r.description_en || undefined, specsEn: specArr(r.specs_en),
  };
}

function toCategory(r: CategoryRow): Category {
  return {
    id: r.id, name: r.name, short: r.short, code: r.code, count: r.count,
    desc: r.desc, sub: Array.isArray(r.sub) ? r.sub : [],
  };
}

export async function fetchCatalog(): Promise<CatalogBundle> {
  if (!supabase) {
    return { products: ELEZON_DATA.products, categories: ELEZON_DATA.categories, brands: ELEZON_DATA.brands };
  }
  const [pRes, cRes, bRes] = await Promise.all([
    supabase.from('products').select('*').order('pos'),
    supabase.from('categories').select('*').order('pos'),
    supabase.from('brands').select('*').order('pos'),
  ]);
  if (pRes.error) throw pRes.error;
  if (cRes.error) throw cRes.error;
  if (bRes.error) throw bRes.error;
  return {
    products: (pRes.data as ProductRow[]).map(toProduct),
    categories: (cRes.data as CategoryRow[]).map(toCategory),
    brands: (bRes.data as BrandRow[]).map((b) => b.name),
  };
}
