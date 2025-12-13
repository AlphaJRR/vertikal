/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

export const API_CONFIG = {
  baseURL: __DEV__
    ? process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000'
    : process.env.EXPO_PUBLIC_API_URL || 'https://api.vertikal.app',
  
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000,
  
  endpoints: {
    // Auth
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      refresh: '/api/auth/refresh',
      logout: '/api/auth/logout',
      me: '/api/auth/me',
    },
    
    // Users & Creators
    users: {
      list: () => '/api/users',
      get: (id: string) => `/api/users/${id}`,
      profile: (id: string) => `/api/users/${id}/profile`,
      followers: (id: string) => `/api/users/${id}/followers`,
      following: (id: string) => `/api/users/${id}/following`,
      subscribe: (id: string) => `/api/users/${id}/subscribe`,
      unsubscribe: (id: string) => `/api/users/${id}/unsubscribe`,
    },
    
    // Content
    shows: {
      list: () => '/api/shows',
      get: (id: string) => `/api/shows/${id}`,
      episodes: (id: string) => `/api/shows/${id}/episodes`,
      popular: () => '/api/shows/popular',
      trending: () => '/api/shows/trending',
      search: () => '/api/shows/search',
    },
    
    // Interactions
    interactions: {
      like: (type: string, id: string) => `/interactions/${type}/${id}/like`,
      unlike: (type: string, id: string) => `/interactions/${type}/${id}/unlike`,
      bookmark: (id: string) => `/interactions/episodes/${id}/bookmark`,
      view: (id: string) => `/interactions/episodes/${id}/view`,
    },
    
    // Comments
    comments: {
      list: (episodeId: string) => `/episodes/${episodeId}/comments`,
      create: (episodeId: string) => `/episodes/${episodeId}/comments`,
      update: (commentId: string) => `/comments/${commentId}`,
      delete: (commentId: string) => `/comments/${commentId}`,
    },
    
    // Subscriptions
    subscriptions: {
      list: '/subscriptions',
      active: '/subscriptions/active',
      cancel: (id: string) => `/subscriptions/${id}/cancel`,
    },
    
    // Transactions
    transactions: {
      list: '/transactions',
      create: '/transactions',
      get: (id: string) => `/transactions/${id}`,
    },
  },
};

