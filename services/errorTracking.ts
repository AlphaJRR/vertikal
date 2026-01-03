// DEMO MODE: Disable error tracking
const ErrorTrackingService = {
  init: () => {},
  captureException: () => {},
  captureMessage: () => {},
  captureError: () => {},
  setUser: () => {},
  clearUser: () => {},
  addBreadcrumb: () => {},
  setContext: () => {},
};

// Export for backward compatibility
export const errorTracking = ErrorTrackingService;
export default ErrorTrackingService;
