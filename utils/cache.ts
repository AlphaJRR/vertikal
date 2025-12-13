/**
 * AsyncStorage Cache Utility
 * 
 * Provides persistent caching for API responses and app data
 * 
 * Features:
 * - TTL (Time To Live) support
 * - Automatic expiration
 * - Type-safe storage
 * - Error handling
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl?: number; // Time to live in milliseconds
}

class CacheService {
  private prefix = 'vertikal_cache_';

  /**
   * Store data in cache with optional TTL
   */
  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    try {
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl,
      };

      await AsyncStorage.setItem(
        this.prefix + key,
        JSON.stringify(item)
      );
    } catch (error) {
      console.error('[Cache] Failed to set:', key, error);
      throw error;
    }
  }

  /**
   * Retrieve data from cache
   * Returns null if expired or not found
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const itemStr = await AsyncStorage.getItem(this.prefix + key);
      
      if (!itemStr) {
        return null;
      }

      const item: CacheItem<T> = JSON.parse(itemStr);

      // Check if expired
      if (item.ttl) {
        const age = Date.now() - item.timestamp;
        if (age > item.ttl) {
          // Expired, remove it
          await this.remove(key);
          return null;
        }
      }

      return item.data;
    } catch (error) {
      console.error('[Cache] Failed to get:', key, error);
      return null;
    }
  }

  /**
   * Remove item from cache
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.error('[Cache] Failed to remove:', key, error);
      throw error;
    }
  }

  /**
   * Clear all cached items
   */
  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.prefix));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('[Cache] Failed to clear:', error);
      throw error;
    }
  }

  /**
   * Get all cache keys
   */
  async getAllKeys(): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.replace(this.prefix, ''));
    } catch (error) {
      console.error('[Cache] Failed to get keys:', error);
      return [];
    }
  }

  /**
   * Check if key exists and is not expired
   */
  async has(key: string): Promise<boolean> {
    const data = await this.get(key);
    return data !== null;
  }

  /**
   * Get cache size (approximate)
   */
  async getSize(): Promise<number> {
    try {
      const keys = await this.getAllKeys();
      return keys.length;
    } catch (error) {
      console.error('[Cache] Failed to get size:', error);
      return 0;
    }
  }
}

export const cache = new CacheService();

// Convenience functions for common use cases

/**
 * Cache API response for 5 minutes
 */
export async function cacheApiResponse<T>(
  key: string,
  data: T,
  ttlMinutes: number = 5
): Promise<void> {
  await cache.set(key, data, ttlMinutes * 60 * 1000);
}

/**
 * Get cached API response
 */
export async function getCachedApiResponse<T>(key: string): Promise<T | null> {
  return await cache.get<T>(key);
}

/**
 * Cache user preferences (no expiration)
 */
export async function cacheUserPreference<T>(key: string, value: T): Promise<void> {
  await cache.set(key, value); // No TTL for user preferences
}

/**
 * Get cached user preference
 */
export async function getCachedUserPreference<T>(key: string): Promise<T | null> {
  return await cache.get<T>(key);
}

