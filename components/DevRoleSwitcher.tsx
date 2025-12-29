/**
 * Dev Role Switcher Component
 * COPILOT — Frontend Engineer
 * 
 * Purpose: Allow testing as Viewer vs Creator without logging out
 * Only visible in development mode
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useCurrentUser } from '../hooks/useAuth';
import { apiClient } from '../services/api';
import { useQueryClient } from '@tanstack/react-query';

export const DevRoleSwitcher: React.FC = () => {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();

  // Only show in development
  if (!__DEV__) {
    return null;
  }

  const currentRole = user?.profile?.type || 'VIEWER';
  const isViewer = currentRole === 'VIEWER';
  const isCreator = currentRole === 'CREATOR' || currentRole === 'NETWORK';

  const switchRole = async (newRole: 'VIEWER' | 'CREATOR') => {
    try {
      console.log(`🔄 Dev Mode: Switching role to ${newRole}...`);
      
      // Update profile via API (if endpoint exists)
      // For now, we'll just update local state for UI testing
      // In production, this would call: await apiClient.updateUserProfile({ role: newRole });
      
      // Simulate role switch for UI testing
      Alert.alert(
        'Role Switched (Dev Mode)',
        `You are now viewing as: ${newRole}\n\nNote: This is a UI-only switch for testing. Database role unchanged.`,
        [{ text: 'OK' }]
      );
      
      // Invalidate user query to refetch
      queryClient.invalidateQueries({ queryKey: ['auth', 'currentUser'] });
    } catch (e: any) {
      console.error('Error switching role:', e);
      Alert.alert('Error', 'Could not switch role: ' + (e.message || 'Unknown error'));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>DEV MODE: SWITCH ROLE</Text>
      <View style={styles.row}>
        <TouchableOpacity 
          style={[styles.btn, isViewer && styles.active]} 
          onPress={() => switchRole('VIEWER')}
        >
          <Text style={[styles.btnText, isViewer && styles.activeText]}>VIEWER</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.btn, isCreator && styles.active]} 
          onPress={() => switchRole('CREATOR')}
        >
          <Text style={[styles.btnText, isCreator && styles.activeText]}>CREATOR</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.hint}>Current: {currentRole}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    backgroundColor: '#111', 
    borderTopWidth: 1, 
    borderColor: '#333',
    marginTop: 'auto',
  },
  label: { 
    color: '#666', 
    fontSize: 10, 
    marginBottom: 10, 
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 1,
  },
  row: { 
    flexDirection: 'row', 
    gap: 10,
    marginBottom: 8,
  },
  btn: { 
    flex: 1, 
    padding: 12, 
    backgroundColor: '#222', 
    borderRadius: 8, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  active: { 
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  btnText: { 
    color: '#999', 
    fontWeight: '700', 
    fontSize: 12,
    letterSpacing: 1,
  },
  activeText: {
    color: '#FFFFFF',
  },
  hint: {
    color: '#444',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
});

