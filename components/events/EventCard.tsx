import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { brandColors, brandFonts } from '@/constants/theme';
import type { AVAEvent } from '@/types/events';

interface EventCardProps {
  event:       AVAEvent;
  photoCount?: number;
  onPress:     () => void;
}

export function EventCard({ event, photoCount = 0, onPress }: EventCardProps) {
  const dateLabel = event.event_date
    ? new Date(event.event_date + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'short',
        day:   'numeric',
        year:  'numeric',
      })
    : null;

  return (
    <Pressable style={styles.card} onPress={onPress} accessibilityRole="button">
      <View style={styles.topRow}>
        <Text style={styles.name} numberOfLines={1}>{event.name}</Text>
        <Ionicons name="chevron-forward" size={18} color={brandColors.mutedText} />
      </View>

      <View style={styles.metaRow}>
        {dateLabel ? (
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={13} color={brandColors.mutedText} />
            <Text style={styles.metaText}>{dateLabel}</Text>
          </View>
        ) : null}
        {event.event_type ? (
          <View style={styles.metaItem}>
            <Ionicons name="pricetag-outline" size={13} color={brandColors.mutedText} />
            <Text style={styles.metaText} numberOfLines={1}>{event.event_type}</Text>
          </View>
        ) : null}
        <View style={styles.metaItem}>
          <Ionicons name="images-outline" size={13} color={brandColors.mutedText} />
          <Text style={styles.metaText}>{photoCount} photo{photoCount !== 1 ? 's' : ''}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    fontFamily: brandFonts.display,
    fontSize: 20,
    color: '#fff',
    flex: 1,
    textTransform: 'uppercase',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: brandFonts.body,
    fontSize: 12,
    color: brandColors.mutedText,
  },
});
