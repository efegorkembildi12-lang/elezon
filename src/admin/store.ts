/* ELEZON — Admin data store. localStorage-backed, seeded from ELEZON_DATA.
   Exposes AdminStoreContext + useAdminStore() hook. */

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { ELEZON_DATA } from '../data/catalog';
import { SITE_STATS_KEY, defaultStats, readStats } from '../data/siteStats';
import type { Stat } from '../types';
import type {
  AdminProduct,
  AdminCategory,
  AdminBrand,
  AdminOrder,
  AdminCustomer,
  ContentData,
  StoreSettings,
  OrderStatus,
  OrderChannel,
} from './types';

/* ---- version key ---- */
const SEED_VERSION = 'v3';
const KEY = (k: string) => `elezon_admin_${k}_${SEED_VERSION}`;

/* ---- brand enrichment ---- */
interface BrandMeta { country: string; slug: string; }
const BRAND_META: Record<string, BrandMeta> = {
  'ABB':                { country: 'Швейцария',           slug: 'abb' },
  'Schneider Electric': { country: 'Франция',              slug: 'schneider-electric' },
  'Siemens':            { country: 'Германия',             slug: 'siemens' },
  'Theben':             { country: 'Германия',             slug: 'theben' },
  'JUNG':               { country: 'Германия',             slug: 'jung' },
  'Gira':               { country: 'Германия',             slug: 'gira' },
  'WAGO':               { country: 'Германия',             slug: 'wago' },
  'Phoenix Contact':    { country: 'Германия',             slug: 'phoenix-contact' },
  'Hager':              { country: 'Германия / Швейцария', slug: 'hager' },
  'Legrand':            { country: 'Франция',              slug: 'legrand' },
  'Beckhoff':           { country: 'Германия',             slug: 'beckhoff' },
  'Carlo Gavazzi':      { country: 'Италия',               slug: 'carlo-gavazzi' },
};

/* ---- seed functions ---- */
export function seedBrands(): AdminBrand[] {
  return ELEZON_DATA.brands.map((name, i) => {
    const m = BRAND_META[name] ?? { country: '—', slug: '' };
    const count = ELEZON_DATA.products.filter((p) => p.brand === name).length;
    return { id: 'br-' + i, name, country: m.country, slug: m.slug, count };
  });
}

export function seedProducts(): AdminProduct[] {
  return ELEZON_DATA.products.map((p, i) => ({
    ...p,
    _i: i,
    specs: p.specs.map((s) => [s[0], s[1]] as [string, string]),
  }));
}

export function seedCategories(): AdminCategory[] {
  return ELEZON_DATA.categories.map((c) => ({ ...c, sub: [...c.sub] }));
}

/* ---- orders seed ---- */
const SEED_NOW = new Date('2026-06-04T10:00:00');
const dayAgo = (n: number): string => {
  const d = new Date(SEED_NOW);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};
const prodId = (i: number): string => ELEZON_DATA.products[i]?.id ?? '';

const MGRS = ['Антон Кречет', 'Мария Лозова', 'Игорь Дёмин'];

interface RawOrder {
  d: number;
  company: string;
  contact: string;
  status: OrderStatus;
  channel: OrderChannel;
  items: [number, number][];
  comment: string;
}

