/* ELEZON — storefront route table for vite-react-ssg.
   A layout route (header / footer / cookie bar) wraps the page routes. Dynamic
   routes declare getStaticPaths so every product and category is prerendered to
   real HTML (crawler- and AI-visible). Routing replaces the prototype's
   state-based go(route, arg) with real URLs (better for SEO). */

import { useEffect } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { ClientOnly, type RouteRecord } from 'vite-react-ssg';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Product } from './pages/Product';
import { RequestList } from './pages/RequestList';
import { Company } from './pages/Company';
import { Delivery } from './pages/Delivery';
import { Contacts } from './pages/Contacts';
import { Faq } from './pages/Faq';
import { Legal } from './pages/Legal';
import { CookieConsent } from './components/CookieConsent';
import { I18nProvider } from './i18n/I18nContext';
import { CatalogProvider } from './store/CatalogProvider';
import { RequestListProvider } from './store/RequestListContext';
import { loadBuildData } from './lib/ssg/buildData';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    // Let in-page anchor links (e.g. /legal#privacy) handle their own scroll.
    if (hash) return;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname, hash]);
  return null;
}

function Layout() {
  // Providers live in the root layout route so context spans the header, footer
  // and every page — and so they render at build time during SSG.
  return (
    <I18nProvider>
      <CatalogProvider>
        <RequestListProvider>
          <ScrollToTop />
          <Header />
          <main style={{ flex: 1 }}>
            <Outlet />
          </main>
          <Footer />
          {/* Cookie bar reads localStorage and has no SEO value — client only. */}
          <ClientOnly>{() => <CookieConsent />}</ClientOnly>
        </RequestListProvider>
      </CatalogProvider>
    </I18nProvider>
  );
}

async function productStaticPaths(): Promise<string[]> {
  const { products } = await loadBuildData();
  return products.map((p) => `/product/${p.id}`);
}

async function categoryStaticPaths(): Promise<string[]> {
  const { categories } = await loadBuildData();
  return categories.map((c) => `/catalog/${c.id}`);
}

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'catalog', element: <Catalog /> },
      { path: 'catalog/:categoryId', element: <Catalog />, getStaticPaths: categoryStaticPaths },
      { path: 'product/:productId', element: <Product />, getStaticPaths: productStaticPaths },
      // Private quote list (localStorage cart) — no SEO value, client only.
      { path: 'request', element: <ClientOnly>{() => <RequestList />}</ClientOnly> },
      { path: 'company', element: <Company /> },
      { path: 'delivery', element: <Delivery /> },
      { path: 'contacts', element: <Contacts /> },
      { path: 'faq', element: <Faq /> },
      { path: 'legal', element: <Legal /> },
      { path: 'privacy', element: <Navigate to="/legal#privacy" replace /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
];
