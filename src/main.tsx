/* ELEZON — storefront entry. */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { I18nProvider } from './i18n/I18nContext';
import { RequestListProvider } from './store/RequestListContext';
import './styles/tokens.css';
import './styles/global.css';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');

createRoot(rootEl).render(
  <StrictMode>
    <BrowserRouter>
      <I18nProvider>
        <RequestListProvider>
          <App />
        </RequestListProvider>
      </I18nProvider>
    </BrowserRouter>
  </StrictMode>,
);
