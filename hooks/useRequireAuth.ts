/**
 * Require Auth Hook
 * Shows login prompt for guest users attempting auth-required actions
 */

import { Alert } from 'react-native';
import { useGuestMode } from './useGuestMode';

export function useRequireAuth() {
  const { isGuest } = useGuestMode();

  const requireAuth = (action: string, onAuthenticated?: () => void) => {
    if (isGuest) {
      Alert.alert(
        'Create Account / Log In',
        `You need to create an account or log in to ${action}.`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Log In',
            onPress: () => {
              // ProfileGate will handle routing to LoginScreen
              // Force app reload to trigger ProfileGate check
              // In production, use proper navigation reset
              if (typeof window !== 'undefined' && window.location) {
                window.location.reload();
              }
            },
          },
        ]
      );
      return false;
    }
    
    if (onAuthenticated) {
      onAuthenticated();
    }
    return true;
  };

  return { requireAuth, isGuest };
}

