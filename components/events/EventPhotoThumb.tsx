/**
 * Operator-facing photo thumbnail — loads a signed preview URL from event-previews.
 */

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { brandColors } from '@/constants/theme';
import { getOperatorPreviewUrl } from '@/lib/eventPhotoPreview';
import type { EventPhoto } from '@/types/events';

interface EventPhotoThumbProps {
  photo: EventPhoto;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  showReadyDot?: boolean;
}

export function EventPhotoThumb({
  photo,
  style,
  borderRadius = 4,
  showReadyDot = false,
}: EventPhotoThumbProps) {
  const [uri, setUri] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setUri(null);
    setFailed(false);

    void getOperatorPreviewUrl(photo.id, photo.thumb_path, photo.storage_path).then((url) => {
      if (!active) return;
      if (url) setUri(url);
      else setFailed(true);
    });

    return () => { active = false; };
  }, [photo.thumb_path, photo.storage_path, photo.id]);

  return (
    <View style={[styles.root, style, { borderRadius }]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[styles.image, { borderRadius }]}
          resizeMode="cover"
          onError={() => {
            setUri(null);
            setFailed(true);
          }}
        />
      ) : (
        <View style={[styles.placeholder, { borderRadius }]}>
          {failed ? (
            <Ionicons name="image-outline" size={20} color={brandColors.mutedText} />
          ) : (
            <ActivityIndicator size="small" color="#00BFFF" />
          )}
        </View>
      )}
      {showReadyDot ? <View style={styles.readyDot} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#111',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
  },
  readyDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    borderWidth: 1,
    borderColor: '#000',
  },
});
