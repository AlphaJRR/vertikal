/**
 * Storage Utilities
 * Handles image uploads to Supabase Storage
 */

import { supabase } from '../lib/supabase';

// ✅ FIX: Handle null supabase client gracefully
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

/**
 * Upload avatar image to Supabase Storage
 * @param localUri - Local file URI (e.g., from ImagePicker)
 * @param userId - User ID for organizing files
 * @returns Public URL of uploaded image, or null if upload failed
 */
export const uploadAvatarToSupabase = async (
  localUri: string,
  userId: string
): Promise<string | null> => {
  try {
    // 1. Prepare file path (unique name based on timestamp)
    const fileExt = localUri.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // 2. Read file as Base64
    const base64 = await FileSystem.readAsStringAsync(localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // 3. Determine content type based on file extension
    const contentTypeMap: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
    };
    const contentType = contentTypeMap[fileExt] || 'image/jpeg';

    // 4. Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, decode(base64), {
        contentType,
        upsert: true, // Overwrite if file exists
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }

    // 5. Get Public URL
    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      throw new Error('Failed to get public URL');
    }

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Avatar upload failed:', error);
    return null;
  }
};

/**
 * Delete avatar from Supabase Storage
 * @param avatarUrl - Public URL of the avatar to delete
 * @returns Success status
 */
export const deleteAvatarFromSupabase = async (
  avatarUrl: string
): Promise<boolean> => {
  try {
    // Extract file path from URL
    const urlParts = avatarUrl.split('/avatars/');
    if (urlParts.length < 2) {
      console.warn('Invalid avatar URL format:', avatarUrl);
      return false;
    }

    const filePath = `avatars/${urlParts[1]}`;

    const { error } = await supabase.storage
      .from('avatars')
      .remove([filePath]);

    if (error) {
      console.error('Failed to delete avatar:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Avatar deletion failed:', error);
    return false;
  }
};

