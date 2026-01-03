/**
 * ProfileGate Component
 * Auto-routes to CreateProfile when profile is missing
 * Handles all profile state logic in one place
 */

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useCurrentUser } from '../../hooks/useAuth';
import { SetupProfileScreen } from '../../screens/auth/SetupProfileScreen';
import { LoginScreen } from '../../screens/auth/LoginScreen';

// Loading skeleton component
const ProfileSkeleton: React.FC = () => (
  <View style={styles.centerContainer}>
    <ActivityIndicator size="large" color="#FFD700" />
    <Text style={styles.loadingText}>Loading profile...</Text>
  </View>
);

// Recovery UI for real errors
interface ProfileRecoveryProps {
  error: Error;
  onRetry: () => void;
}

const ProfileRecovery: React.FC<ProfileRecoveryProps> = ({ error, onRetry }) => (
  <View style={styles.centerContainer}>
    <Text style={styles.errorTitle}>Connection Lost</Text>
    <Text style={styles.errorMessage}>{error.message || 'Failed to load profile'}</Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryText}>RETRY</Text>
    </TouchableOpacity>
  </View>
);

/**
 * ProfileGate - Single source of truth for profile routing
 * 
 * Behavior:
 * 1. Profile exists → Render Profile (via AppNavigator)
 * 2. Profile does NOT exist (404 / null) → Auto-route to CreateProfile
 * 3. Real error (RLS/network/500) → Show Recovery UI with Retry
 */
export const ProfileGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: currentUser, isLoading, error, refetch } = useCurrentUser();

  // Loading state
  if (isLoading) {
    return <ProfileSkeleton />;
  }

  // Not logged in (404/401 on auth check)
  // For now, show a simple login prompt - LoginScreen can be integrated later
  if (!currentUser || error?.statusCode === 404 || error?.statusCode === 401) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Not Logged In</Text>
        <Text style={styles.errorMessage}>Please log in to continue</Text>
        <Text style={styles.errorMessage}>Login screen integration pending</Text>
      </View>
    );
  }

  // Real error (network, 500, etc.) - show recovery UI
  if (error) {
    return <ProfileRecovery error={error as Error} onRetry={() => refetch()} />;
  }

  // Profile missing (user exists but no profile record)
  // Check if profile exists and has required fields
  const profileExists = currentUser.profile && 
    currentUser.profile.displayName && 
    currentUser.profile.avatarUrl;

  if (!profileExists) {
    return <SetupProfileScreen />;
  }

  // Profile exists - render app content
  return <>{children}</>;
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#999999',
    marginTop: 16,
    fontSize: 14,
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 10,
  },
  errorMessage: {
    color: '#999999',
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 14,
  },
  retryButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
  },
  retryText: {
    color: '#000000',
    fontWeight: '900',
    fontSize: 14,
  },
});

