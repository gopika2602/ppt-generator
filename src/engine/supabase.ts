import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const publishableKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY)?.trim();
let rememberSession = typeof window === 'undefined' || window.localStorage.getItem('peace-slides-remember') !== 'false';
const sessionStorageAdapter = {
  getItem: (key: string) => (rememberSession ? window.localStorage : window.sessionStorage).getItem(key),
  setItem: (key: string, value: string) => (rememberSession ? window.localStorage : window.sessionStorage).setItem(key, value),
  removeItem: (key: string) => { window.localStorage.removeItem(key); window.sessionStorage.removeItem(key); },
};

// Only the public project URL and publishable/anon key belong in a browser bundle.
// Service-role keys are intentionally unsupported here.
export const supabase = url && publishableKey ? createClient(url, publishableKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storage: sessionStorageAdapter },
}) : null;
export const supabaseConfigured = Boolean(supabase);
export const authRedirectUrl = () => `${(import.meta.env.VITE_APP_URL || window.location.origin).replace(/\/$/, '')}/`;
export function setRememberSession(remember: boolean) {
  rememberSession = remember;
  window.localStorage.setItem('peace-slides-remember', String(remember));
}
