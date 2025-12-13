/**
 * React Query Hook for Creators
 * Enterprise-grade data fetching with caching and error handling
 */

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Sentry from '@sentry/react-native';
import { apiClient } from '../services/api';
import { Creator } from '../types';
import { analytics } from '../services/analytics';
import { errorTracking } from '../services/errorTracking';

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
    // ✅ FIXED: Use actual API call instead of returning empty array
    // apiClient.getCreators() already transforms UserDTO[] to Creator[]
    const creators = await apiClient.getCreators();
    
    // Ensure we return an array even if API returns null/undefined
    if (!creators || !Array.isArray(creators)) {
      console.warn('[useCreators] Invalid response from API, returning empty array');
      return [];
    }
    
    return creators;
  } catch (error: any) {
    // Log error to tracking service
    errorTracking.captureError(error instanceof Error ? error : new Error(String(error)), {
      action: 'fetchCreators',
      metadata: { filters },
    });
    
    // Re-throw to let React Query handle it
    throw error;
  }
}

// Fetch Single Creator
async function fetchCreator(id: string): Promise<Creator> {
  try {
    if (!id) {
      throw new Error('Creator ID is required');
    }
    
    const creator = await apiClient.getCreatorById(id);
    
    if (!creator) {
      throw new Error(`Creator with ID ${id} not found`);
    }
    
    return creator;
  } catch (error: any) {
    // Log error to tracking service
    errorTracking.captureError(error instanceof Error ? error : new Error(String(error)), {
      action: 'fetchCreator',
      metadata: { creatorId: id },
    });
    
    // Re-throw to let React Query handle it
    throw error;
  }
}

// Subscribe to Creator
async function subscribeToCreator(creatorId: string): Promise<void> {
  try {
    await apiClient.subscribe(creatorId);
    analytics.trackSubscription(creatorId, 'monthly');
  } catch (error: any) {
    errorTracking.captureError(error, {
      action: 'subscribeToCreator',
      metadata: { creatorId },
    });
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
      errorTracking.captureError(query.error as Error, {
        action: 'useCreators',
      });
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
      errorTracking.captureError(query.error as Error, {
        action: 'useCreator',
        metadata: { creatorId: id },
      });
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

