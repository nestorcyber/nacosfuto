import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL
    ? import.meta.env.VITE_SUPABASE_URL
    : (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL ? process.env.VITE_SUPABASE_URL : '');

const supabaseAnonKey = 
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY
    ? import.meta.env.VITE_SUPABASE_ANON_KEY
    : (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY ? process.env.VITE_SUPABASE_ANON_KEY : '');

const defaultUrl = 'https://hfaomycwsjgxgvdqqgwl.supabase.co';
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmYW9teWN3c2pneGd2ZHFxZ3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1NTcwOTEsImV4cCI6MjEwNDEzMzA5MX0.W0for0s-oWavvkuws93EAbW7PPiD4uux-MMUDtmQat8';

export const supabase = createClient(supabaseUrl || defaultUrl, supabaseAnonKey || defaultKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export default supabase;