export function seedOrders(): AdminOrder[] {
  const raw: RawOrder[] = [
    { d: 0,  company: 'ООО «СтройИнжиниринг»',      contact: 'Павел Сухов',    status: 'new',  channel: 'form',  items: [[0,2],[10,8],[12,20]], comment: 'Нужен расчёт под объект, БЦ на Пресне. Сроки — до конца месяца.' },
    { d: 0,  company: 'АО «Мосэнергопроект»',       contact: 'Елена Рыбак',    status: 'new',  channel: 'phone', items: [[5,10],[6,15]], comment: 'Срочно, уточните наличие по складу.' },
    { d: 1,  company: 'ООО «КлиматТехСервис»',      contact: 'Дмитрий Авдеев', status: 'new',  channel: 'form',  items: [[2,12],[4,3]], comment: '' },
    { d: 1,  company: 'ООО «Интеграл Системс»',     contact: 'Сергей Лапин',   status: 'work', channel: 'email', items: [[16,6],[17,4],[18,10]], comment: 'KNX проект, нужны аналоги по диммерам.' },
    { d: 2,  company: 'ООО «Профэлектро»',          contact: 'Анна Гущина',    status: 'work', channel: 'form',  items: [[10,40],[11,25],[12,200]], comment: 'Объёмный заказ, прошу КП с отсрочкой 30 дней.' },
    { d: 3,  company: 'ПАО «РусГидроСети»',         contact: 'Виктор Малой',   status: 'work', channel: 'phone', items: [[7,2],[8,4]], comment: '' },
    { d: 4,  company: 'ООО «Билдинг Аутомейшн»',    contact: 'Кирилл Зотов',   status: 'ship', channel: 'email', items: [[0,1],[1,2],[4,2]], comment: 'Самовывоз со склада.' },
    { d: 5,  company: 'ООО «ТеплоКонтур»',          contact: 'Ольга Минина',   status: 'ship', channel: 'form',  items: [[6,30],[9,8]], comment: '' },
    { d: 7,  company: 'АО «Промавтоматика»',        contact: 'Роман Гай',      status: 'done', channel: 'email', items: [[10,60],[13,500],[14,10]], comment: 'Поставка по договору №А-114.' },
    { d: 9,  company: 'ООО «СетьСтрой»',            contact: 'Илья Жук',       status: 'done', channel: 'phone', items: [[16,12],[19,6]], comment: '' },
    { d: 12, company: 'ООО «ГринБилдинг»',          contact: 'Тимур Раев',     status: 'done', channel: 'form',  items: [[2,20],[18,15]], comment: '' },
    { d: 14, company: 'ООО «ЭлектроМонтаж-Юг»',    contact: 'Артур Дан',      status: 'done', channel: 'email', items: [[10,80],[12,400],[11,30]], comment: 'Краснодар, отгрузка ТК.' },
    { d: 18, company: 'ООО «Аквасистемы»',          contact: 'Нина Бел',       status: 'lost', channel: 'form',  items: [[7,1],[8,2]], comment: 'Выбрали другого поставщика.' },
    { d: 21, company: 'АО «Мосэнергопроект»',       contact: 'Елена Рыбак',    status: 'done', channel: 'email', items: [[5,20],[9,12]], comment: 'Повторный заказ.' },
    { d: 26, company: 'ООО «Профэлектро»',          contact: 'Анна Гущина',    status: 'done', channel: 'phone', items: [[13,800],[12,300]], comment: '' },
  ];

  return raw.map((o, i) => {
    const num = `ELZ-2026-${(1042 - i * 3).toString().padStart(4, '0')}`;
    const items = o.items.map(([idx, qty]) => ({ id: prodId(idx), qty }));
    const total = items.reduce((s, it) => {
      const p = ELEZON_DATA.products.find((x) => x.id === it.id);
      return s + (p?.price != null ? p.price * it.qty : 0);
    }, 0);
    return {
      id: 'ord-' + i,
      num,
      date: dayAgo(o.d),
      company: o.company,
      contact: o.contact,
      phone: '+7 (4__) ___-__-__',
      email: 'zakaz@' + ['company', 'client', 'build'][i % 3] + '.ru',
      status: o.status,
      channel: o.channel,
      manager: MGRS[i % MGRS.length] ?? MGRS[0],
      items,
      total,
      comment: o.comment,
    };
  });
}

export function seedCustomers(): AdminCustomer[] {
  const raw = [
    { company: 'ООО «Профэлектро»',        contact: 'Анна Гущина',    city: 'Москва',          inn: '7705123456', status: 'active'   as const, requests: 14, turnover: 4820000, last: 2 },
    { company: 'АО «Мосэнергопроект»',     contact: 'Елена Рыбак',    city: 'Москва',          inn: '7710456789', status: 'active'   as const, requests: 9,  turnover: 3140000, last: 0 },
    { company: 'ООО «СтройИнжиниринг»',    contact: 'Павел Сухов',    city: 'Москва',          inn: '7728987654', status: 'active'   as const, requests: 7,  turnover: 1980000, last: 0 },
    { company: 'ООО «Интеграл Системс»',   contact: 'Сергей Лапин',   city: 'Санкт-Петербург', inn: '7801234567', status: 'active'   as const, requests: 6,  turnover: 1420000, last: 1 },
    { company: 'ООО «ЭлектроМонтаж-Юг»',  contact: 'Артур Дан',      city: 'Краснодар',       inn: '2310567890', status: 'active'   as const, requests: 5,  turnover: 2260000, last: 14 },
    { company: 'ПАО «РусГидроСети»',       contact: 'Виктор Малой',   city: 'Новосибирск',     inn: '5404321098', status: 'active'   as const, requests: 4,  turnover: 980000,  last: 3 },
    { company: 'ООО «КлиматТехСервис»',    contact: 'Дмитрий Авдеев', city: 'Казань',          inn: '1655098765', status: 'lead'     as const, requests: 1,  turnover: 0,       last: 1 },
    { company: 'ООО «Билдинг Аутомейшн»',  contact: 'Кирилл Зотов',   city: 'Москва',          inn: '7736112233', status: 'active'   as const, requests: 3,  turnover: 640000,  last: 4 },
    { company: 'ООО «ГринБилдинг»',        contact: 'Тимур Раев',     city: 'Екатеринбург',    inn: '6678445566', status: 'active'   as const, requests: 2,  turnover: 410000,  last: 12 },
    { company: 'ООО «ТеплоКонтур»',        contact: 'Ольга Минина',   city: 'Самара',          inn: '6312778899', status: 'active'   as const, requests: 3,  turnover: 720000,  last: 5 },
    { company: 'ООО «Аквасистемы»',        contact: 'Нина Белова',    city: 'Нижний Новгород', inn: '5258334455', status: 'inactive' as const, requests: 1,  turnover: 0,       last: 18 },
    { company: 'ООО «СетьСтрой»',          contact: 'Илья Жук',       city: 'Москва',          inn: '7715667788', status: 'active'   as const, requests: 2,  turnover: 530000,  last: 9 },
  ];

  const slugs = ['profelectro','mosenergo','stroyeng','integral','elmontazh','rushydro','klimat','buildauto','greenb','teplo','aqua','setstroy'];
  return raw.map((c, i) => ({
    id: 'cus-' + i,
    company: c.company,
    inn: c.inn,
    contact: c.contact,
    city: c.city,
    status: c.status,
    requests: c.requests,
    turnover: c.turnover,
    phone: '+7 (495) ' + (200 + i) + '-' + (10 + i) + '-' + (20 + i),
    email: (['zakup', 'info', 'office'] as const)[i % 3] + '@' + (slugs[i] ?? 'company') + '.ru',
    lastDate: dayAgo(c.last),
  }));
}

