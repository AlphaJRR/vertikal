/**
 * VERTIKAL Backend Client SDK
 * Complete client for all backend API endpoints
 * 
 * This SDK provides type-safe access to all backend endpoints
 * with proper error handling and response transformation
 */

import api from './api'; // ✅ FIXED: api is default export, not named export
import { API_CONFIG } from '../config/api.config';
import * as SecureStore from 'expo-secure-store'; // ✅ FIXED: Use SecureStore directly for token management

// Types matching backend
export interface BackendApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  coinBalance: number;
  profile?: {
    displayName: string;
    bio?: string;
    avatarUrl?: string;
    type: 'VIEWER' | 'CREATOR' | 'NETWORK';
    isFounding50: boolean;
    followerCount: number;
    totalViews: number;
  };
}

export interface ShowData {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  genre: string;
  creator: {
    displayName: string;
    avatarUrl?: string;
    type: string;
  };
}

export interface EpisodeData {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  views: number;
}

export interface CommentData {
  id: string;
  content: string;
  timestamp?: number;
  isDanmaku: boolean;
  user: {
    username: string;
    avatarUrl?: string;
  };
  createdAt: string;
}

// Transform backend response to our API format
function transformResponse<T>(response: BackendApiResponse<T>): T {
  if (!response.success || !response.data) {
    throw new Error(response.error || 'API request failed');
  }
  return response.data;
}

/**
 * Users API Client
 */
export const usersApi = {
  /**
   * Get all users/creators
   * Backend endpoint: GET /api/users
   */
  async getAll(): Promise<UserProfile[]> {
    const response = await api.get<UserProfile[]>(
      API_CONFIG.endpoints.users.list()
    );
    // Backend returns array directly (not wrapped in {success, data})
    // Transform backend UserDTO[] to UserProfile[]
    const users = Array.isArray(response.data) ? response.data : [];
    return users.map((user: any) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      coinBalance: user.coinBalance || 0,
      profile: user.profile ? {
        displayName: user.profile.displayName || user.username,
        bio: user.profile.bio,
        avatarUrl: user.profile.avatarUrl,
        type: user.profile.type || 'VIEWER',
        isFounding50: user.profile.isFounding50 || false,
        followerCount: user.profile.followerCount || 0,
        totalViews: user.profile.totalViews || 0,
      } : undefined,
    }));
  },

  /**
   * Get user by ID
   */
  async getById(id: string): Promise<UserProfile> {
    const response = await api.get<UserProfile>(
      API_CONFIG.endpoints.users.get(id) // ✅ Function call is correct
    );
    // Backend returns object directly (not wrapped in {success, data})
    return response.data;
  },

  /**
   * Get user profile by username
   */
  async getProfile(username: string): Promise<UserProfile> {
    const response = await api.get<UserProfile>(
      API_CONFIG.endpoints.users.profile(username) // ✅ Function call is correct
    );
    // Backend returns object directly (not wrapped in {success, data})
    return response.data;
  },

  /**
   * Subscribe to a creator
   */
  async subscribe(creatorId: string): Promise<void> {
    await api.post(API_CONFIG.endpoints.users.subscribe(creatorId));
  },

  /**
   * Unsubscribe from a creator
   */
  async unsubscribe(creatorId: string): Promise<void> {
    await api.post(API_CONFIG.endpoints.users.unsubscribe(creatorId));
  },

  /**
   * Update user profile
   * Backend endpoint: PUT /api/users/profile
   */
  async updateProfile(data: { username: string; displayName: string; avatarUrl?: string | null }): Promise<UserProfile> {
    const response = await api.put<UserProfile>(
      API_CONFIG.endpoints.users.profile(''), // Empty string for current user
      data
    );
    return response.data;
  },
};

/**
 * Shows/Content API Client
 */
