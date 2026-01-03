import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vuwawtzhhcarckybdgbd.supabase.co';
const supabaseAnonKey = 'sb_publishable_r52TGUTyJr0uU9dPFi6V8g_va7Iab3Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
