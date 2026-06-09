/* ELEZON — Admin App shell + state router */

import { useState, useEffect } from 'react';
import { AdminStoreContext, useAdminStore, useStore } from './store';
import { makeAdminT } from './i18n';
import { TopBar, ToastHost, ADM_NAV } from './shared';
import Dashboard from './Dashboard';
import Products from './Products';
import Catalog from './Catalog';
import Requests from './Requests';
import Customers from './Customers';
import StockLeads from './StockLeads';
import Content from './Content';
import type { AdminSection } from './types';

/* ---- accent CSS vars ---- */

const ACCENT_VARS: Record<string, string> = {
  lime:   'oklch(0.82 0.2 145)',
  cyan:   'oklch(0.78 0.18 205)',
  amber:  'oklch(0.8 0.18 80)',
  violet: 'oklch(0.72 0.2 295)',
};
const ACCENT_PRESS: Record<string, string> = {
  lime:   'oklch(0.68 0.22 145)',
  cyan:   'oklch(0.62 0.2 205)',
  amber:  'oklch(0.65 0.2 80)',
  violet: 'oklch(0.58 0.22 295)',
};

function applyAccent(accent: string) {
  const root = document.documentElement;
  root.style.setProperty('--accent', ACCENT_VARS[accent] ?? ACCENT_VARS['lime']);
  root.style.setProperty('--accent-press', ACCENT_PRESS[accent] ?? ACCENT_PRESS['lime']);
}

/* ---- inner shell (has access to store context) ---- */

function AdminShell() {
  const store = useStore();
  const [route, setRoute] = useState<AdminSection>('dashboard');
  const [arg, setArg] = useState<string | null>(null);
  const [lang, setLang] = useState<'ru' | 'en'>(store.settings.defaultLang);

  const t = makeAdminT(lang);

  const go = (section: AdminSection, a?: string | null) => {
    setRoute(section);
    setArg(a ?? null);
  };

  useEffect(() => {
    applyAccent(store.settings.accent);
  }, [store.settings.accent]);

  return (
    <div className="adm-layout">
      <TopBar
        route={route}
        go={go}
        lang={lang}
        setLang={setLang}
        store={store}
        t={t}
      />
      <main className="adm-main">
        <div className="adm-main-inner">
          {route === 'dashboard'  && <Dashboard  go={go} lang={lang} t={t} />}
          {route === 'products'   && <Products   go={go} lang={lang} t={t} openId={arg} />}
          {route === 'categories' && <Catalog    section="categories" go={go} t={t} />}
          {route === 'brands'     && <Catalog    section="brands"     go={go} t={t} />}
          {route === 'requests'   && <Requests   go={go} lang={lang} t={t} openId={arg} />}
          {route === 'customers'  && <Customers  go={go} lang={lang} t={t} />}
          {route === 'leads'      && <StockLeads go={go} lang={lang} t={t} />}
          {route === 'content'    && <Content    section="content"    go={go} t={t} />}
          {route === 'settings'   && <Content    section="settings"   go={go} t={t} />}
        </div>
      </main>
      <nav className="adm-bottom-nav" aria-label="Bottom navigation">
        {ADM_NAV.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = route === item.id;
          return (
            <button
              key={item.id}
              className={'adm-bottom-nav-item' + (active ? ' active' : '')}
              onClick={() => go(item.id)}
              aria-current={active ? 'page' : undefined}
            >
              <Icon width={22} height={22} />
              <span>{t(item.label)}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

/* ---- root: provide store context + toast host ---- */

export default function AdminApp() {
  const store = useAdminStore();

  return (
    <AdminStoreContext.Provider value={store}>
      <ToastHost>
        <AdminShell />
      </ToastHost>
    </AdminStoreContext.Provider>
  );
}
