/* ELEZON — storefront hook for the editable stats band.
   Reads the persisted stats and live-updates when the admin panel edits them
   in another tab (via the `storage` event). */

import { useEffect, useState } from 'react';
import { SITE_STATS_KEY, readStats } from '../data/siteStats';
import type { Stat } from '../types';

export function useSiteStats(): Stat[] {
  const [stats, setStats] = useState<Stat[]>(() => readStats());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === SITE_STATS_KEY || e.key === null) setStats(readStats());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return stats;
}
