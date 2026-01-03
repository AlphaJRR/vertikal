/**
 * React Query Hook for Creators
 * Enterprise-grade data fetching with caching and error handling
 */

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Sentry from '@sentry/react-native';
import { backendClient, UserProfile } from '../services/backendClient';
import { Creator } from '../types';
import { analytics } from '../services/analytics';
import { errorTracking } from '../services/errorTracking';
import { ApiError, isApiError } from '../types/api';

// Re-export Creator type from types/index.ts
export type { Creator } from '../types';

// Query Keys
export const creatorKeys = {
  all: ['creators'] as const,
  lists: () => [...creatorKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...creatorKeys.lists(), filters] as const,
  details: () => [...creatorKeys.all, 'detail'] as const,
  detail: (id: string) => [...creatorKeys.details(), id] as const,
};

// Fetch Creators - Fixed to use actual API call
async function fetchCreators(filters?: Record<string, any>): Promise<Creator[]> {
  try {
    // Use backendClient.users.getAll() to fetch creators
    const users = await backendClient.users.getAll();
    
    // Transform UserProfile[] to Creator[]
    const creators: Creator[] = users.map((user: UserProfile) => ({
      id: user.id,
      name: user.profile?.displayName || user.username,
      type: user.profile?.type === 'NETWORK' ? 'network' : 'creator',
      avatar: user.profile?.avatarUrl || '',
      role: user.profile?.type || 'Creator',
      isFounding50: user.profile?.isFounding50 || false,
      bio: user.profile?.bio,
      stats: {
        fans: user.profile?.followerCount?.toString() || '0',
        series: '0', // TODO: Get from shows count
      },
    }));
    
    return creators;
  } catch (error: unknown) {
    // Log error to tracking service
    errorTracking.captureError();
    
    // Return empty array on error to prevent crash
    return [];
  }
}

// Fetch Single Creator
async function fetchCreator(id: string): Promise<Creator> {
  try {
    if (!id) {
      throw new Error('Creator ID is required');
    }
    
    const user = await backendClient.users.getById(id);
    
    if (!user) {
      throw new Error(`Creator with ID ${id} not found`);
    }
    
    return {
      id: user.id,
      name: user.profile?.displayName || user.username,
      type: user.profile?.type === 'NETWORK' ? 'network' : 'creator',
      avatar: user.profile?.avatarUrl || '',
      role: user.profile?.type || 'Creator',
      isFounding50: user.profile?.isFounding50 || false,
      bio: user.profile?.bio,
      stats: {
        fans: user.profile?.followerCount?.toString() || '0',
        series: '0',
      },
    };
  } catch (error: unknown) {
    // Log error to tracking service
    errorTracking.captureError();
    
    // Re-throw to let React Query handle it
    throw error;
  }
}

// Subscribe to Creator
async function subscribeToCreator(creatorId: string): Promise<void> {
  try {
    await backendClient.subscriptions.subscribe(creatorId);
    analytics.trackSubscription(creatorId, 'monthly');
  } catch (error: unknown) {
    errorTracking.captureError();
    throw error;
  }
}

// Hooks
export function useCreators(filters?: Record<string, any>) {
  const query = useQuery({
    queryKey: creatorKeys.list(filters),
    queryFn: () => fetchCreators(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 1, // Reduced retries since endpoint may not exist yet
    refetchOnWindowFocus: false,
    // Allow fallback to mock data if API fails
    throwOnError: false,
  });

  // Handle errors (React Query v5 doesn't have onError callback)
  React.useEffect(() => {
    if (query.error) {
      errorTracking.captureError();
    }
  }, [query.error]);

  return query;
}

export function useCreator(id: string) {
  const query = useQuery({
    queryKey: creatorKeys.detail(id),
    queryFn: () => fetchCreator(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  // Handle errors (React Query v5 doesn't have onError callback)
  React.useEffect(() => {
    if (query.error) {
      errorTracking.captureError();
    }
  }, [query.error, id]);

  return query;
}

export function useSubscribeToCreator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subscribeToCreator,
    onSuccess: (_, creatorId) => {
      // Add Sentry breadcrumb
      Sentry.addBreadcrumb({
        category: 'subscription',
        message: 'User subscribed to creator',
        level: 'info',
        data: { creatorId },
      });

      // Invalidate and refetch creators list
      queryClient.invalidateQueries({ queryKey: creatorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: creatorKeys.detail(creatorId) });
      
      analytics.track('Creator Subscribed', { creatorId });
    },
    onError: (error) => {
      Sentry.captureException(error, {
        tags: { hook: 'useSubscribe' },
      });
    },
  });
}

// Alias for consistency with your API style
export const useSubscribe = useSubscribeToCreator;

