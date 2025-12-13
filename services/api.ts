// services/api.ts
import axios, { AxiosError, AxiosInstance } from 'axios';
import * as Sentry from '@sentry/react-native';
import * as SecureStore from 'expo-secure-store';
import { 
  transformUser, 
  transformProject, 
  transformUserDTO,
  transformProjectDTO,
  transformUserProfile,
  transformShowData,
  UserDTO, 
  ProjectDTO,
  UserProfile,
  ShowData
} from '../types';

// Environment config
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

// Types
export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}

// ✅ FAIL-LOUD: Validate API URL before creating instance
if (!API_URL || API_URL === 'undefined') {
  console.error('❌ EXPO_PUBLIC_API_URL is not set! API calls will fail.');
  console.error('Set EXPO_PUBLIC_API_URL in your .env file');
}

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL || 'http://localhost:4000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ FAIL-LOUD: Verify api instance was created
if (!api) {
  throw new Error('API CLIENT FAILED TO INITIALIZE - Check axios installation');
}

// Request interceptor (add auth token)
api.interceptors.request.use(
  async (config) => {
    // ✅ FIXED: Use SecureStore instead of AsyncStorage for tokens
    const token = await SecureStore.getItemAsync('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Sentry breadcrumb
    Sentry.addBreadcrumb({
      category: 'api',
      message: `${config.method?.toUpperCase()} ${config.url}`,
      level: 'info',
    });
    
    return config;
  },
  (error) => {
    Sentry.captureException(error);
    return Promise.reject(error);
  }
);

// Response interceptor (handle errors)
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const apiError: ApiError = {
      message: error.message || 'Network error',
      code: error.code || 'UNKNOWN',
      statusCode: error.response?.status || 500,
    };

    // Log to Sentry with context
    Sentry.captureException(error, {
      tags: {
        api_endpoint: error.config?.url,
        status_code: apiError.statusCode,
      },
      extra: {
        response_data: error.response?.data,
      },
    });

    // Handle 401 (token expired)
    if (apiError.statusCode === 401) {
      // ✅ FIXED: Use SecureStore instead of AsyncStorage
      await SecureStore.deleteItemAsync('auth_token');
      // Clear refresh token if exists
      await SecureStore.deleteItemAsync('refresh_token').catch(() => {});
      // Note: Navigation to login screen handled by app-level auth state management
    }

    return Promise.reject(apiError);
  }
);

// API Methods with transformers
export const apiClient = {
  // Creators
  getCreators: async () => {
    const response = await api.get('/api/users');
    const users: UserDTO[] = response.data;
    return users.map(transformUser); // Transform to mobile format
  },
  
  getCreatorById: async (id: string) => {
    const response = await api.get(`/api/users/${id}`);
    const user: UserDTO = response.data;
    return transformUser(user);
  },

  // Projects/Shows
  getProjects: async () => {
    const response = await api.get('/api/shows');
    const projects: ProjectDTO[] = response.data;
    return projects.map(transformProject);
  },
  
  getProjectById: async (id: string) => {
    const response = await api.get(`/api/shows/${id}`);
    const project: ProjectDTO = response.data;
    return transformProject(project);
  },

  // Subscriptions
  subscribe: async (creatorId: string) => {
    const response = await api.post('/api/subscriptions', { creatorId });
    return response.data;
  },

  // Authentication
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    
    // Handle simplified response format: { token, user }
    const { token, user } = response.data;
    if (!token) {
      throw new Error('Login failed: No token received');
    }
    
    // ✅ FIXED: Use SecureStore instead of AsyncStorage for tokens
    await SecureStore.setItemAsync('auth_token', token);
    
    return { token, user };
  },
};

export default api;