export function seedContent(): ContentData {
  return {
    homeSub: 'КИП, низковольтное оборудование и KNX оригинальных брендов. Склад в Москве, отгрузка за 24 часа.',
    aboutHeading: 'Инженерная поставка электротехнического оборудования',
    aboutBody: 'ELEZON — поставщик оборудования для автоматизации зданий, КИП, низковольтных систем и KNX. Мы соединяем инженерную экспертизу с надёжной логистикой.',
    deliveryBody: 'Работаем по договору с полным пакетом документов. Отгрузка со склада в Москве в течение суток.',
    contactAddress: '121087, Москва, ул. Большая Филёвская, 4',
    contactPhone: '+7 (495) 147-47-61',
    contactEmail: 'info@elezon.ru',
    requisites: 'ООО «Элезон» · ИНН 7730812345 · КПП 773001001 · ОГРН 1167746000000',
  };
}

export function seedSettings(): StoreSettings {
  return {
    storeName: 'ELEZON',
    email: 'info@elezon.ru',
    phone: '+7 (495) 147-47-61',
    accent: 'lime',
    defaultLang: 'ru',
    notifyNew: true,
    priceNoVat: false,
    autoPublish: true,
  };
}

/* ---- localStorage helpers ---- */
function loadSlice<T>(name: string, seed: () => T): T {
  try {
    const raw = localStorage.getItem(KEY(name));
    if (raw) return JSON.parse(raw) as T;
  } catch {
    /* ignore */
  }
  return seed();
}

function saveSlice<T>(name: string, val: T): void {
  try {
    localStorage.setItem(KEY(name), JSON.stringify(val));
  } catch {
    /* ignore */
  }
}

/* ---- store shape ---- */
export interface AdminStore {
  products: AdminProduct[];
  categories: AdminCategory[];
  brands: AdminBrand[];
  orders: AdminOrder[];
  customers: AdminCustomer[];
  content: ContentData;
  settings: StoreSettings;
  stats: Stat[];

  addProduct: (p: Omit<AdminProduct, 'id'>) => void;
  updateProduct: (id: string, patch: Partial<AdminProduct>) => void;
  deleteProduct: (id: string) => void;

  addCategory: (c: Omit<AdminCategory, 'id'>) => void;
  updateCategory: (id: string, patch: Partial<AdminCategory>) => void;
  deleteCategory: (id: string) => void;

  addBrand: (b: Omit<AdminBrand, 'id'>) => void;
  updateBrand: (id: string, patch: Partial<AdminBrand>) => void;
  deleteBrand: (id: string) => void;

  updateOrder: (id: string, patch: Partial<AdminOrder>) => void;
  deleteOrder: (id: string) => void;

  addCustomer: (c: Omit<AdminCustomer, 'id'>) => void;
  updateCustomer: (id: string, patch: Partial<AdminCustomer>) => void;
  deleteCustomer: (id: string) => void;

  setContent: (patch: Partial<ContentData>) => void;
  setSettings: (patch: Partial<StoreSettings>) => void;
  setStats: (stats: Stat[]) => void;

