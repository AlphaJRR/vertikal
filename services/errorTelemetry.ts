/**
 * Error Telemetry Service
 * Production monitoring and error logging
 * Fail-loud design with graceful degradation
 */

import * as Sentry from '@sentry/react-native';

export interface ErrorContext {
  screen?: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

class ErrorTelemetryService {
  private initialized = false;

  /**
   * Initialize error telemetry
   */
  initialize(): void {
    if (this.initialized) return;

    try {
      // Sentry is already initialized in utils/sentry.ts
      // This service provides additional telemetry layer
      this.initialized = true;
      
      if (__DEV__ === true) {
        console.log('[ErrorTelemetry] Service initialized');
      }
    } catch (error) {
      console.error('[ErrorTelemetry] Failed to initialize:', error);
      // Don't crash app if telemetry fails
      this.initialized = true; // Mark as initialized to prevent retry loops
    }
  }

  /**
   * Log error with full context
   */
  captureError(error: Error, context?: ErrorContext): void {
    if (!this.initialized) {
      console.error('[ErrorTelemetry] Service not initialized:', error);
      return;
    }

    try {
      // Add breadcrumb for context
      Sentry.addBreadcrumb({
        category: 'error',
        message: error.message,
        level: 'error',
        data: {
          screen: context?.screen,
          action: context?.action,
          ...context?.metadata,
        },
      });

      // Capture exception with context
      Sentry.captureException(error, {
        tags: {
          screen: context?.screen || 'unknown',
          action: context?.action || 'unknown',
        },
        extra: {
          userId: context?.userId,
          metadata: context?.metadata,
        },
        level: 'error',
      });

      // Log to console in dev
      if (__DEV__ === true) {
        console.error('[ErrorTelemetry] Error captured:', {
          error: error.message,
          context,
        });
      }
    } catch (telemetryError) {
      // Don't crash if telemetry fails
      console.error('[ErrorTelemetry] Failed to capture error:', telemetryError);
    }
  }

  /**
   * Log user action for debugging
   */
  logAction(action: string, metadata?: Record<string, any>): void {
    if (!this.initialized) return;

    try {
      Sentry.addBreadcrumb({
        category: 'user_action',
        message: action,
        level: 'info',
        data: metadata,
      });
    } catch (error) {
      // Silent fail
    }
  }

  /**
   * Set user context for error tracking
   */
  setUser(userId: string, email?: string, username?: string): void {
    if (!this.initialized) return;

    try {
      Sentry.setUser({
        id: userId,
        email,
        username,
      });
    } catch (error) {
      console.error('[ErrorTelemetry] Failed to set user:', error);
    }
  }

  /**
   * Clear user context
   */
  clearUser(): void {
    if (!this.initialized) return;

    try {
      Sentry.setUser(null);
    } catch (error) {
      // Silent fail
    }
  }
}

export const errorTelemetry = new ErrorTelemetryService();
errorTelemetry.initialize();

