/**
 * Error Recovery Utilities
 * Provides recovery strategies for common error scenarios
 */

export interface RecoveryStrategy {
  canRecover: (error: Error) => boolean;
  recover: () => Promise<void> | void;
  description: string;
}

export class ErrorRecoveryService {
  private strategies: RecoveryStrategy[] = [];

  /**
   * Register a recovery strategy
   */
  registerStrategy(strategy: RecoveryStrategy): void {
    this.strategies.push(strategy);
  }

  /**
   * Attempt to recover from an error
   */
  async attemptRecovery(error: Error): Promise<boolean> {
    for (const strategy of this.strategies) {
      if (strategy.canRecover(error)) {
        try {
          await strategy.recover();
          return true;
        } catch (recoveryError) {
          console.error('[ErrorRecovery] Recovery strategy failed:', recoveryError);
          continue;
        }
      }
    }
    return false;
  }

  /**
   * Get recovery suggestions for an error
   */
  getRecoverySuggestions(error: Error): string[] {
    const suggestions: string[] = [];

    for (const strategy of this.strategies) {
      if (strategy.canRecover(error)) {
        suggestions.push(strategy.description);
      }
    }

    return suggestions;
  }
}

// Common recovery strategies
export const commonRecoveryStrategies: RecoveryStrategy[] = [
  {
    canRecover: (error) => error.message.includes('Network') || error.message.includes('fetch'),
    recover: async () => {
      // Network error - could retry or show offline mode
      console.log('[ErrorRecovery] Network error detected - suggest retry');
    },
    description: 'Check your internet connection and try again',
  },
  {
    canRecover: (error) => error.message.includes('API') || error.message.includes('backend'),
    recover: async () => {
      // API error - could retry or use cached data
      console.log('[ErrorRecovery] API error detected - suggest retry');
    },
    description: 'Service temporarily unavailable. Please try again',
  },
  {
    canRecover: (error) => error.message.includes('token') || error.message.includes('auth'),
    recover: async () => {
      // Auth error - could redirect to login
      console.log('[ErrorRecovery] Auth error detected - suggest re-login');
    },
    description: 'Please log in again',
  },
];

export const errorRecovery = new ErrorRecoveryService();

// Register common strategies
commonRecoveryStrategies.forEach((strategy) => {
  errorRecovery.registerStrategy(strategy);
});

