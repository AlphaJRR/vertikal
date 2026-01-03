/**
 * React Query Hooks for Authentication
 * Enterprise-grade auth with React Query mutations and queries
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { backendClient, LoginResponse, UserProfile } from '../services/backendClient';
import { errorTracking } from '../services/errorTracking';
import { ApiError, isApiError, isNetworkError } from '../types/api';

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authKeys.all, 'currentUser'] as const,
};

/**
 * Get current authenticated user
 * Uses React Query for caching and automatic refetching
 */
export function useCurrentUser() {
  const query = useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: async (): Promise<UserProfile | null> => {
      try {
        return await backendClient.auth.getCurrentUser();
      } catch (error) {
        // Handle 401/404 gracefully (user not authenticated)
        if (isApiError(error)) {
          const apiError = error as ApiError;
          if (apiError.statusCode === 401 || apiError.statusCode === 404) {
            return null; // Not authenticated
          }
        }
        
        // Log other errors but don't crash
        errorTracking.captureError();
        
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on 401/404 (not authenticated)
      if (isApiError(error)) {
        const apiError = error as ApiError;
        if (apiError.statusCode === 401 || apiError.statusCode === 404) {
          return false;
        }
      }
      return failureCount < 2;
    },
    placeholderData: null,
  });

  return {
    data: query.data,
    user: query.data,
    session: query.data ? { user: query.data } : null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Login mutation
 * Handles email/password authentication and token storage
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }): Promise<LoginResponse> => {
      try {
        const response = await backendClient.auth.login(email, password);
        
        // Invalidate current user query to refetch with new token
        await queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
        
        return response;
      } catch (error) {
        errorTracking.captureError();
        throw error;
      }
    },
    onSuccess: () => {
      // Refetch current user after successful login
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
    },
    onError: (error) => {
      errorTracking.captureError();
    },
  });
}

/**
 * Register mutation
 * Creates new user account and logs them in
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      email, 
      password, 
      username 
    }: { 
      email: string; 
      password: string; 
      username: string;
    }): Promise<LoginResponse> => {
      try {
        const response = await backendClient.auth.register(email, password, username);
        
        // Invalidate current user query to refetch with new token
        await queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
        
        return response;
      } catch (error) {
        errorTracking.captureError();
        throw error;
      }
    },
    onSuccess: () => {
      // Refetch current user after successful registration
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
    },
    onError: (error) => {
      errorTracking.captureError();
    },
  });
}

/**
 * Logout mutation
 * Clears tokens and invalidates user queries
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      try {
        await backendClient.auth.logout();
      } catch (error) {
        // Continue even if logout endpoint fails
        errorTracking.captureError();
      }
    },
    onSuccess: () => {
      // Clear all auth-related queries
      queryClient.setQueryData(authKeys.currentUser(), null);
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
    onError: (error) => {
      // Even on error, clear local state
      queryClient.setQueryData(authKeys.currentUser(), null);
      queryClient.removeQueries({ queryKey: authKeys.all });
      
      errorTracking.captureError();
    },
  });
}
