/* ELEZON — storefront → admin request submission. When a buyer submits the
   request list, append a real AdminOrder to the admin "orders" slice so it shows
   up in the admin "Заявки" view (channel = form, status = new). The admin store
   re-reads this key on the `storage` event for live updates. */

import type { AdminOrder, OrderStatus, OrderChannel } from '../admin/types';

/** Must equal the admin store's KEY('orders') ("elezon_admin_orders_v3"). */
export const ORDERS_KEY = 'elezon_admin_orders_v3';

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

function readOrders(): AdminOrder[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as AdminOrder[];
    }
  } catch {
    /* ignore */
  }
  return [];
}

const uid = (): string => 'ord-web-' + Math.random().toString(36).slice(2, 8);

/** Append a storefront request to the admin orders slice. */
export function submitStorefrontRequest(form: RequestForm, rows: RequestRow[], dateIso: string): void {
  const orders = readOrders();
  const total = rows.reduce((s, r) => s + (r.price != null ? r.price * r.qty : 0), 0);
  const stamp = dateIso.slice(2, 10).replace(/-/g, '');
  const num = 'ELZ-WEB-' + stamp + '-' + Math.random().toString(36).slice(2, 5).toUpperCase();
  const status: OrderStatus = 'new';
  const channel: OrderChannel = 'form';
  const order: AdminOrder = {
    id: uid(),
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
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...orders]));
  } catch {
    /* ignore */
  }
}
