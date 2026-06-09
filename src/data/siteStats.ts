/* ELEZON — site stats band (the 4 KPI numbers on Home + Company).
   Single source of truth shared between the storefront (reads) and the admin
   panel (edits). Persisted to localStorage so admin edits reflect on the site. */

import { ELEZON_DATA } from './catalog';
import type { Stat } from '../types';

/** Shared storage key — same slice the admin store persists ("stats", seed v3). */
export const SITE_STATS_KEY = 'elezon_admin_stats_v3';

export function defaultStats(): Stat[] {
  return ELEZON_DATA.stats.map((s) => ({ ...s }));
}

function isStat(x: unknown): x is Stat {
  return (
    typeof x === 'object' && x !== null &&
    typeof (x as Record<string, unknown>).v === 'string' &&
    typeof (x as Record<string, unknown>).l === 'string'
  );
}

/** Read the persisted stats, falling back to the catalog defaults. */
export function readStats(): Stat[] {
  try {
    const raw = localStorage.getItem(SITE_STATS_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(isStat)) {
        return parsed as Stat[];
      }
    }
  } catch {
    /* ignore parse / privacy-mode errors */
  }
  return defaultStats();
}