export const showsApi = {
  /**
   * Get all shows
   */
  async getAll(): Promise<ShowData[]> {
    const response = await api.get<ShowData[]>(
      API_CONFIG.endpoints.shows.list() // ✅ FIXED: Call function with ()
    );
    // Backend returns array directly (not wrapped in {success, data})
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Get show by ID
   */
  async getById(id: string): Promise<ShowData> {
    const response = await api.get<ShowData>(
      API_CONFIG.endpoints.shows.get(id) // ✅ FIXED: Function call is correct
    );
    // Backend returns object directly (not wrapped in {success, data})
    return response.data;
  },

  /**
   * Get popular shows
   */
  async getPopular(): Promise<ShowData[]> {
    const response = await api.get<ShowData[]>(
      API_CONFIG.endpoints.shows.popular() // ✅ FIXED: Call function with ()
    );
    // Backend returns array directly (not wrapped in {success, data})
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Get trending shows
   */
  async getTrending(): Promise<ShowData[]> {
    const response = await api.get<ShowData[]>(
      API_CONFIG.endpoints.shows.trending() // ✅ FIXED: Call function with ()
    );
    // Backend returns array directly (not wrapped in {success, data})
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Search shows
   */
  async search(query: string): Promise<ShowData[]> {
    const response = await api.get<ShowData[]>(
      `${API_CONFIG.endpoints.shows.search()}?q=${encodeURIComponent(query)}` // ✅ FIXED: Call function with ()
    );
    // Backend returns array directly (not wrapped in {success, data})
    return Array.isArray(response.data) ? response.data : [];
  },
};

/**
 * Comments API Client
 */
export const commentsApi = {
  /**
   * Get comments for an episode
   */
  async getByEpisode(episodeId: string): Promise<CommentData[]> {
    const response = await api.get<CommentData[]>(
      API_CONFIG.endpoints.comments.list(episodeId) // ✅ Function call is correct
    );
    // Backend returns array directly (not wrapped in {success, data})
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Create a comment
   */
  async create(episodeId: string, content: string, isDanmaku: boolean = false): Promise<CommentData> {
    const response = await api.post<CommentData>(
      API_CONFIG.endpoints.comments.create(episodeId), // ✅ Function call is correct
      { content, isDanmaku }
    );
    // Backend returns object directly (not wrapped in {success, data})
    return response.data;
  },
};

/**
 * Subscriptions API Client
 */
export const subscriptionsApi = {
  /**
   * Get user's subscriptions
   */
  async getAll(): Promise<any[]> {
    const response = await api.get<any[]>(
      API_CONFIG.endpoints.subscriptions.list // ✅ This is a string, not a function
    );
    // Backend returns array directly (not wrapped in {success, data})
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Get active subscriptions
   */
  async getActive(): Promise<any[]> {
    const response = await api.get<any[]>(
      API_CONFIG.endpoints.subscriptions.active // ✅ This is a string, not a function
    );
    // Backend returns array directly (not wrapped in {success, data})
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Subscribe to a creator
   */
  async subscribe(creatorId: string): Promise<void> {
    await api.post(
      API_CONFIG.endpoints.subscriptions.list, // ✅ This is a string, not a function
      { creatorId }
    );
    // Backend doesn't return wrapped response
  },
};

/**
 * Authentication API Client
 */
export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: UserProfile;
}

export const authApi = {
  /**
   * Login with email and password
   * Stores token securely using SecureStore
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    // Backend returns { token, user } directly (not wrapped in {success, data})
    const response = await api.post<{ token: string; user: UserProfile }>(
      API_CONFIG.endpoints.auth.login,
      { email, password }
    );
    
    const loginData: LoginResponse = {
      token: response.data.token,
      user: response.data.user,
    };
    
    // Store tokens securely
    if (loginData.token) {
      await SecureStore.setItemAsync('auth_token', loginData.token);
    }
    
    return loginData;
  },

  /**
   * Register new user
   */
  async register(email: string, password: string, username: string): Promise<LoginResponse> {
    // Backend returns { token, user } directly (not wrapped in {success, data})
    const response = await api.post<{ token: string; user: UserProfile }>(
      API_CONFIG.endpoints.auth.register,
      { email, password, username }
    );
    
    const registerData: LoginResponse = {
      token: response.data.token,
      user: response.data.user,
    };
    
    // Store tokens securely
    if (registerData.token) {
      await SecureStore.setItemAsync('auth_token', registerData.token);
    }
    
    return registerData;
  },

  /**
   * Logout - clears tokens
   */
  async logout(): Promise<void> {
    try {
      await api.post(API_CONFIG.endpoints.auth.logout);
    } catch (error) {
      // Continue even if logout endpoint fails
      console.error('Logout endpoint failed:', error);
    } finally {
      // Always clear tokens locally
      await SecureStore.deleteItemAsync('auth_token').catch(() => {});
      await SecureStore.deleteItemAsync('refresh_token').catch(() => {});
    }
  },

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<UserProfile> {
    const response = await api.get<UserProfile>(
      API_CONFIG.endpoints.auth.me
    );
    // Backend returns object directly (not wrapped in {success, data})
    return response.data;
  },
};

// Export all APIs
// ✅ FAIL-LOUD: Ensure api is initialized before exporting backendClient
if (!api) {
  throw new Error('API CLIENT NOT INITIALIZED - Check EXPO_PUBLIC_API_URL environment variable');
}

export const backendClient = {
  users: usersApi,
  usersApi: usersApi, // Alias for compatibility
  shows: showsApi,
  comments: commentsApi,
  subscriptions: subscriptionsApi,
  auth: authApi,
};

// Convenience methods matching your API style
export default {
  // Creators
  getCreatorById: async (id: string) => {
    return usersApi.getById(id);
  },

  // Projects/Shows
  getProjects: async () => {
    return showsApi.getAll();
  },
  
  getProjectById: async (id: string) => {
    return showsApi.getById(id);
  },

  // Subscriptions
  subscribe: async (creatorId: string) => {
    return subscriptionsApi.subscribe(creatorId);
  },

  // Authentication
  login: async (email: string, password: string) => {
    return authApi.login(email, password);
  },
};

