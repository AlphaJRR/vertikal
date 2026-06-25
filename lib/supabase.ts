import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

// Initialize Supabase client with error handling
let supabaseInstance: SupabaseClient | null = null;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  } else {
    console.warn('⚠️ EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY is missing');
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
}

// Export with fallback check — runtime may be null when env vars are missing.
export const supabase = supabaseInstance as SupabaseClient;

/** True when createClient succeeded and auth is available. */
export function isSupabaseAvailable(): boolean {
  return supabaseInstance != null && supabaseInstance.auth != null;
}

// Verify client is initialized
if (!isSupabaseAvailable()) {
  console.warn('⚠️ Supabase client not properly initialized');
}
