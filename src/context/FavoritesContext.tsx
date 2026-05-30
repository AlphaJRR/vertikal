/**
 * Favorites Context - Manages favorite podcasts and videos
 * Uses localStorage for persistence
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FavoritesContextType {
  favoritePodcasts: string[];
  favoriteVideos: string[];
  togglePodcastFavorite: (id: string) => void;
  toggleVideoFavorite: (id: string) => void;
  isPodcastFavorite: (id: string) => boolean;
  isVideoFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PODCASTS: 'ava_media_favorite_podcasts',
  VIDEOS: 'ava_media_favorite_videos',
};

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favoritePodcasts, setFavoritePodcasts] = useState<string[]>([]);
  const [favoriteVideos, setFavoriteVideos] = useState<string[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const savedPodcasts = localStorage.getItem(STORAGE_KEYS.PODCASTS);
      const savedVideos = localStorage.getItem(STORAGE_KEYS.VIDEOS);
      
      if (savedPodcasts) {
        setFavoritePodcasts(JSON.parse(savedPodcasts));
      }
      if (savedVideos) {
        setFavoriteVideos(JSON.parse(savedVideos));
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
    }
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PODCASTS, JSON.stringify(favoritePodcasts));
    } catch (error) {
      console.error('Error saving favorite podcasts:', error);
    }
  }, [favoritePodcasts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(favoriteVideos));
    } catch (error) {
      console.error('Error saving favorite videos:', error);
    }
  }, [favoriteVideos]);

  const togglePodcastFavorite = (id: string) => {
    setFavoritePodcasts(prev => {
      if (prev.includes(id)) {
        return prev.filter(favId => favId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const toggleVideoFavorite = (id: string) => {
    setFavoriteVideos(prev => {
      if (prev.includes(id)) {
        return prev.filter(favId => favId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const isPodcastFavorite = (id: string): boolean => {
    return favoritePodcasts.includes(id);
  };

  const isVideoFavorite = (id: string): boolean => {
    return favoriteVideos.includes(id);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoritePodcasts,
        favoriteVideos,
        togglePodcastFavorite,
        toggleVideoFavorite,
        isPodcastFavorite,
        isVideoFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};
