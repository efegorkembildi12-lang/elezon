/* ELEZON — admin data repository. All admin reads/writes + the storefront lead
   inserts (orders, stock_leads) go through here. Maps Supabase rows (snake_case)
   to the app types (camelCase). The supabase client's auth determines the role:
   storefront page = anon (insert-only), admin page = authenticated admin (full). */

import { supabase } from '../supabase';
import { fetchStats } from './stats';
import type {
  AdminProduct, AdminCategory, AdminBrand, AdminOrder, AdminCustomer,
  ContentData, StoreSettings,
} from '../../admin/types';
import type { SiteStat } from '../../data/siteStats';
import type { StockLead } from '../../data/stockNotifications';

function db() {
  if (!supabase) throw new Error('Supabase is not configured (missing VITE_SUPABASE_* env).');
  return supabase;
}

const rid = (p: string) => p + '-' + Math.random().toString(36).slice(2, 10);

/* ============================ products ============================ */
interface ProductRow {
  id: string; name: string; cat: string; brand: string; type: string;
  article: string; price: number | null; stock: string; qty: number; specs: unknown; pos: number;
  name_en: string; description: string; description_en: string; specs_en: unknown; image_url: string;
}
const specArr = (v: unknown): [string, string][] => (Array.isArray(v) ? (v as [string, string][]) : []);
const toProduct = (r: ProductRow): AdminProduct => ({
  id: r.id, name: r.name, cat: r.cat, brand: r.brand, type: r.type, article: r.article,
  price: r.price, stock: r.stock === 'order' ? 'order' : 'in', qty: r.qty,
  specs: specArr(r.specs), _i: r.pos,
  nameEn: r.name_en ?? '', description: r.description ?? '', descriptionEn: r.description_en ?? '',
  specsEn: specArr(r.specs_en), imageUrl: r.image_url ?? '',
});
const productCols = (p: Partial<AdminProduct>) => {
  const r: Record<string, unknown> = {};
  if (p.name !== undefined) r.name = p.name;
  if (p.cat !== undefined) r.cat = p.cat;
  if (p.brand !== undefined) r.brand = p.brand;
  if (p.type !== undefined) r.type = p.type;
  if (p.article !== undefined) r.article = p.article;
  if (p.price !== undefined) r.price = p.price;
  if (p.stock !== undefined) r.stock = p.stock;
  if (p.qty !== undefined) r.qty = p.qty;
  if (p.specs !== undefined) r.specs = p.specs;
  if (p.nameEn !== undefined) r.name_en = p.nameEn;
  if (p.description !== undefined) r.description = p.description;
  if (p.descriptionEn !== undefined) r.description_en = p.descriptionEn;
  if (p.specsEn !== undefined) r.specs_en = p.specsEn;
  if (p.imageUrl !== undefined) r.image_url = p.imageUrl;
  return r;
};
export async function fetchProducts(): Promise<AdminProduct[]> {
  const { data, error } = await db().from('products').select('*').order('pos');
  if (error) throw error;
  return (data as ProductRow[]).map(toProduct);
}
export async function insertProduct(p: Omit<AdminProduct, 'id'>): Promise<void> {
  const { error } = await db().from('products').insert({ id: rid('prod'), ...productCols(p) });
  if (error) throw error;
}
export async function updateProduct(id: string, patch: Partial<AdminProduct>): Promise<void> {
  const { error } = await db().from('products').update(productCols(patch)).eq('id', id);
  if (error) throw error;
}
export async function deleteProduct(id: string): Promise<void> {
  const { error } = await db().from('products').delete().eq('id', id);
  if (error) throw error;
}
/** Upload an admin-supplied product photo to Storage; returns its public URL
    (stored verbatim in products.image_url). Bucket: product-images (0005). */
export async function uploadProductImage(file: File): Promise<string> {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const path = `${rid('img')}.${ext}`;
  const store = db().storage.from('product-images');
  const { error } = await store.upload(path, file, { upsert: false, contentType: file.type || undefined });
  if (error) throw error;
  return store.getPublicUrl(path).data.publicUrl;
}

/* ============================ categories ============================ */
interface CatRow { id: string; name: string; short: string; code: string; count: number; desc: string; sub: string[] | null; }
const toCategory = (r: CatRow): AdminCategory => ({
  id: r.id, name: r.name, short: r.short, code: r.code, count: r.count,
  desc: r.desc, sub: Array.isArray(r.sub) ? r.sub : [],
});
const categoryCols = (c: Partial<AdminCategory>) => {
  const r: Record<string, unknown> = {};
  if (c.name !== undefined) r.name = c.name;
  if (c.short !== undefined) r.short = c.short;
  if (c.code !== undefined) r.code = c.code;
  if (c.count !== undefined) r.count = c.count;
  if (c.desc !== undefined) r.desc = c.desc;
  if (c.sub !== undefined) r.sub = c.sub;
  return r;
};
export async function fetchCategories(): Promise<AdminCategory[]> {
  const { data, error } = await db().from('categories').select('*').order('pos');
  if (error) throw error;
  return (data as CatRow[]).map(toCategory);
}
export async function insertCategory(c: Omit<AdminCategory, 'id'>): Promise<void> {
  const { error } = await db().from('categories').insert({ id: rid('cat'), ...categoryCols(c) });
  if (error) throw error;
}
export async function updateCategory(id: string, patch: Partial<AdminCategory>): Promise<void> {
  const { error } = await db().from('categories').update(categoryCols(patch)).eq('id', id);
  if (error) throw error;
}
export async function deleteCategory(id: string): Promise<void> {
  const { error } = await db().from('categories').delete().eq('id', id);
  if (error) throw error;
}

