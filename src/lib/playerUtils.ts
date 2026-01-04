/**
 * Video Player Utility Functions
 * Helper functions for video playback, time formatting, and analytics
 */

/**
 * Format seconds to MM:SS or HH:MM:SS
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate percentage of video watched
 */
export function getProgressPercentage(current: number, duration: number): number {
  if (duration === 0) return 0;
  return Math.min(100, Math.max(0, (current / duration) * 100));
}

/**
 * Get quartile milestone (25%, 50%, 75%, 100%)
 */
export function getQuartile(current: number, duration: number): number | null {
  if (duration === 0) return null;
  const percentage = (current / duration) * 100;
  
  if (percentage >= 100) return 100;
  if (percentage >= 75) return 75;
  if (percentage >= 50) return 50;
  if (percentage >= 25) return 25;
  return null;
}

/**
 * Seek video to specific time
 */
export function seekTo(videoElement: HTMLVideoElement, time: number): void {
  if (videoElement) {
    videoElement.currentTime = Math.max(0, Math.min(time, videoElement.duration));
  }
}

/**
 * Seek video by percentage
 */
export function seekByPercentage(videoElement: HTMLVideoElement, percentage: number): void {
  if (videoElement && videoElement.duration) {
    const targetTime = (percentage / 100) * videoElement.duration;
    seekTo(videoElement, targetTime);
  }
}

/**
 * Analytics event emitter (mock for now)
 */
export function emitAnalyticsEvent(event: string, data: Record<string, any>): void {
  console.log(`[ANALYTICS] ${event}:`, data);
  // In production, this would send to analytics service
  // Example: analytics.track(event, data);
}


