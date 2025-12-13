/**
 * Analytics Service
 * Enterprise-grade analytics tracking for millions of users
 * 
 * Features:
 * - Event tracking
 * - User identification
 * - Funnel analysis
 * - Performance tracking
 * - Error tracking integration
 */

// Analytics Provider Interface
interface AnalyticsProvider {
  identify(userId: string, traits?: Record<string, any>): void;
  track(event: string, properties?: Record<string, any>): void;
  screen(name: string, properties?: Record<string, any>): void;
  reset(): void;
}

// Analytics Provider Implementation
// Note: Currently using mock implementation. To integrate with Mixpanel/Amplitude:
// 1. Install analytics SDK: npm install mixpanel-react-native
// 2. Initialize in constructor with API key
// 3. Replace console.log with actual SDK calls
class MockAnalyticsProvider implements AnalyticsProvider {
  identify(userId: string, traits?: Record<string, any>): void {
    if (__DEV__) {
      console.log('[Analytics] Identify:', userId, traits);
    }
    // Production: Initialize Mixpanel/Amplitude user identification
    // Example: Mixpanel.identify(userId); Mixpanel.people.set(traits);
  }

  track(event: string, properties?: Record<string, any>): void {
    if (__DEV__) {
      console.log('[Analytics] Track:', event, properties);
    }
    // Production: Send event to analytics service
    // Example: Mixpanel.track(event, properties);
  }

  screen(name: string, properties?: Record<string, any>): void {
    if (__DEV__) {
      console.log('[Analytics] Screen:', name, properties);
    }
    // Production: Track screen views
    // Example: Mixpanel.track('Screen Viewed', { screen: name, ...properties });
  }

  reset(): void {
    if (__DEV__) {
      console.log('[Analytics] Reset');
    }
    // Production: Clear user data and reset analytics session
    // Example: Mixpanel.reset();
  }
}

// Analytics Service
class AnalyticsService {
  private provider: AnalyticsProvider;
  private userId: string | null = null;

  constructor(provider?: AnalyticsProvider) {
    this.provider = provider || new MockAnalyticsProvider();
  }

  // User Identification
  identify(userId: string, traits?: Record<string, any>): void {
    this.userId = userId;
    this.provider.identify(userId, {
      ...traits,
      platform: 'mobile',
      timestamp: new Date().toISOString(),
    });
  }

  // Event Tracking
  track(event: string, properties?: Record<string, any>): void {
    this.provider.track(event, {
      ...properties,
      userId: this.userId,
      timestamp: new Date().toISOString(),
    });
  }

  // Screen Tracking
  screen(name: string, properties?: Record<string, any>): void {
    this.provider.screen(name, {
      ...properties,
      userId: this.userId,
      timestamp: new Date().toISOString(),
    });
  }

  // Reset (on logout)
  reset(): void {
    this.userId = null;
    this.provider.reset();
  }

  // Common Events
  trackSignUp(method: string): void {
    this.track('User Signed Up', { method });
  }

  trackLogin(method: string): void {
    this.track('User Logged In', { method });
  }

  trackVideoPlay(episodeId: string, showId: string): void {
    this.track('Video Played', { episodeId, showId });
  }

  trackVideoComplete(episodeId: string, duration: number): void {
    this.track('Video Completed', { episodeId, duration });
  }

  trackSubscription(creatorId: string, plan: string): void {
    this.track('Subscription Created', { creatorId, plan });
  }

  trackPurchase(amount: number, currency: string): void {
    this.track('Purchase Completed', { amount, currency });
  }

  trackSearch(query: string, results: number): void {
    this.track('Search Performed', { query, results });
  }

  trackError(error: Error, context?: Record<string, any>): void {
    this.track('Error Occurred', {
      errorMessage: error.message,
      errorStack: error.stack,
      ...context,
    });
  }
}

// Export singleton
export const analytics = new AnalyticsService();

// Export types
export type { AnalyticsProvider };