/* ============================ brands ============================ */
interface BrandRow { id: string; name: string; country: string; slug: string; count: number; }
const toBrand = (r: BrandRow): AdminBrand => ({ id: r.id, name: r.name, country: r.country, slug: r.slug, count: r.count });
const brandCols = (b: Partial<AdminBrand>) => {
  const r: Record<string, unknown> = {};
  if (b.name !== undefined) r.name = b.name;
  if (b.country !== undefined) r.country = b.country;
  if (b.slug !== undefined) r.slug = b.slug;
  if (b.count !== undefined) r.count = b.count;
  return r;
};
export async function fetchBrands(): Promise<AdminBrand[]> {
  const { data, error } = await db().from('brands').select('*').order('pos');
  if (error) throw error;
  return (data as BrandRow[]).map(toBrand);
}
export async function insertBrand(b: Omit<AdminBrand, 'id'>): Promise<void> {
  const { error } = await db().from('brands').insert({ id: rid('br'), ...brandCols(b) });
  if (error) throw error;
}
export async function updateBrand(id: string, patch: Partial<AdminBrand>): Promise<void> {
  const { error } = await db().from('brands').update(brandCols(patch)).eq('id', id);
  if (error) throw error;
}
export async function deleteBrand(id: string): Promise<void> {
  const { error } = await db().from('brands').delete().eq('id', id);
  if (error) throw error;
}

/* ============================ orders ============================ */
interface OrderRow {
  id: string; num: string; date: string; company: string; contact: string; phone: string;
  email: string; status: string; channel: string; manager: string; items: unknown; total: number; comment: string;
}
const toOrder = (r: OrderRow): AdminOrder => ({
  id: r.id, num: r.num, date: r.date, company: r.company, contact: r.contact, phone: r.phone,
  email: r.email, status: r.status as AdminOrder['status'], channel: r.channel as AdminOrder['channel'],
  manager: r.manager, items: Array.isArray(r.items) ? (r.items as AdminOrder['items']) : [],
  total: r.total, comment: r.comment,
});
export async function fetchOrders(): Promise<AdminOrder[]> {
  const { data, error } = await db().from('orders').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data as OrderRow[]).map(toOrder);
}
export async function updateOrder(id: string, patch: Partial<AdminOrder>): Promise<void> {
  const { error } = await db().from('orders').update(patch).eq('id', id);
  if (error) throw error;
}
export async function deleteOrder(id: string): Promise<void> {
  const { error } = await db().from('orders').delete().eq('id', id);
  if (error) throw error;
}
/** Storefront request submission (anon insert allowed by RLS). */
export async function insertOrder(o: Omit<AdminOrder, 'id'>): Promise<void> {
  const { error } = await db().from('orders').insert(o);
  if (error) throw error;
}

/* ============================ customers ============================ */
interface CustomerRow {
  id: string; company: string; inn: string; contact: string; phone: string; email: string;
  city: string; status: string; requests: number; turnover: number; last_date: string;
}
const toCustomer = (r: CustomerRow): AdminCustomer => ({
  id: r.id, company: r.company, inn: r.inn, contact: r.contact, phone: r.phone, email: r.email,
  city: r.city, status: r.status as AdminCustomer['status'], requests: r.requests,
  turnover: r.turnover, lastDate: r.last_date,
});
const customerCols = (c: Partial<AdminCustomer>) => {
  const r: Record<string, unknown> = {};
  if (c.company !== undefined) r.company = c.company;
  if (c.inn !== undefined) r.inn = c.inn;
  if (c.contact !== undefined) r.contact = c.contact;
  if (c.phone !== undefined) r.phone = c.phone;
  if (c.email !== undefined) r.email = c.email;
  if (c.city !== undefined) r.city = c.city;
  if (c.status !== undefined) r.status = c.status;
  if (c.requests !== undefined) r.requests = c.requests;
  if (c.turnover !== undefined) r.turnover = c.turnover;
  if (c.lastDate !== undefined) r.last_date = c.lastDate;
  return r;
};
export async function fetchCustomers(): Promise<AdminCustomer[]> {
  const { data, error } = await db().from('customers').select('*').order('company');
  if (error) throw error;
  return (data as CustomerRow[]).map(toCustomer);
}
export async function insertCustomer(c: Omit<AdminCustomer, 'id'>): Promise<void> {
  const { error } = await db().from('customers').insert(customerCols(c));
  if (error) throw error;
}
export async function updateCustomer(id: string, patch: Partial<AdminCustomer>): Promise<void> {
  const { error } = await db().from('customers').update(customerCols(patch)).eq('id', id);
  if (error) throw error;
}
export async function deleteCustomer(id: string): Promise<void> {
  const { error } = await db().from('customers').delete().eq('id', id);
  if (error) throw error;
}