  resetAll: () => void;
}

/* ---- React context ---- */
export const AdminStoreContext = createContext<AdminStore | null>(null);

export function useAdminStore(): AdminStore {
  const [products, setProducts]      = useState<AdminProduct[]>(() => loadSlice('products', seedProducts));
  const [categories, setCategories]  = useState<AdminCategory[]>(() => loadSlice('categories', seedCategories));
  const [brands, setBrands]          = useState<AdminBrand[]>(() => loadSlice('brands', seedBrands));
  const [orders, setOrders]          = useState<AdminOrder[]>(() => loadSlice('orders', seedOrders));
  const [customers, setCustomers]    = useState<AdminCustomer[]>(() => loadSlice('customers', seedCustomers));
  const [content, setContentState]   = useState<ContentData>(() => loadSlice('content', seedContent));
  const [settings, setSettingsState] = useState<StoreSettings>(() => loadSlice('settings', seedSettings));
  const [stats, setStatsState]       = useState<Stat[]>(() => readStats());

  useEffect(() => { saveSlice('products',   products);   }, [products]);
  useEffect(() => { saveSlice('categories', categories); }, [categories]);
  useEffect(() => { saveSlice('brands',     brands);     }, [brands]);
  useEffect(() => { saveSlice('orders',     orders);     }, [orders]);
  useEffect(() => { saveSlice('customers',  customers);  }, [customers]);
  useEffect(() => { saveSlice('content',    content);    }, [content]);
  useEffect(() => { saveSlice('settings',   settings);   }, [settings]);
  useEffect(() => { try { localStorage.setItem(SITE_STATS_KEY, JSON.stringify(stats)); } catch { /* ignore */ } }, [stats]);

  const uid = useCallback((p: string) => p + '-' + Math.random().toString(36).slice(2, 8), []);

  return useMemo<AdminStore>(() => ({
    products, categories, brands, orders, customers, content, settings, stats,

    addProduct:    (p) => setProducts((prev) => [{ ...p, id: uid('prod') }, ...prev]),
    updateProduct: (id, patch) => setProducts((prev) => prev.map((p) => p.id === id ? { ...p, ...patch } : p)),
    deleteProduct: (id) => setProducts((prev) => prev.filter((p) => p.id !== id)),

    addCategory:    (c) => setCategories((prev) => [...prev, { ...c, id: uid('cat') }]),
    updateCategory: (id, patch) => setCategories((prev) => prev.map((c) => c.id === id ? { ...c, ...patch } : c)),
    deleteCategory: (id) => setCategories((prev) => prev.filter((c) => c.id !== id)),

    addBrand:    (b) => setBrands((prev) => [...prev, { ...b, id: uid('br') }]),
    updateBrand: (id, patch) => setBrands((prev) => prev.map((b) => b.id === id ? { ...b, ...patch } : b)),
    deleteBrand: (id) => setBrands((prev) => prev.filter((b) => b.id !== id)),

    updateOrder: (id, patch) => setOrders((prev) => prev.map((o) => o.id === id ? { ...o, ...patch } : o)),
    deleteOrder: (id) => setOrders((prev) => prev.filter((o) => o.id !== id)),

    addCustomer:    (c) => setCustomers((prev) => [{ ...c, id: uid('cus') }, ...prev]),
    updateCustomer: (id, patch) => setCustomers((prev) => prev.map((c) => c.id === id ? { ...c, ...patch } : c)),
    deleteCustomer: (id) => setCustomers((prev) => prev.filter((c) => c.id !== id)),

    setContent:  (patch) => setContentState((prev) => ({ ...prev, ...patch })),
    setSettings: (patch) => setSettingsState((prev) => ({ ...prev, ...patch })),
    setStats:    (next) => setStatsState(next),

    resetAll: () => {
      ['products','categories','brands','orders','customers','content','settings'].forEach((k) => {
        try { localStorage.removeItem(KEY(k)); } catch { /* ignore */ }
      });
      try { localStorage.removeItem(SITE_STATS_KEY); } catch { /* ignore */ }
      setProducts(seedProducts());
      setCategories(seedCategories());
      setBrands(seedBrands());
      setOrders(seedOrders());
      setCustomers(seedCustomers());
      setContentState(seedContent());
      setSettingsState(seedSettings());
      setStatsState(defaultStats());
    },
  }), [products, categories, brands, orders, customers, content, settings, stats, uid]);
}

export function useStore(): AdminStore {
  const ctx = useContext(AdminStoreContext);
  if (!ctx) throw new Error('useStore must be used within AdminStoreContext.Provider');
  return ctx;
}
