import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// Multi-page build: the public storefront (index.html) and the admin panel (admin.html).
// `base` is '/' for the custom-domain (elezon.ru) build and '/elezon/' for the GitHub
// project-page preview (efegorkembildi12-lang.github.io/elezon/), driven by VITE_BASE.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
});
