/**
 * React Query Hooks for Authentication
 * Enterprise-grade auth with Sentry integration
 */

import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Sentry from '@sentry/react-native';
import { backendClient, LoginResponse } from '../services/backendClient';
import { analytics } from '../services/analytics';
import { errorTracking } from '../services/errorTracking';
import { apiClient } from '../services/api';

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authKeys.all, 'currentUser'] as const,
};

// Login Mutation
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      backendClient.auth.login(email, password),
    onSuccess: (data: LoginResponse) => {
      // Set Sentry user context
      Sentry.setUser({ 
        id: data.user.id, 
        email: data.user.email 
      });

      // Track analytics
      analytics.track('User Logged In', {
        userId: data.user.id,
        email: data.user.email,
      });

      // Invalidate and refetch current user
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
    },
    onError: (error) => {
      Sentry.captureException(error, {
        tags: { hook: 'useLogin' },
      });
    },
  });
};

// Register Mutation
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      email,
      password,
      username,
    }: {
      email: string;
      password: string;
      username: string;
    }) => backendClient.auth.register(email, password, username),
    onSuccess: (data: LoginResponse) => {
      // Set Sentry user context
      Sentry.setUser({ 
        id: data.user.id, 
        email: data.user.email 
      });

      // Track analytics
      analytics.track('User Registered', {
        userId: data.user.id,
        email: data.user.email,
      });

      // Invalidate and refetch current user
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
    },
    onError: (error) => {
      Sentry.captureException(error, {
        tags: { hook: 'useRegister' },
      });
    },
  });
};

// Logout Mutation
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => backendClient.auth.logout(),
    onSuccess: () => {
      // Clear Sentry user context
      Sentry.setUser(null);

      // Track analytics
      analytics.track('User Logged Out', {});

      // Clear all queries
      queryClient.clear();
    },
    onError: (error) => {
      Sentry.captureException(error, {
        tags: { hook: 'useLogout' },
      });
    },
  });
};

// Get Current User Query
export const useCurrentUser = () => {
  const query = useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: async () => {
      try {
        return await backendClient.auth.getCurrentUser();
      } catch (error: any) {
        // 404 or 401 means not logged in - this is OK, return null
        if (error?.statusCode === 404 || error?.statusCode === 401 || error?.code === 'ERR_BAD_REQUEST') {
          return null;
        }
        // Other errors - throw to be handled by React Query
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      // Don't retry on 404/401 (not logged in is OK)
      if (error?.statusCode === 404 || error?.statusCode === 401) {
        return false;
      }
      // Retry once for other errors
      return failureCount < 1;
    },
    refetchOnWindowFocus: false, // Don't refetch on focus to avoid 404 spam
    retryOnMount: false, // Don't retry on mount if it fails
    // ✅ FIX: Set timeout to prevent infinite loading
    meta: {
      timeout: 5000, // 5 second timeout
    },
  });

  // Handle errors gracefully (404 is expected when not logged in)
  React.useEffect(() => {
    if (query.error) {
      const error = query.error as any;
      // Only log non-404 errors (404 means not logged in, which is OK)
      if (error?.statusCode !== 404 && error?.code !== 'ERR_BAD_REQUEST') {
        errorTracking.captureException(query.error as Error, {
          action: 'useCurrentUser',
          metadata: { hook: 'useCurrentUser' },
        });
      }
    }
  }, [query.error]);

  return query;
};

// Update Profile Mutation
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      username,
      displayName,
      avatarUrl,
    }: {
      username: string;
      displayName: string;
      avatarUrl?: string | null;
    }) => {
      return apiClient.updateUserProfile({
        username,
        displayName,
        avatarUrl,
      });
    },
    onSuccess: () => {
      // Track analytics
      analytics.track('Profile Updated', {});

      // Invalidate and refetch current user
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
    },
    onError: (error) => {
      Sentry.captureException(error, {
        tags: { hook: 'useUpdateProfile' },
      });
    },
  });
};
