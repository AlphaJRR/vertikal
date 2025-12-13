/**
 * Sentry Initialization Utility
 * Centralized Sentry setup for the app
 */

import * as Sentry from '@sentry/react-native';
import { EXPO_PUBLIC_SENTRY_DSN } from '@env';

/**
 * Initialize Sentry with app configuration
 */
export function initSentry(): void {
  if (!EXPO_PUBLIC_SENTRY_DSN || EXPO_PUBLIC_SENTRY_DSN.includes('your-sentry-dsn')) {
    console.warn('[Sentry] DSN not configured, skipping initialization');
    return;
  }

  try {
    Sentry.init({
      dsn: EXPO_PUBLIC_SENTRY_DSN,
      environment: __DEV__ ? 'development' : 'production',
      // Removed enableInExpoDevelopment - not a valid option in Sentry v7+
      tracesSampleRate: __DEV__ ? 1.0 : 0.2,
      enableAutoSessionTracking: true,
      sessionTrackingIntervalMillis: 30000,
      // Additional options
      beforeSend(event, hint) {
        // Filter out development errors if needed
        if (__DEV__ && event.level === 'info') {
          return null;
        }
        return event;
      },
    });

    if (__DEV__) {
      console.log('[Sentry] Initialized successfully');
    }
  } catch (error) {
    console.error('[Sentry] Failed to initialize:', error);
    // Don't crash the app if Sentry fails to initialize
  }
}

