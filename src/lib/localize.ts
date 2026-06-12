/* ELEZON — per-product localization. Product name/description/specs carry their
   own RU + EN values (unlike UI strings, which use the shared i18n dictionary).
   These helpers pick the active language and fall back to the other one. */

import type { Product, Lang, ProductDoc } from '../types';

export const productName = (p: Product, lang: Lang): string =>
  lang === 'en' && p.nameEn ? p.nameEn : p.name;

export const productDesc = (p: Product, lang: Lang): string =>
  lang === 'en'
    ? (p.descriptionEn || p.description || '')
    : (p.description || p.descriptionEn || '');

export const productSpecs = (p: Product, lang: Lang): [string, string][] =>
  lang === 'en' && p.specsEn && p.specsEn.length ? p.specsEn : p.specs;

/** Resolve a document's file to a URL. Admin uploads store a full Storage URL
    (used as-is); bulk-imported docs store a bare filename served from the repo
    (public/docs/products/). */
export const docUrl = (doc: ProductDoc): string =>
  /^https?:\/\//.test(doc.file) ? doc.file : `${import.meta.env.BASE_URL}docs/products/${doc.file}`;

/** Resolve a product's photo to a URL. Admin uploads store a full Storage URL
    (used as-is); bulk-imported photos store a bare filename served from the repo
    (public/images/products/). Empty => category placeholder. */
export const productImage = (p: Product): string => {
  if (!p.imageUrl) return `${import.meta.env.BASE_URL}images/prod-${p.cat}.png`;
  if (/^https?:\/\//.test(p.imageUrl)) return p.imageUrl;
  return `${import.meta.env.BASE_URL}images/products/${p.imageUrl}`;
};
