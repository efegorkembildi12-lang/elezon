/* ELEZON — "Список запроса" (request list) store.
   B2B alternative to a cart: collect products for one batched price request.
   Persisted to localStorage. Ported from app.jsx rl logic. */

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export interface RLItem {
  id: string;
  qty: number;
}

export interface RequestListValue {
  items: RLItem[];
  count: number;
  has: (id: string) => boolean;
  add: (id: string) => void;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
}

const RequestListContext = createContext<RequestListValue | null>(null);

const STORAGE_KEY = 'elezon_rl';

function readInitial(): RLItem[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function RequestListProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<RLItem[]>(readInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const value = useMemo<RequestListValue>(
    () => ({
      items,
      count: items.length,
      has: (id) => items.some((it) => it.id === id),
      add: (id) => setItems((p) => (p.some((it) => it.id === id) ? p : [...p, { id, qty: 1 }])),
      toggle: (id) =>
        setItems((p) => (p.some((it) => it.id === id) ? p.filter((it) => it.id !== id) : [...p, { id, qty: 1 }])),
      remove: (id) => setItems((p) => p.filter((it) => it.id !== id)),
      setQty: (id, q) => setItems((p) => p.map((it) => (it.id === id ? { ...it, qty: Math.max(1, q) } : it))),
      clear: () => setItems([]),
    }),
    [items],
  );

  return <RequestListContext.Provider value={value}>{children}</RequestListContext.Provider>;
}

export function useRequestList(): RequestListValue {
  const ctx = useContext(RequestListContext);
  if (!ctx) throw new Error('useRequestList must be used within <RequestListProvider>');
  return ctx;
}
