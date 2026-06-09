/* ELEZON — Admin entry point */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/tokens.css';
import '../styles/global.css';
import '../styles/admin.css';
import AdminApp from './App';

const el = document.getElementById('root');
if (!el) throw new Error('No #root element');

createRoot(el).render(
  <StrictMode>
    <AdminApp />
  </StrictMode>,
);
