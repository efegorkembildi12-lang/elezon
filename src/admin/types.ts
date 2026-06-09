/* ELEZON — Admin-specific types. Storefront types live in src/types.ts. */

export type OrderStatus = 'new' | 'work' | 'ship' | 'done' | 'lost';
export type CustomerStatus = 'active' | 'lead' | 'inactive';
export type OrderChannel = 'form' | 'email' | 'phone';
export type AccentKey = 'lime' | 'cyan' | 'amber' | 'violet';

export interface AdminProduct {
  id: string;
  name: string;
  cat: string;
  brand: string;
  type: string;
  article: string;
  price: number | null;
  stock: 'in' | 'order';
  qty: number;
  specs: [string, string][];
  _i?: number;
}

export interface AdminCategory {
  id: string;
  name: string;
  short: string;
  code: string;
  count: number;
  desc: string;
  sub: string[];
}

export interface AdminBrand {
  id: string;
  name: string;
  country: string;
  slug: string;
  count: number;
}

export interface OrderItem {
  id: string;
  qty: number;
}

export interface AdminOrder {
  id: string;
  num: string;
  date: string;
  company: string;
  contact: string;
  phone: string;
  email: string;
  status: OrderStatus;
  channel: OrderChannel;
  manager: string;
  items: OrderItem[];
  total: number;
  comment: string;
}

export interface AdminCustomer {
  id: string;
  company: string;
  inn: string;
  contact: string;
  phone: string;
  email: string;
  city: string;
  status: CustomerStatus;
  requests: number;
  turnover: number;
  lastDate: string;
}

export interface ContentData {
  homeSub: string;
  aboutHeading: string;
  aboutBody: string;
  deliveryBody: string;
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  requisites: string;
}

export interface StoreSettings {
  storeName: string;
  email: string;
  phone: string;
  accent: AccentKey;
  defaultLang: 'ru' | 'en';
  notifyNew: boolean;
  priceNoVat: boolean;
  autoPublish: boolean;
}

export type AdminSection =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'brands'
  | 'requests'
  | 'customers'
  | 'leads'
  | 'content'
  | 'settings';

export interface SortState {
  col: string;
  dir: 'asc' | 'desc';
}
