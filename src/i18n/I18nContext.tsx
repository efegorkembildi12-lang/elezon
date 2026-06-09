/* ELEZON — i18n provider + hook. Persists language choice to localStorage. */

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { I18N_EN } from './translations';
import type { Lang } from '../types';

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (s: string) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

const STORAGE_KEY = 'elezon_lang';

function readInitialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'en' ? 'en' : 'ru';
  } catch {
    return 'ru';
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(readInitialLang);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore quota / privacy-mode errors */
    }
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(
    (s: string) => (lang === 'en' && s != null ? I18N_EN[s] || s : s),
    [lang],
  );

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within <I18nProvider>');
  return ctx;
}
