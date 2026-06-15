/* ELEZON — storefront shell: header, routed pages, footer.
   Routing replaces the prototype's state-based go(route, arg) with real URLs (better for SEO). */

import { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Product } from './pages/Product';
import { RequestList } from './pages/RequestList';
import { Company } from './pages/Company';
import { Delivery } from './pages/Delivery';
import { Contacts } from './pages/Contacts';
import { Legal } from './pages/Legal';
import { CookieConsent } from './components/CookieConsent';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    // Let in-page anchor links (e.g. /legal#privacy) handle their own scroll.
    if (hash) return;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:categoryId" element={<Catalog />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/request" element={<RequestList />} />
          <Route path="/company" element={<Company />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/privacy" element={<Navigate to="/legal#privacy" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}
