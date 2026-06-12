/* ELEZON — per-product localization. Product name/description/specs carry their
   own RU + EN values (unlike UI strings, which use the shared i18n dictionary).
   These helpers pick the active language and fall back to the other one. */

import type { Product, Lang } from '../types';

export const productName = (p: Product, lang: Lang): string =>
  lang === 'en' && p.nameEn ? p.nameEn : p.name;

export const productDesc = (p: Product, lang: Lang): string =>
  lang === 'en'
    ? (p.descriptionEn || p.description || '')
    : (p.description || p.descriptionEn || '');

export const productSpecs = (p: Product, lang: Lang): [string, string][] =>
  lang === 'en' && p.specsEn && p.specsEn.length ? p.specsEn : p.specs;
