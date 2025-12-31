/**
 * API Error Types
 * Properly typed error handling for API calls
 */

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
  response?: {
    data?: unknown;
    status?: number;
    statusText?: string;
  };
  config?: {
    url?: string;
    method?: string;
  };
}

export interface NetworkError extends Error {
  code: 'ERR_NETWORK' | 'ERR_TIMEOUT' | 'ERR_CANCELED';
  response?: {
    status: number;
    data?: unknown;
  };
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    'code' in error &&
    'message' in error
  );
}

export function isNetworkError(error: unknown): error is NetworkError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error.code === 'ERR_NETWORK' || error.code === 'ERR_TIMEOUT' || error.code === 'ERR_CANCELED')
  );
}

