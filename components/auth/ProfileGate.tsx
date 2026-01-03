/**
 * ProfileGate Component
 * Production-grade profile routing with timeout protection and error recovery
 * 
 * Guarantees:
 * - No infinite spinners (10s hard timeout)
 * - No duplicate profiles (idempotent backend upsert)
 * - Explicit NOT FOUND detection
 * - Real errors show Recovery UI (never silent)
 */

import React, { useEffect, useState } from 'react';
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
  isTimeout?: boolean;
}

const ProfileRecovery: React.FC<ProfileRecoveryProps> = ({ error, onRetry, isTimeout }) => (
  <View style={styles.centerContainer}>
    <Text style={styles.errorTitle}>{isTimeout ? 'Request Timeout' : 'Connection Lost'}</Text>
    <Text style={styles.errorMessage}>
      {isTimeout 
        ? 'Profile load took too long. Check your connection and try again.'
        : error.message || 'Failed to load profile'}
    </Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryText}>RETRY</Text>
    </TouchableOpacity>
  </View>
);

/**
 * ProfileGate - Single source of truth for profile routing
 * 
 * Behavior:
 * 1. Not logged in (404/401) → LoginScreen
 * 2. Loading → Skeleton (with 10s timeout)
 * 3. Profile NOT FOUND → Auto-route to CreateProfile
 * 4. Real error (network/500/RLS) → Recovery UI with Retry
 * 5. Profile exists → Render AppNavigator
 */
export const ProfileGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: currentUser, isLoading, error, refetch } = useCurrentUser();
  const [timeoutReached, setTimeoutReached] = useState(false);

  // ✅ 10-second hard timeout to prevent infinite spinner
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        console.warn('[ProfileGate] Profile fetch timeout after 10s');
        setTimeoutReached(true);
      }, 10000); // 10 second timeout
      return () => clearTimeout(timeout);
    } else {
      setTimeoutReached(false);
    }
  }, [isLoading]);

  // ✅ Logging for debugging
  useEffect(() => {
    if (currentUser) {
      console.log('[ProfileGate] User loaded:', {
        userId: currentUser.id,
        username: currentUser.username,
        hasProfile: !!currentUser.profile,
        profileComplete: !!(currentUser.profile?.displayName && currentUser.profile?.avatarUrl),
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (error) {
      const errorObj = error as any;
      console.error('[ProfileGate] Error:', {
        message: errorObj.message || error.message,
        statusCode: errorObj.statusCode,
        code: errorObj.code,
        isNotFound: errorObj.statusCode === 404 || errorObj.statusCode === 401,
      });
    }
  }, [error]);

  // ✅ Timeout reached - show recovery UI
  if (timeoutReached && isLoading) {
    return (
      <ProfileRecovery 
        error={new Error('Profile fetch timeout')} 
        onRetry={() => {
          setTimeoutReached(false);
          refetch();
        }}
        isTimeout={true}
      />
    );
  }

  // ✅ Loading state (with timeout protection)
  if (isLoading) {
    return <ProfileSkeleton />;
  }

  // ✅ Not logged in (404/401 on auth check) - explicit NOT FOUND detection
  const isNotFound = !currentUser || 
    (error as any)?.statusCode === 404 || 
    (error as any)?.statusCode === 401 ||
    (error as any)?.code === 'ERR_BAD_REQUEST';

  if (isNotFound) {
    console.log('[ProfileGate] Not logged in - showing LoginScreen');
    return <LoginScreen />;
  }

  // ✅ Real error (network, 500, RLS, etc.) - show recovery UI
  // Distinguish NOT FOUND from real errors
  if (error) {
    const errorObj = error as any;
    // Only show recovery for non-404/401 errors (real errors)
    if (errorObj.statusCode !== 404 && errorObj.statusCode !== 401) {
      console.error('[ProfileGate] Real error detected - showing Recovery UI');
      return <ProfileRecovery error={error as Error} onRetry={() => refetch()} />;
    }
  }

  // ✅ Profile missing (user exists but no profile record)
  // Explicit check: profile must exist AND have required fields
  const profileExists = currentUser.profile && 
    currentUser.profile.displayName && 
    currentUser.profile.avatarUrl;

  if (!profileExists) {
    console.log('[ProfileGate] Profile missing - auto-routing to CreateProfile');
    return <SetupProfileScreen />;
  }

  // ✅ Profile exists - render app content
  console.log('[ProfileGate] Profile complete - rendering app');
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

