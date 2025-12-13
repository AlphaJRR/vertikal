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
    queryFn: () => backendClient.auth.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: true,
  });

  // Handle errors
  React.useEffect(() => {
    if (query.error) {
      errorTracking.captureException(query.error as Error, {
        action: 'useCurrentUser',
        metadata: { hook: 'useCurrentUser' },
      });
    }
  }, [query.error]);

  return query;
};

