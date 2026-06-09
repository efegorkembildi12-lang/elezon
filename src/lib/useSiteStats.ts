/* ELEZON — storefront hook for the stats band. Reads the bilingual stats from
   the catalog provider (Supabase or demo fallback) and localizes them for the
   current language. */

import { useCatalog } from '../store/CatalogProvider';
import { localizeStat } from '../data/siteStats';
import { useI18n } from '../i18n/I18nContext';
import type { Stat } from '../types';

export function useSiteStats(): Stat[] {
  const { lang } = useI18n();
  const { stats } = useCatalog();
  return stats.map((s) => localizeStat(s, lang));
}
