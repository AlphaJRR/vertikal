/**
 * Media detail — attendee-facing photo or video.
 *
 * Free full-res download: saved to camera roll via expo-media-library.
 */

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system/legacy';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import { brandColors, brandFonts } from '@/constants/theme';
import { isVideoMediaKind } from '@/lib/eventMedia';
import { useAttendeeGallery } from '@/hooks/useAttendeeGallery';
import { saveImageToPhotoLibrary } from '@/lib/mediaLibrary';

function GalleryVideoPlayer({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
  });

  return (
    <VideoView
      player={player}
      style={styles.media}
      contentFit="contain"
      nativeControls
    />
  );
}

export default function PhotoDetailScreen() {
  const { photoId }  = useLocalSearchParams<{ photoId: string }>();
  const router       = useRouter();
  const insets       = useSafeAreaInsets();
  const { items, getSignedUrl } = useAttendeeGallery();

  const item = items.find(i => i.photo.id === photoId);
  const isVideo = item ? isVideoMediaKind(item.photo.media_kind) : false;

  const [previewUrl,  setPreviewUrl]  = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!photoId) return;
    void getSignedUrl(photoId, isVideo ? 'original' : 'preview').then(setPreviewUrl);
  }, [photoId, getSignedUrl, isVideo]);

  const handleFreeDownload = async () => {
    if (!photoId) return;
    setDownloading(true);
    try {
      const url = await getSignedUrl(photoId, 'original');
      if (!url) {
        Alert.alert('Error', 'Could not generate download link. Please try again.');
        return;
      }

      const ext = isVideo ? 'mp4' : 'jpg';
      const fileName = `ava-${isVideo ? 'video' : 'photo'}-${photoId.slice(0, 8)}.${ext}`;
      const localUri = `${FileSystem.cacheDirectory}${fileName}`;
      await FileSystem.downloadAsync(url, localUri);

      const saved = await saveImageToPhotoLibrary(localUri);
      if (saved.ok) {
        Alert.alert('Saved!', `${isVideo ? 'Video' : 'Photo'} saved to your Photos library.`);
        return;
      }
      if (saved.reason === 'unavailable') {
        Alert.alert(
          'Update required',
          'Saving to Photos needs the next App Store build. You can still view your media here.',
        );
        return;
      }
      if (saved.reason === 'denied') {
        Alert.alert(
          'Permission needed',
          'Allow AVA to save to your Photo Library in Settings.',
        );
        return;
      }
      Alert.alert('Download failed', saved.message ?? 'Something went wrong. Please try again.');
    } catch (err) {
      console.error('[photo-detail] download failed:', err);
      Alert.alert('Download failed', 'Something went wrong. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out my event photos and videos on AVA!',
      });
    } catch { /* dismissed */ }
  };

  if (!item) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator color="#00BFFF" />
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backRow}>
          <Ionicons name="chevron-back" size={22} color={brandColors.alphaRed} />
          <Text style={styles.backText}>Gallery</Text>
        </Pressable>
      </View>

      <View style={styles.mediaWrap}>
        {previewUrl ? (
          isVideo ? (
            <GalleryVideoPlayer uri={previewUrl} />
          ) : (
            <Image source={{ uri: previewUrl }} style={styles.media} resizeMode="contain" />
          )
        ) : (
          <View style={[styles.media, styles.mediaPlaceholder]}>
            <ActivityIndicator color="#00BFFF" />
          </View>
        )}
      </View>

      <View style={[styles.actions, { paddingBottom: insets.bottom + 20 }]}>
        <Pressable
          style={[styles.downloadBtn, downloading && styles.btnDisabled]}
          onPress={() => void handleFreeDownload()}
          disabled={downloading}
        >
          {downloading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <Ionicons name="cloud-download-outline" size={20} color="#000" />
              <Text style={styles.downloadBtnText}>
                Download {isVideo ? 'video' : 'full-res'} — FREE
              </Text>
            </>
          )}
        </Pressable>

        <Text style={styles.freeNote}>Digital downloads are always free.</Text>

        <Pressable style={styles.shareBtn} onPress={() => void handleShare()}>
          <Ionicons name="share-outline" size={18} color="#00BFFF" />
          <Text style={styles.shareBtnText}>Share</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: '#0a0a0a' },
  centered:{ flex: 1, backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center' },
  header:  { paddingHorizontal: 20, paddingBottom: 8 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText:{ fontFamily: brandFonts.bodyMedium, fontSize: 15, color: brandColors.alphaRed },
  mediaWrap: { flex: 1, backgroundColor: '#111' },
  media:   { width: '100%', height: '100%' },
  mediaPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  actions: { paddingHorizontal: 20, paddingTop: 16, gap: 10 },
  downloadBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#00BFFF', borderRadius: 14,
    paddingVertical: 16, justifyContent: 'center', minHeight: 52,
  },
  btnDisabled:    { opacity: 0.6 },
  downloadBtnText:{ color: '#000', fontSize: 14, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' },
  freeNote:{ fontFamily: brandFonts.body, fontSize: 12, color: brandColors.mutedText, textAlign: 'center' },
  shareBtn:{ flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center', paddingVertical: 12 },
  shareBtnText: { fontFamily: brandFonts.bodyMedium, fontSize: 14, color: '#00BFFF' },
});
