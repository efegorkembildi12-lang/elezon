/* ELEZON — storefront hook for the editable stats band.
   Returns stats already localized for the current language, and live-updates
   when the admin panel edits them in another tab (via the `storage` event). */

import { useEffect, useState } from 'react';
import { SITE_STATS_KEY, readStats, localizeStat, type SiteStat } from '../data/siteStats';
import { useI18n } from '../i18n/I18nContext';
import type { Stat } from '../types';

export function useSiteStats(): Stat[] {
  const { lang } = useI18n();
  const [raw, setRaw] = useState<SiteStat[]>(() => readStats());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === SITE_STATS_KEY || e.key === null) setRaw(readStats());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return raw.map((s) => localizeStat(s, lang));
}
