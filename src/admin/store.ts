/* ELEZON — Admin data store. Supabase-backed (was localStorage). Fetches all
   slices on mount, persists mutations through the repo, and live-syncs orders +
   stock_leads via Supabase Realtime. Only mounted after the auth gate, so the
   client is an authenticated admin. */

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import * as repo from '../lib/db/repo';
import { defaultStats, type SiteStat } from '../data/siteStats';
import { supabase } from '../lib/supabase';
import type {
  AdminProduct,
  AdminCategory,
  AdminBrand,
  AdminOrder,
  AdminCustomer,
  ContentData,
  StoreSettings,
} from './types';
import type { StockLead } from '../data/stockNotifications';

const DEFAULT_CONTENT: ContentData = {
  homeSub: '', aboutHeading: '', aboutBody: '', deliveryBody: '',
  contactAddress: '', contactPhone: '', contactEmail: '', requisites: '',
};
const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'ELEZON', email: '', phone: '', accent: 'lime', defaultLang: 'ru',
  notifyNew: true, priceNoVat: false, autoPublish: true,
};

export interface AdminStore {
  products: AdminProduct[];
  categories: AdminCategory[];
  brands: AdminBrand[];
  orders: AdminOrder[];
  customers: AdminCustomer[];
  content: ContentData;
  settings: StoreSettings;
  stats: SiteStat[];
  leads: StockLead[];
  loading: boolean;

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
  setStats: (stats: SiteStat[]) => void;
  deleteLead: (id: string) => void;

  resetAll: () => void;
}

export const AdminStoreContext = createContext<AdminStore | null>(null);

const logErr = (e: unknown) => { console.error('[admin store]', e); };

export function useAdminStore(): AdminStore {
  const [products, setProducts]      = useState<AdminProduct[]>([]);
  const [categories, setCategories]  = useState<AdminCategory[]>([]);
  const [brands, setBrands]          = useState<AdminBrand[]>([]);
  const [orders, setOrders]          = useState<AdminOrder[]>([]);
  const [customers, setCustomers]    = useState<AdminCustomer[]>([]);
  const [content, setContentState]   = useState<ContentData>(DEFAULT_CONTENT);
  const [settings, setSettingsState] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [stats, setStatsState]       = useState<SiteStat[]>(() => defaultStats());
  const [leads, setLeadsState]       = useState<StockLead[]>([]);
  const [loading, setLoading]        = useState(true);

  const reloadProducts   = useCallback(async () => { try { setProducts(await repo.fetchProducts()); } catch (e) { logErr(e); } }, []);
  const reloadCategories = useCallback(async () => { try { setCategories(await repo.fetchCategories()); } catch (e) { logErr(e); } }, []);
  const reloadBrands     = useCallback(async () => { try { setBrands(await repo.fetchBrands()); } catch (e) { logErr(e); } }, []);
  const reloadOrders     = useCallback(async () => { try { setOrders(await repo.fetchOrders()); } catch (e) { logErr(e); } }, []);
  const reloadCustomers  = useCallback(async () => { try { setCustomers(await repo.fetchCustomers()); } catch (e) { logErr(e); } }, []);
  const reloadLeads      = useCallback(async () => { try { setLeadsState(await repo.fetchLeads()); } catch (e) { logErr(e); } }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [prods, cats, brs, ords, custs, cont, setg, sts, lds] = await Promise.all([
        repo.fetchProducts(), repo.fetchCategories(), repo.fetchBrands(),
        repo.fetchOrders(), repo.fetchCustomers(), repo.fetchContent(),
        repo.fetchSettings(), repo.fetchStats(), repo.fetchLeads(),
      ]);
      setProducts(prods); setCategories(cats); setBrands(brs); setOrders(ords);
      setCustomers(custs); setContentState(cont ?? DEFAULT_CONTENT);
      setSettingsState(setg ?? DEFAULT_SETTINGS); setStatsState(sts); setLeadsState(lds);
    } catch (e) { logErr(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  // Live-sync storefront-written tables.
  useEffect(() => {
    const sb = supabase;
    if (!sb) return;
    const ch = sb
      .channel('admin-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => { reloadOrders(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stock_leads' }, () => { reloadLeads(); })
      .subscribe();
    return () => { sb.removeChannel(ch); };
  }, [reloadOrders, reloadLeads]);

  return useMemo<AdminStore>(() => ({
    products, categories, brands, orders, customers, content, settings, stats, leads, loading,

    addProduct:    (p) => { repo.insertProduct(p).then(reloadProducts).catch(logErr); },
    updateProduct: (id, patch) => { setProducts((prev) => prev.map((x) => x.id === id ? { ...x, ...patch } : x)); repo.updateProduct(id, patch).catch(logErr); },
    deleteProduct: (id) => { setProducts((prev) => prev.filter((x) => x.id !== id)); repo.deleteProduct(id).catch(logErr); },

    addCategory:    (c) => { repo.insertCategory(c).then(reloadCategories).catch(logErr); },
    updateCategory: (id, patch) => { setCategories((prev) => prev.map((x) => x.id === id ? { ...x, ...patch } : x)); repo.updateCategory(id, patch).catch(logErr); },
    deleteCategory: (id) => { setCategories((prev) => prev.filter((x) => x.id !== id)); repo.deleteCategory(id).catch(logErr); },

    addBrand:    (b) => { repo.insertBrand(b).then(reloadBrands).catch(logErr); },
    updateBrand: (id, patch) => { setBrands((prev) => prev.map((x) => x.id === id ? { ...x, ...patch } : x)); repo.updateBrand(id, patch).catch(logErr); },
    deleteBrand: (id) => { setBrands((prev) => prev.filter((x) => x.id !== id)); repo.deleteBrand(id).catch(logErr); },

    updateOrder: (id, patch) => { setOrders((prev) => prev.map((o) => o.id === id ? { ...o, ...patch } : o)); repo.updateOrder(id, patch).catch(logErr); },
    deleteOrder: (id) => { setOrders((prev) => prev.filter((o) => o.id !== id)); repo.deleteOrder(id).catch(logErr); },

    addCustomer:    (c) => { repo.insertCustomer(c).then(reloadCustomers).catch(logErr); },
    updateCustomer: (id, patch) => { setCustomers((prev) => prev.map((c) => c.id === id ? { ...c, ...patch } : c)); repo.updateCustomer(id, patch).catch(logErr); },
    deleteCustomer: (id) => { setCustomers((prev) => prev.filter((c) => c.id !== id)); repo.deleteCustomer(id).catch(logErr); },

    setContent:  (patch) => { setContentState((prev) => ({ ...prev, ...patch })); repo.saveContent(patch).catch(logErr); },
    setSettings: (patch) => { setSettingsState((prev) => ({ ...prev, ...patch })); repo.saveSettings(patch).catch(logErr); },
    setStats:    (next) => { setStatsState(next); repo.saveStats(next).catch(logErr); },
    deleteLead:  (id) => { setLeadsState((prev) => prev.filter((l) => l.id !== id)); repo.deleteLead(id).catch(logErr); },

    resetAll: () => { loadAll(); },
  }), [
    products, categories, brands, orders, customers, content, settings, stats, leads, loading,
    reloadProducts, reloadCategories, reloadBrands, reloadCustomers, loadAll,
  ]);
}

export function useStore(): AdminStore {
  const ctx = useContext(AdminStoreContext);
  if (!ctx) throw new Error('useStore must be used within AdminStoreContext.Provider');
  return ctx;
}
