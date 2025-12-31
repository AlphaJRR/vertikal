/**
 * React Query Hook for Projects/Shows
 * Enterprise-grade data fetching with caching and error handling
 */

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { backendClient, ShowData } from '../services/backendClient';
import { analytics } from '../services/analytics';
import { errorTracking } from '../services/errorTracking';
import { transformShowDataToProject } from '../utils/dataTransform';
import { Project } from '../data';

// Query Keys
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...projectKeys.lists(), filters] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
  popular: () => [...projectKeys.all, 'popular'] as const,
  trending: () => [...projectKeys.all, 'trending'] as const,
};

// Fetch Projects/Shows
// Transforms backend ShowData[] to mobile Project[] format
async function fetchProjects(): Promise<Project[]> {
  try {
    // ✅ FAIL-LOUD: Check backendClient is initialized
    if (!backendClient || !backendClient.shows) {
      const error = new Error('backendClient.shows is not initialized. Check API configuration.');
      errorTracking.captureError(error, {
        action: 'fetchProjects',
        metadata: { issue: 'backendClient_not_initialized' },
      });
      throw error;
    }
    
    const shows = await backendClient.shows.getAll();
    
    // ✅ Validate response
    if (!Array.isArray(shows)) {
      const error = new Error('Invalid API response: expected array of shows');
      errorTracking.captureError(error, {
        action: 'fetchProjects',
        metadata: { responseType: typeof shows },
      });
      throw error;
    }
    
    // Transform: ShowData (coverImage) → Project (img)
    return shows.map(transformShowDataToProject);
  } catch (error: any) {
    // ✅ Enhanced error handling for 500 errors
    if (error?.response?.status === 500 || error?.code === 'ERR_NETWORK') {
      errorTracking.captureError(error, {
        action: 'fetchProjects',
        metadata: {
          statusCode: error?.response?.status,
          code: error?.code,
          message: error?.message,
          apiUrl: process.env.EXPO_PUBLIC_API_URL || 'not_set',
        },
      });
      
      // Return empty array instead of throwing to prevent app crash
      console.warn('⚠️ API error in fetchProjects, returning empty array:', error.message);
      return [];
    }
    
    errorTracking.captureError(error, {
      action: 'fetchProjects',
    });
    throw error;
  }
}

// Fetch Single Project
// Transforms backend ShowData to mobile Project format
async function fetchProject(id: string): Promise<Project> {
  try {
    const show = await backendClient.shows.getById(id);
    // Transform: ShowData (coverImage) → Project (img)
    return transformShowDataToProject(show);
  } catch (error: any) {
    errorTracking.captureError(error, {
      action: 'fetchProject',
      metadata: { projectId: id },
    });
    throw error;
  }
}

// Fetch Popular Projects
// Transforms backend ShowData[] to mobile Project[] format
async function fetchPopularProjects(): Promise<Project[]> {
  try {
    // ✅ FAIL-LOUD: Check backendClient is initialized
    if (!backendClient || !backendClient.shows) {
      throw new Error('backendClient.shows is not initialized. Check API configuration.');
    }
    const shows = await backendClient.shows.getPopular();
    // Transform: ShowData (coverImage) → Project (img)
    return shows.map(transformShowDataToProject);
  } catch (error: any) {
    errorTracking.captureError(error, {
      action: 'fetchPopularProjects',
    });
    throw error;
  }
}

// Hooks
export function useProjects() {
  const query = useQuery({
    queryKey: projectKeys.list(),
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      // ✅ Don't retry on 500 errors or network errors (they'll likely fail again)
      if (error?.response?.status === 500 || error?.code === 'ERR_NETWORK') {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    // ✅ Return empty array as fallback instead of undefined
    placeholderData: [],
  });

  React.useEffect(() => {
    if (query.error) {
      errorTracking.captureError(query.error as Error, {
        action: 'useProjects',
        metadata: {
          statusCode: (query.error as any)?.response?.status,
          code: (query.error as any)?.code,
        },
      });
    }
  }, [query.error]);

  return query;
}

export function useProject(id: string) {
  const query = useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => fetchProject(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  React.useEffect(() => {
    if (query.error) {
      errorTracking.captureError(query.error as Error, {
        action: 'useProject',
        metadata: { projectId: id },
      });
    }
  }, [query.error, id]);

  return query;
}

export function usePopularProjects() {
  const query = useQuery({
    queryKey: projectKeys.popular(),
    queryFn: fetchPopularProjects,
    staleTime: 10 * 60 * 1000, // 10 minutes (popular content changes less)
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });

  React.useEffect(() => {
    if (query.error) {
      errorTracking.captureError(query.error as Error, {
        action: 'usePopularProjects',
      });
    }
  }, [query.error]);

  return query;
}

