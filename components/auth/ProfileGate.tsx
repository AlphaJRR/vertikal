import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { supabase } from '../../lib/supabase';
import { LoginScreen } from '../../screens/auth/LoginScreen';
import { SetupProfileScreen } from '../../screens/auth/SetupProfileScreen';
import { useCurrentUser } from '../../hooks/useAuth';
import { useGuestMode } from '../../hooks/useGuestMode';

interface ProfileGateProps {
  children: React.ReactNode;
}

export function ProfileGate({ children }: ProfileGateProps) {
  const [bootLoading, setBootLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const { isGuest, isLoading: guestLoading, disableGuestMode } = useGuestMode();
  const { data: currentUser, isLoading: profileLoading } = useCurrentUser();

  // Set up Supabase auth listener
  useEffect(() => {
    // Check if supabase is initialized
    if (!supabase || !supabase.auth) {
      console.warn('Supabase not initialized, skipping auth listener');
      setBootLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setBootLoading(false);
    }).catch((error) => {
      console.error('Error getting session:', error);
      setBootLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // If user logs in, disable guest mode
      if (session) {
        disableGuestMode();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [disableGuestMode]);

  // Boot loading state
  if (bootLoading || guestLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Loading VERTIKAL...</Text>
      </View>
    );
  }

  // Deterministic gate logic
  if (session) {
    // User has session
    if (profileLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      );
    }
    
    if (!currentUser?.profile) {
      // No profile → Create Profile
      return <SetupProfileScreen />;
    }
    
    // Authenticated + Profile exists → Show app
    return <>{children}</>;
  }

  // No session
  if (isGuest) {
    // Guest mode → Show app with restrictions
    return <>{children}</>;
  }

  // No session and not guest → Login
  return <LoginScreen />;
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#FFD700',
    marginTop: 16,
    fontSize: 16,
    fontWeight: '700',
  },
});
