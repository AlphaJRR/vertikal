/**
 * Supabase Client Configuration
 * Centralized Supabase client for authentication, database, and storage
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const isDemoMode =
  import.meta.env.VITE_FORCE_DEMO === 'true' || !isSupabaseConfigured;

/**
 * DEV/DEMO SAFETY:
 * If Supabase env vars are missing, we export a disabled client so the UI can still render
 * (instead of crashing to a blank page). Any calls will return a friendly error.
 */
const disabledError = {
  message:
    'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env and restart the dev server.',
  code: 'SUPABASE_NOT_CONFIGURED',
};

class DisabledQuery {
  // Chainable query builder that resolves to a consistent error payload.
  select() {
    return this;
  }
  eq() {
    return this;
  }
  order() {
    return this;
  }
  insert() {
    return this;
  }
  update() {
    return this;
  }
  delete() {
    return this;
  }
  single() {
    return Promise.resolve({ data: null, error: disabledError });
  }
  // Allow `await supabase.from(...).select(...)` patterns.
  then(onFulfilled: any, onRejected: any) {
    return Promise.resolve({ data: null, error: disabledError }).then(onFulfilled, onRejected);
  }
}

const disabledSupabase: any = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => void 0 } } }),
    signInWithPassword: async () => ({ data: { user: null, session: null }, error: disabledError }),
    signUp: async () => ({ data: { user: null, session: null }, error: disabledError }),
    signOut: async () => ({ error: null }),
  },
  from: () => new DisabledQuery(),
};

export const supabase: any = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : (console.warn(disabledError.message), disabledSupabase);
