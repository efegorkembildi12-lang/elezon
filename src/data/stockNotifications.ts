/* ELEZON — "notify when back in stock" leads. Storefront captures an email for
   a "под заказ" product; the admin panel reads the leads. Shared via localStorage
   (same namespace as the admin slices), mirroring the siteStats pattern. */

import type { Product } from '../types';

/** Shared storage key — lives in the admin "elezon_admin_*_v3" namespace. */
export const STOCK_NOTIFY_KEY = 'elezon_admin_stock_notify_v3';

export interface StockLead {
  id: string;
  email: string;
  productId: string;
  productName: string; // RU source name (translated for display via t())
  article: string;
  createdAt: string;   // ISO timestamp
}

export function defaultLeads(): StockLead[] {
  return [];
}

const isStr = (x: unknown): x is string => typeof x === 'string';

function normalize(x: unknown): StockLead | null {
  if (typeof x !== 'object' || x === null) return null;
  const o = x as Record<string, unknown>;
  if (!isStr(o.id) || !isStr(o.email) || !isStr(o.productId)) return null;
  return {
    id: o.id,
    email: o.email,
    productId: o.productId,
    productName: isStr(o.productName) ? o.productName : '',
    article: isStr(o.article) ? o.article : '',
    createdAt: isStr(o.createdAt) ? o.createdAt : '',
  };
}

export function readLeads(): StockLead[] {
  try {
    const raw = localStorage.getItem(STOCK_NOTIFY_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map(normalize).filter((l): l is StockLead => l !== null);
      }
    }
  } catch {
    /* ignore parse / privacy-mode errors */
  }
  return defaultLeads();
}

function writeLeads(leads: StockLead[]): void {
  try {
    localStorage.setItem(STOCK_NOTIFY_KEY, JSON.stringify(leads));
  } catch {
    /* ignore */
  }
}

const uid = (): string => 'lead-' + Math.random().toString(36).slice(2, 9);

/** Capture a lead. Idempotent: returns false if this email already subscribed to
    this product, true if newly added. */
export function addLead(product: Product, email: string, createdAtIso: string): boolean {
  const clean = email.trim();
  const leads = readLeads();
  const dup = leads.some(
    (l) => l.productId === product.id && l.email.toLowerCase() === clean.toLowerCase(),
  );
  if (dup) return false;
  const lead: StockLead = {
    id: uid(),
    email: clean,
    productId: product.id,
    productName: product.name,
    article: product.article,
    createdAt: createdAtIso,
  };
  writeLeads([lead, ...leads]);
  return true;
}
