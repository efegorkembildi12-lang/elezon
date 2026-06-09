/* ELEZON — site stats read layer. Maps site_stats rows to the bilingual
   SiteStat shape. Falls back to catalog defaults when unconfigured/empty. */

import { supabase } from '../supabase';
import { defaultStats, type SiteStat } from '../../data/siteStats';

interface StatRow { idx: number; v: string; l: string; v_en: string; l_en: string; }

export async function fetchStats(): Promise<SiteStat[]> {
  if (!supabase) return defaultStats();
  const { data, error } = await supabase.from('site_stats').select('*').order('idx');
  if (error) throw error;
  const rows = data as StatRow[];
  if (!rows.length) return defaultStats();
  return rows.map((r) => ({ v: r.v, l: r.l, vEn: r.v_en, lEn: r.l_en }));
}