/* ============================ content ============================ */
interface ContentRow {
  home_sub: string; about_heading: string; about_body: string; delivery_body: string;
  contact_address: string; contact_phone: string; contact_email: string; requisites: string;
}
const toContent = (r: ContentRow): ContentData => ({
  homeSub: r.home_sub, aboutHeading: r.about_heading, aboutBody: r.about_body, deliveryBody: r.delivery_body,
  contactAddress: r.contact_address, contactPhone: r.contact_phone, contactEmail: r.contact_email, requisites: r.requisites,
});
const contentCols = (c: Partial<ContentData>) => {
  const r: Record<string, unknown> = {};
  if (c.homeSub !== undefined) r.home_sub = c.homeSub;
  if (c.aboutHeading !== undefined) r.about_heading = c.aboutHeading;
  if (c.aboutBody !== undefined) r.about_body = c.aboutBody;
  if (c.deliveryBody !== undefined) r.delivery_body = c.deliveryBody;
  if (c.contactAddress !== undefined) r.contact_address = c.contactAddress;
  if (c.contactPhone !== undefined) r.contact_phone = c.contactPhone;
  if (c.contactEmail !== undefined) r.contact_email = c.contactEmail;
  if (c.requisites !== undefined) r.requisites = c.requisites;
  return r;
};
export async function fetchContent(): Promise<ContentData | null> {
  const { data, error } = await db().from('content').select('*').eq('id', 1).maybeSingle();
  if (error) throw error;
  return data ? toContent(data as ContentRow) : null;
}
export async function saveContent(patch: Partial<ContentData>): Promise<void> {
  const { error } = await db().from('content').update(contentCols(patch)).eq('id', 1);
  if (error) throw error;
}

/* ============================ settings ============================ */
interface SettingsRow {
  store_name: string; email: string; phone: string; accent: string; default_lang: string;
  notify_new: boolean; price_no_vat: boolean; auto_publish: boolean;
}
const toSettings = (r: SettingsRow): StoreSettings => ({
  storeName: r.store_name, email: r.email, phone: r.phone, accent: r.accent as StoreSettings['accent'],
  defaultLang: r.default_lang as StoreSettings['defaultLang'], notifyNew: r.notify_new,
  priceNoVat: r.price_no_vat, autoPublish: r.auto_publish,
});
const settingsCols = (s: Partial<StoreSettings>) => {
  const r: Record<string, unknown> = {};
  if (s.storeName !== undefined) r.store_name = s.storeName;
  if (s.email !== undefined) r.email = s.email;
  if (s.phone !== undefined) r.phone = s.phone;
  if (s.accent !== undefined) r.accent = s.accent;
  if (s.defaultLang !== undefined) r.default_lang = s.defaultLang;
  if (s.notifyNew !== undefined) r.notify_new = s.notifyNew;
  if (s.priceNoVat !== undefined) r.price_no_vat = s.priceNoVat;
  if (s.autoPublish !== undefined) r.auto_publish = s.autoPublish;
  return r;
};
export async function fetchSettings(): Promise<StoreSettings | null> {
  const { data, error } = await db().from('settings').select('*').eq('id', 1).maybeSingle();
  if (error) throw error;
  return data ? toSettings(data as SettingsRow) : null;
}
export async function saveSettings(patch: Partial<StoreSettings>): Promise<void> {
  const { error } = await db().from('settings').update(settingsCols(patch)).eq('id', 1);
  if (error) throw error;
}

/* ============================ site stats ============================ */
export { fetchStats };
export async function saveStats(stats: SiteStat[]): Promise<void> {
  const rows = stats.map((s, idx) => ({ idx, v: s.v, l: s.l, v_en: s.vEn, l_en: s.lEn }));
  const { error } = await db().from('site_stats').upsert(rows, { onConflict: 'idx' });
  if (error) throw error;
}

/* ============================ stock leads ============================ */
interface LeadRow { id: string; email: string; product_id: string; product_name: string; article: string; created_at: string; }
const toLead = (r: LeadRow): StockLead => ({
  id: r.id, email: r.email, productId: r.product_id, productName: r.product_name,
  article: r.article, createdAt: r.created_at,
});
export async function fetchLeads(): Promise<StockLead[]> {
  const { data, error } = await db().from('stock_leads').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data as LeadRow[]).map(toLead);
}
export async function deleteLead(id: string): Promise<void> {
  const { error } = await db().from('stock_leads').delete().eq('id', id);
  if (error) throw error;
}
/** Storefront stock-notify capture (anon insert allowed by RLS). */
export async function insertLead(lead: { email: string; productId: string; productName: string; article: string }): Promise<void> {
  const { error } = await db().from('stock_leads').insert({
    email: lead.email, product_id: lead.productId, product_name: lead.productName, article: lead.article,
  });
  if (error) throw error;
}

/* ============================ auth ============================ */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const { data, error } = await db().rpc('is_admin');
  if (error) return false;
  return data === true;
}
