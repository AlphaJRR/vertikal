/**
 * Type definitions for react-native-dotenv
 * This file ensures TypeScript recognizes environment variables
 */

declare module '@env' {
  // API Configuration
  export const EXPO_PUBLIC_API_URL: string;
  
  // Sentry (Error Tracking)
  export const EXPO_PUBLIC_SENTRY_DSN: string;
  export const SENTRY_DSN: string;
  
  // Analytics
  export const EXPO_PUBLIC_MIXPANEL_TOKEN: string;
  
  // Feature Flags (optional)
  export const EXPO_PUBLIC_ENABLE_ANALYTICS: string;
  export const EXPO_PUBLIC_ENABLE_SUBSCRIPTIONS: string;
  
  // Development (optional)
  export const EXPO_PUBLIC_DEBUG_API: string;
  
  // Supabase Storage
  export const EXPO_PUBLIC_SUPABASE_URL: string;
  export const EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
  
  // Environment
  export const NODE_ENV: 'development' | 'production' | 'test';
}

