import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vuwawtzhhcarckybdgbd.supabase.co';
const supabaseAnonKey = 'sb_publishable_r52TGUTyJr0uU9dPFi6V8g_va7Iab3Y';

// Initialize Supabase client with error handling
let supabaseInstance: SupabaseClient | null = null;

try {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
}

// Export with fallback check
export const supabase = supabaseInstance as SupabaseClient;

// Verify client is initialized
if (!supabase || !supabase.auth) {
  console.warn('⚠️ Supabase client not properly initialized');
}
