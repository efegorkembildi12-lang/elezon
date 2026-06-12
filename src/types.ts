/* ELEZON — shared domain types (storefront + admin) */

export type Stock = 'in' | 'order';

export interface Category {
  id: string;
  name: string;
  short: string;
  code: string;
  count: number;
  desc: string;
  sub: string[];
}

export interface ProductDoc {
  title: string;
  file: string; // bare filename (repo public/docs/products/) or full Storage URL
}

export interface Product {
  id: string;
  name: string;
  cat: string;
  brand: string;
  type: string;
  article: string;
  price: number | null; // null => "по запросу"
  stock: Stock;
  qty: number; // units in Moscow stock
  specs: [string, string][];
  nameEn?: string; // English name (falls back to `name`)
  description?: string; // RU description
  descriptionEn?: string; // EN description
  specsEn?: [string, string][]; // EN specs (falls back to `specs`)
  imageUrl?: string; // image filename in public/images/products/ ('' => category placeholder)
  featured?: boolean; // shown in the homepage "Popular" rail
  documents?: ProductDoc[]; // datasheets / PDFs
}

export interface Stat {
  v: string;
  l: string;
}

export interface CatalogData {
  brands: string[];
  categories: Category[];
  products: Product[];
  stats: Stat[];
}

export type Lang = 'ru' | 'en';
