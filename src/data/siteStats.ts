/* ELEZON — site stats band (the 4 KPI numbers on Home + Company).
   Single source of truth shared between the storefront (reads) and the admin
   panel (edits). Bilingual: each stat carries RU + EN so the site shows the
   right language. Persisted to localStorage so admin edits reflect on the site. */

import { ELEZON_DATA } from './catalog';
import { I18N_EN } from '../i18n/translations';
import type { Stat, Lang } from '../types';

/** Shared storage key — same slice the admin store persists ("stats", seed v3). */
export const SITE_STATS_KEY = 'elezon_admin_stats_v3';

/** A stat as stored/edited: Russian source + English translation. */
export interface SiteStat {
  v: string;   // RU value, e.g. "1 570+"
  l: string;   // RU caption, e.g. "позиций на складе"
  vEn: string; // EN value
  lEn: string; // EN caption
}

/** Seed from the catalog defaults, pulling EN from the storefront dictionary. */
export function defaultStats(): SiteStat[] {
  return ELEZON_DATA.stats.map((s) => ({
    v: s.v,
    l: s.l,
    vEn: I18N_EN[s.v] ?? s.v,
    lEn: I18N_EN[s.l] ?? s.l,
  }));
}

const isStr = (x: unknown): x is string => typeof x === 'string';

/** Accept both the current bilingual shape and any older {v,l}-only persisted data. */
function normalize(x: unknown): SiteStat | null {
  if (typeof x !== 'object' || x === null) return null;
  const o = x as Record<string, unknown>;
  if (!isStr(o.v) || !isStr(o.l)) return null;
  return {
    v: o.v,
    l: o.l,
    vEn: isStr(o.vEn) ? o.vEn : I18N_EN[o.v] ?? o.v,
    lEn: isStr(o.lEn) ? o.lEn : I18N_EN[o.l] ?? o.l,
  };
}

/** Read the persisted stats, falling back to the catalog defaults. */
export function readStats(): SiteStat[] {
  if (typeof localStorage === 'undefined') return defaultStats();
  try {
    const raw = localStorage.getItem(SITE_STATS_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const norm = parsed.map(normalize).filter((s): s is SiteStat => s !== null);
        if (norm.length > 0) return norm;
      }
    }
  } catch {
    /* ignore parse / privacy-mode errors */
  }
  return defaultStats();
}

/** Pick the right language for rendering on the storefront. */
export function localizeStat(s: SiteStat, lang: Lang): Stat {
  return lang === 'en'
    ? { v: s.vEn || s.v, l: s.lEn || s.l }
    : { v: s.v, l: s.l };
}
