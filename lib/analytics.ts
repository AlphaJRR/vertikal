/**
 * Analytics Layer
 * VERTIKAL - Event Tracking for Founder-Led Campaign
 * 
 * Tracks:
 * - CTA clicks (High Value: creator vs Low Value: user)
 * - Signup attempts and successes
 * - Conversion funnel metrics
 */

'use client'

// Simple wrapper for Google Analytics (GA4) or Posthog
// If you don't have GA4 keys yet, this logs to console so you can see it working.

export const logEvent = (eventName: string, params?: Record<string, any>) => {
  // 1. Log to Console (Dev Mode - Always Visible)
  console.log(`📊 EVENT: ${eventName}`, params || {});

  // 2. Log to Google Analytics (if window.gtag exists)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }

  // 3. Log to Posthog (optional, if added later)
  if (typeof window !== 'undefined' && (window as any).posthog) {
    (window as any).posthog.capture(eventName, params);
  }
  
  // 4. Track conversion value for CTA events
  if (eventName.includes('cta_') || eventName.includes('signup_success')) {
    const value = eventName.includes('creator') ? 'HIGH' : 'LOW';
    console.log(`💰 CONVERSION VALUE: ${value}`, params);
  }
};

