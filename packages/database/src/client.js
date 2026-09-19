/**
 * @file packages/database/src/client.js
 * @description Central Supabase client for NACOS FUTO applications.
 * Reads configuration from Vite environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
 * or process environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) with fallback demo values.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.SUPABASE_URL) ||
  'https://nacos-futo.supabase.co';

const supabaseAnonKey = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyKeyForDemoEnvironment12345';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export default supabase;
