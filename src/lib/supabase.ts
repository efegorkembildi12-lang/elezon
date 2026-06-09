/* ELEZON — Supabase client. Reads public env (VITE_SUPABASE_URL / _ANON_KEY).
   The anon key is public-safe; access is governed by Row-Level-Security.
   When env is missing, the client is null and the app falls back to the
   bundled demo catalog (ELEZON_DATA) so it still runs offline. */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null;
