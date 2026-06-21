/**
 * Shared photo grid — photographer and attendee gallery.
 * Uses EventPhoto from migration 004 (no upload_status field).
 */

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { brandColors, brandFonts } from '@/constants/theme';
import type { EventPhoto } from '@/types/events';

const { width: SCREEN_W } = Dimensions.get('window');
const GAP       = 2;
const NUM_COLS  = 3;
const CELL_SIZE = (SCREEN_W - GAP * (NUM_COLS + 1)) / NUM_COLS;

export interface PhotoGridItem {
  photo:        EventPhoto;
  thumbnailUrl: string | null;
}

interface PhotoGridProps {
  items:        PhotoGridItem[];
  loading?:     boolean;
  onPhotoPress: (item: PhotoGridItem) => void;
  ListHeader?:  React.ReactElement;
  ListFooter?:  React.ReactElement;
}

export function PhotoGrid({ items, loading, onPhotoPress, ListHeader, ListFooter }: PhotoGridProps) {
  if (loading && items.length === 0) {
    return <View style={styles.emptyState}><ActivityIndicator color="#00BFFF" /></View>;
  }

  if (!loading && items.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="images-outline" size={40} color={brandColors.mutedText} />
        <Text style={styles.emptyText}>No photos yet</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      numColumns={NUM_COLS}
      keyExtractor={i => i.photo.id}
      ListHeaderComponent={ListHeader}
      ListFooterComponent={ListFooter}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => (
        <PhotoGridCell item={item} onPress={() => onPhotoPress(item)} />
      )}
      contentContainerStyle={styles.list}
    />
  );
}

function PhotoGridCell({
  item,
  onPress,
}: {
  item: PhotoGridItem;
  onPress: () => void;
}) {
  const [broken, setBroken] = useState(false);

  return (
    <Pressable
      style={styles.cell}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Photo ${item.photo.filename ?? ''}`}
    >
      {item.thumbnailUrl && !broken ? (
        <Image
          source={{ uri: item.thumbnailUrl }}
          style={styles.image}
          resizeMode="cover"
          onError={() => setBroken(true)}
        />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          {item.thumbnailUrl && broken ? (
            <Ionicons name="image-outline" size={22} color={brandColors.mutedText} />
          ) : (
            <ActivityIndicator size="small" color="#00BFFF" />
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  list:       { gap: GAP },
  row:        { gap: GAP },
  cell:       { width: CELL_SIZE, height: CELL_SIZE, backgroundColor: '#111' },
  image:      { width: '100%', height: '100%' },
  placeholder:{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#111' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 60 },
  emptyText:  { fontFamily: brandFonts.body, fontSize: 14, color: brandColors.mutedText },
});
