/* ELEZON — storefront → admin request submission. When a buyer submits the
   request list, insert a real order into Supabase (channel = form, status = new)
   so it shows up in the admin "Заявки" view. RLS allows anon insert. */

import { insertOrder } from '../lib/db/repo';
import type { AdminOrder, OrderStatus, OrderChannel } from '../admin/types';

export interface RequestForm {
  org: string;
  name: string;
  phone: string;
  email: string;
  comment: string;
}

export interface RequestRow {
  id: string;
  qty: number;
  price: number | null;
}

/** Insert a storefront request as an order row. Async — caller awaits + handles errors. */
export async function submitStorefrontRequest(form: RequestForm, rows: RequestRow[], dateIso: string): Promise<void> {
  const total = rows.reduce((s, r) => s + (r.price != null ? r.price * r.qty : 0), 0);
  const stamp = dateIso.slice(2, 10).replace(/-/g, '');
  const num = 'ELZ-WEB-' + stamp + '-' + Math.random().toString(36).slice(2, 5).toUpperCase();
  const status: OrderStatus = 'new';
  const channel: OrderChannel = 'form';
  const order: Omit<AdminOrder, 'id'> = {
    num,
    date: dateIso.slice(0, 10),
    company: form.org,
    contact: form.name,
    phone: form.phone,
    email: form.email,
    status,
    channel,
    manager: '—',
    items: rows.map((r) => ({ id: r.id, qty: r.qty })),
    total,
    comment: form.comment,
  };
  await insertOrder(order);
}
