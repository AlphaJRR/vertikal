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
import { isVideoMediaKind } from '@/lib/eventMedia';
import type { EventPhoto } from '@/types/events';

interface EventPhotoThumbProps {
  photo: EventPhoto;
  previewUrl?: string | null;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  showReadyDot?: boolean;
}

export function EventPhotoThumb({
  photo,
  previewUrl,
  style,
  borderRadius = 4,
  showReadyDot = false,
}: EventPhotoThumbProps) {
  const [uri, setUri] = useState<string | null>(previewUrl ?? null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (previewUrl) {
      setUri(previewUrl);
      setFailed(false);
      return;
    }

    let active = true;
    setUri(null);
    setFailed(false);

    void getOperatorPreviewUrl(photo.id, photo.thumb_path, photo.storage_path).then((url) => {
      if (!active) return;
      if (url) setUri(url);
      else setFailed(true);
    });

    return () => { active = false; };
  }, [previewUrl, photo.thumb_path, photo.storage_path, photo.id]);

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
      {isVideoMediaKind(photo.media_kind) ? (
        <View style={styles.videoBadge}>
          <Ionicons name="play" size={14} color="#fff" />
        </View>
      ) : null}
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
  videoBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
