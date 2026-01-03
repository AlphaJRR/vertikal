/**
 * Guest Mode Hook
 * Manages guest mode state and persistence
 */

import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GUEST_MODE_KEY = '@vertikal:isGuest';

export function useGuestMode() {
  const [isGuest, setIsGuest] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load guest mode state on mount
  useEffect(() => {
    loadGuestMode();
  }, []);

  const loadGuestMode = async () => {
    try {
      const value = await AsyncStorage.getItem(GUEST_MODE_KEY);
      setIsGuest(value === 'true');
    } catch (error) {
      console.error('Error loading guest mode:', error);
      setIsGuest(false);
    } finally {
      setIsLoading(false);
    }
  };

  const enableGuestMode = async () => {
    try {
      await AsyncStorage.setItem(GUEST_MODE_KEY, 'true');
      setIsGuest(true);
    } catch (error) {
      console.error('Error enabling guest mode:', error);
    }
  };

  const disableGuestMode = async () => {
    try {
      await AsyncStorage.removeItem(GUEST_MODE_KEY);
      setIsGuest(false);
    } catch (error) {
      console.error('Error disabling guest mode:', error);
    }
  };

  return {
    isGuest: isGuest ?? false,
    isLoading,
    enableGuestMode,
    disableGuestMode,
  };
}

