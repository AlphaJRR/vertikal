/**
 * Setup Profile Screen
 * Allows users to complete their profile after registration
 * Includes image upload to Supabase Storage
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useQueryClient } from '@tanstack/react-query';
import { uploadAvatarToSupabase } from '../../utils/storage';
import { apiClient } from '../../services/api';
import { useCurrentUser, authKeys } from '../../hooks/useAuth';

interface SetupProfileScreenProps {
  navigation?: any; // Navigation prop from React Navigation
}

export const SetupProfileScreen: React.FC<SetupProfileScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Get current user to access user ID
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const queryClient = useQueryClient();

  /**
   * Pick image from device
   */
  const pickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera roll permissions to upload an avatar.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio for avatars
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  /**
   * Handle profile submission
   * ✅ Idempotent: Backend uses upsert, so repeated submits are safe
   */
  const handleSubmit = async () => {
    // Validation
    if (!username.trim() || !displayName.trim()) {
      Alert.alert('Missing Info', 'Please choose a username and display name.');
      return;
    }

    // Validate username format (basic check, backend will sanitize)
    if (username.trim().length < 3) {
      Alert.alert('Invalid Username', 'Username must be at least 3 characters.');
      return;
    }

    // Ensure we have user ID
    if (!currentUser?.id) {
      Alert.alert('Error', 'Unable to identify user. Please log in again.');
      return;
    }

    // ✅ Prevent duplicate submissions
    if (loading) {
      console.warn('[SetupProfileScreen] Submit already in progress - ignoring duplicate');
      return;
    }

    setLoading(true);
    
    console.log('[SetupProfileScreen] Starting profile creation:', {
      userId: currentUser.id,
      username: username.trim(),
      displayName: displayName.trim(),
      hasAvatar: !!avatarUri,
    });

    try {
      let finalAvatarUrl: string | null = null;

      // 1. If user picked an image, upload it first
      if (avatarUri) {
        finalAvatarUrl = await uploadAvatarToSupabase(avatarUri, currentUser.id);
        
        if (!finalAvatarUrl) {
          Alert.alert('Upload Failed', 'Failed to upload avatar. Please try again.');
          setLoading(false);
          return;
        }
      }

      // 3. Update/Create Profile in DB (idempotent upsert on backend)
      // ✅ Backend uses upsert keyed by user_id, so duplicate submits are safe
      const updatedUser = await apiClient.updateUserProfile({
        username: username.trim(),
        displayName: displayName.trim(),
        avatarUrl: finalAvatarUrl,
      });
      
      console.log('[SetupProfileScreen] Backend upsert completed successfully');

      console.log('Profile updated successfully:', updatedUser);

      // ✅ Invalidate and refetch current user to update ProfileGate
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
      
      // ✅ ProfileGate will automatically detect profile exists and show AppNavigator
      // No manual navigation needed - ProfileGate handles routing
      
      // Show success message
      Alert.alert('Success', 'Profile created successfully!', [
        {
          text: 'OK',
          // ProfileGate will automatically route to app once query refetches
        },
      ]);
    } catch (error: any) {
      console.error('[SetupProfileScreen] Profile creation error:', {
        message: error.message,
        statusCode: error.statusCode,
        code: error.code,
        userId: currentUser?.id,
      });
      
      // Display user-friendly error message
      let errorMessage = 'Failed to create profile. Please try again.';
      
      // Handle specific error cases
      if (error.statusCode === 409) {
        errorMessage = 'Username is already taken. Please choose another.';
      } else if (error.statusCode === 400) {
        errorMessage = error.message || 'Invalid profile data. Please check your inputs.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Complete Your Profile</Text>
      <Text style={styles.subtitle}>Set up your username and display name to get started</Text>

      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={pickImage}
          disabled={loading}
        >
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>+</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.changeAvatarButton}
          onPress={pickImage}
          disabled={loading}
        >
          <Text style={styles.changeAvatarText}>
            {avatarUri ? 'Change Avatar' : 'Add Avatar'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Username Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="johndoe"
          placeholderTextColor="#666"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />
        <Text style={styles.hint}>3-30 characters, lowercase letters, numbers, and underscores only</Text>
      </View>

      {/* Display Name Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Display Name</Text>
        <TextInput
          style={styles.input}
          placeholder="John Doe"
          placeholderTextColor="#666"
          value={displayName}
          onChangeText={setDisplayName}
          autoCapitalize="words"
          editable={!loading}
        />
        <Text style={styles.hint}>This is how others will see your name</Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.buttonText}>Complete Profile</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#999',
    fontSize: 14,
    marginBottom: 40,
    textAlign: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1A1A1A',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
    borderStyle: 'dashed',
  },
  avatarPlaceholderText: {
    color: '#666',
    fontSize: 48,
    fontWeight: '300',
  },
  changeAvatarButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  changeAvatarText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1A1A1A',
    color: '#FFF',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  hint: {
    color: '#666',
    fontSize: 12,
    marginTop: 6,
  },
  button: {
    backgroundColor: '#FFD700',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '900',
  },
});

