/* ELEZON — "notify when back in stock" leads. Storefront captures an email for
   a "под заказ" product and inserts it into Supabase (stock_leads); the admin
   panel reads it. RLS allows anon insert, no read. */

import { insertLead } from '../lib/db/repo';
import type { Product } from '../types';

export interface StockLead {
  id: string;
  email: string;
  productId: string;
  productName: string; // RU source name (translated for display via t())
  article: string;
  createdAt: string;   // ISO timestamp (set by the DB)
}

/** Capture a stock-notification lead. Async — caller awaits + handles errors. */
export async function addLead(product: Product, email: string): Promise<void> {
  await insertLead({
    email: email.trim(),
    productId: product.id,
    productName: product.name,
    article: product.article,
  });
}
