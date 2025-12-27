/**
 * Supabase Client for Landing Page
 * Static HTML Integration
 */

// Supabase Configuration
const SUPABASE_URL = 'https://vuwawtzhhcarckybdgbd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_r52TGUTyJr0uU9dPFi6V8g_va7Iab3Y';

// Initialize Supabase Client (using CDN)
let supabaseClient = null;

// Load Supabase from CDN and initialize
function initSupabase() {
  if (typeof supabase === 'undefined') {
    // Load Supabase JS from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    script.onload = function() {
      supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log('Supabase client initialized');
    };
    document.head.appendChild(script);
  } else {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSupabase);
} else {
  initSupabase();
}

// Export for use in other scripts
window.initSupabase = initSupabase;
window.getSupabaseClient = function() {
  return supabaseClient;
};

