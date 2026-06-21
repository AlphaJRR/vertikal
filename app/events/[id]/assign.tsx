/**
 * Assign photos to attendees — photographer screen.
 * Uses event_photos table (PRD migration 004).
 * Step 1: select a photo from the grid.
 * Step 2: search attendees by name → toggle assignment.
 */

import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { brandColors, brandFonts } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useEvent, useAttendees } from '@/hooks/useEvents';
import { useEventPhotos } from '@/hooks/usePhotos';
import { useOperatorGuard } from '@/hooks/useOperatorGuard';
import { AssigneeSearch } from '@/components/events/AssigneeSearch';
import { EventPhotoThumb } from '@/components/events/EventPhotoThumb';
import type { EventPhoto, Attendee } from '@/types/events';

type Step = 'selectPhoto' | 'assignAttendees';

export default function AssignScreen() {
  const { id }  = useLocalSearchParams<{ id: string }>();
  const router  = useRouter();
  const insets  = useSafeAreaInsets();

  const { isOperator, loading: guardLoading } = useOperatorGuard();
  const { event }                             = useEvent(id ?? '');
  const { photos, loading: photosLoading }    = useEventPhotos(id ?? '', { realtime: true });
  const { attendees, loading: attLoading }    = useAttendees(id ?? '');

  const [step,          setStep]          = useState<Step>('selectPhoto');
  const [selectedPhoto, setSelectedPhoto] = useState<EventPhoto | null>(null);
  const [assignedIds,   setAssignedIds]   = useState<Set<string>>(new Set());

  const loadAssignments = useCallback(async (photoId: string) => {
    const { data } = await supabase
      .from('photo_assignments')
      .select('attendee_id')
      .eq('photo_id', photoId);
    if (data) setAssignedIds(new Set(data.map((r: { attendee_id: string }) => r.attendee_id)));
  }, []);

  const toggleAttendee = useCallback(async (attendee: Attendee) => {
    if (!selectedPhoto) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (assignedIds.has(attendee.id)) {
      const { error } = await supabase
        .from('photo_assignments')
        .delete()
        .eq('photo_id', selectedPhoto.id)
        .eq('attendee_id', attendee.id);
      if (!error) setAssignedIds(prev => { const n = new Set(prev); n.delete(attendee.id); return n; });
    } else {
      const { error } = await supabase
        .from('photo_assignments')
        .upsert({ photo_id: selectedPhoto.id, attendee_id: attendee.id });
      if (!error) setAssignedIds(prev => new Set([...prev, attendee.id]));
    }
  }, [selectedPhoto, assignedIds]);

  if (guardLoading || !isOperator) {
    return (
      <View style={[styles.root, { paddingTop: insets.top, alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color="#00BFFF" />
      </View>
    );
  }

  const selectPhoto = async (photo: EventPhoto) => {
    setSelectedPhoto(photo);
    setStep('assignAttendees');
    await loadAssignments(photo.id);
  };

  const handleBack = () => {
    if (step === 'assignAttendees') { setStep('selectPhoto'); setSelectedPhoto(null); setAssignedIds(new Set()); }
    else router.back();
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} hitSlop={12} style={styles.backRow}>
          <Ionicons name="chevron-back" size={22} color={brandColors.alphaRed} />
          <Text style={styles.backText}>
            {step === 'assignAttendees' ? 'Photos' : (event?.name ?? 'Event')}
          </Text>
        </Pressable>
        <Text style={styles.title}>
          {step === 'assignAttendees' ? 'Assign to attendees' : 'Select a photo'}
        </Text>
        <Text style={styles.subtitle}>
          {step === 'assignAttendees'
            ? 'Tap an attendee to grant or revoke access.'
            : photos.length > 0
              ? `${photos.length} photo${photos.length !== 1 ? 's' : ''} — tap one to assign.`
              : 'Tap a photo to choose who can see it.'}
        </Text>
      </View>

      {step === 'selectPhoto' && (
        photosLoading ? (
          <View style={styles.centered}><ActivityIndicator color="#00BFFF" /></View>
        ) : photos.length === 0 ? (
          <View style={styles.centered}>
            <Ionicons name="images-outline" size={40} color={brandColors.mutedText} />
            <Text style={styles.emptyText}>No photos yet. Upload photos first.</Text>
          </View>
        ) : (
          <FlatList
            data={photos}
            numColumns={3}
            keyExtractor={p => p.id}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.grid}
            renderItem={({ item }: { item: EventPhoto }) => (
              <Pressable style={styles.gridCell} onPress={() => void selectPhoto(item)}>
                <EventPhotoThumb photo={item} />
              </Pressable>
            )}
          />
        )
      )}

      {step === 'assignAttendees' && (
        attLoading ? (
          <View style={styles.centered}><ActivityIndicator color="#00BFFF" /></View>
        ) : (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[styles.assignContainer, { paddingBottom: insets.bottom + 32 }]}
          >
            {selectedPhoto ? (
              <View style={styles.selectedPhotoWrap}>
                <EventPhotoThumb photo={selectedPhoto} style={styles.selectedPhoto} borderRadius={8} />
              </View>
            ) : null}
            <AssigneeSearch
              attendees={attendees}
              assigned={assignedIds}
              onToggle={a => void toggleAttendee(a)}
            />
            <View style={styles.countBadge}>
              <Ionicons name="people-outline" size={14} color="#00BFFF" />
              <Text style={styles.countText}>
                {assignedIds.size} attendee{assignedIds.size !== 1 ? 's' : ''} can see this photo
              </Text>
            </View>
          </ScrollView>
        )
      )}
    </View>
  );
}

const { width: SCREEN_W } = Dimensions.get('window');
const GAP = 2;
const NUM_COLS = 3;
const CELL = Math.floor((SCREEN_W - GAP * (NUM_COLS + 1)) / NUM_COLS);

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: '#0a0a0a' },
  header:  { paddingHorizontal: 24, paddingBottom: 16, gap: 6 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  backText:{ fontFamily: brandFonts.bodyMedium, fontSize: 15, color: brandColors.alphaRed },
  title:   { fontFamily: brandFonts.display, fontSize: 26, color: '#fff', textTransform: 'uppercase' },
  subtitle:{ fontFamily: brandFonts.body, fontSize: 13, lineHeight: 18, color: brandColors.subtleText },
  centered:{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyText:{ fontFamily: brandFonts.body, fontSize: 14, color: brandColors.mutedText, textAlign: 'center', paddingHorizontal: 32 },
  grid:    { padding: 2, gap: 2 },
  gridRow: { gap: 2 },
  gridCell:{ width: CELL, height: CELL },
  assignContainer:{ paddingHorizontal: 20, paddingTop: 8, gap: 16 },
  selectedPhotoWrap: {
    alignSelf: 'center',
    width: 160,
    height: 160,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,191,255,0.35)',
  },
  selectedPhoto: {
    width: 160,
    height: 160,
  },
  countBadge:{
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(0,191,255,0.08)', borderRadius: 8,
    paddingVertical: 10, paddingHorizontal: 14,
  },
  countText:{ fontFamily: brandFonts.body, fontSize: 13, color: '#00BFFF' },
});
