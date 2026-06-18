/* ELEZON — storefront entry (vite-react-ssg).
   Static-generates every route to real HTML at build time and hydrates on the
   client. Providers live in the root layout route (see App.tsx). */

import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './App';
import { loadBuildData } from './lib/ssg/buildData';
import './styles/tokens.css';
import './styles/global.css';

export const createRoot = ViteReactSSG(
  { routes, basename: import.meta.env.BASE_URL.replace(/\/$/, '') },
  async ({ isClient }) => {
    // Build only: fetch the full catalogue once before rendering so prerendered
    // HTML contains real content (CatalogProvider reads it synchronously via
    // getBuildData). getStaticPaths already warms the same cache.
    if (!isClient) await loadBuildData();
  },
);
