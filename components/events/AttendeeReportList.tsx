import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { brandColors, brandFonts } from '@/constants/theme';
import type { AttendeeReportRow } from '@/hooks/useAttendeeReport';

interface AttendeeReportListProps {
  rows:     AttendeeReportRow[];
  loading:  boolean;
  error:    string | null;
  onRetry:  () => void;
}

function formatCreatedAt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function contactLine(row: AttendeeReportRow): string {
  const { email, phone } = row.attendee;
  if (email && phone) return `${email} · ${phone}`;
  return email ?? phone ?? '—';
}

export function AttendeeReportList({ rows, loading, error, onRetry }: AttendeeReportListProps) {
  if (loading && rows.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#00BFFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable onPress={onRetry} style={styles.retryBtn}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (rows.length === 0) {
    return (
      <View style={styles.emptyBox}>
        <Ionicons name="people-outline" size={32} color={brandColors.mutedText} />
        <Text style={styles.emptyTitle}>No attendees yet</Text>
        <Text style={styles.emptyHint}>
          Create a gallery guest at the sale station — they appear here in code order.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.nameCol]}>Guest</Text>
        <Text style={styles.headerCell}>Included</Text>
        <Text style={styles.headerCell}>Assigned</Text>
      </View>

      {rows.map((row, index) => {
        const { attendee, photosAssigned, displayName } = row;
        const included = attendee.photos_purchased ?? 0;
        const behind = included > 0 && photosAssigned < included;
        const complete = included > 0 && photosAssigned >= included;

        return (
          <View key={attendee.id} style={styles.row}>
            <View style={styles.nameCol}>
              <View style={styles.nameTop}>
                <Text style={styles.index}>{index + 1}</Text>
                <Text style={styles.name} numberOfLines={1}>{displayName}</Text>
                {attendee.user_id ? (
                  <View style={styles.redeemedBadge}>
                    <Text style={styles.redeemedText}>Redeemed</Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.code}>Code {attendee.redeem_code ?? '—'}</Text>
              <Text style={styles.contact} numberOfLines={2}>{contactLine(row)}</Text>
              <Text style={styles.time}>{formatCreatedAt(attendee.created_at)}</Text>
            </View>

            <Text style={[styles.count, behind && styles.countWarn]}>{included}</Text>
            <View style={styles.assignedCol}>
              <Text style={[styles.count, complete && styles.countOk, behind && styles.countWarn]}>
                {photosAssigned}
              </Text>
              {behind ? (
                <Text style={styles.behindHint}>{included - photosAssigned} to go</Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  headerCell: {
    fontFamily: brandFonts.mono,
    fontSize: 9,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: brandColors.mutedText,
    width: 56,
    textAlign: 'center',
  },
  nameCol: { flex: 1, width: undefined, textAlign: 'left' },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    gap: 8,
  },
  nameTop: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  index: {
    fontFamily: brandFonts.mono,
    fontSize: 11,
    color: brandColors.mutedText,
    width: 18,
  },
  name: {
    fontFamily: brandFonts.bodyMedium,
    fontSize: 15,
    color: '#fff',
    flexShrink: 1,
  },
  redeemedBadge: {
    backgroundColor: 'rgba(0,191,255,0.12)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  redeemedText: {
    fontFamily: brandFonts.mono,
    fontSize: 9,
    letterSpacing: 0.5,
    color: '#00BFFF',
    textTransform: 'uppercase',
  },
  code: {
    fontFamily: brandFonts.mono,
    fontSize: 12,
    color: '#00BFFF',
    marginTop: 4,
    letterSpacing: 1,
  },
  contact: {
    fontFamily: brandFonts.body,
    fontSize: 12,
    color: brandColors.subtleText,
    marginTop: 2,
  },
  time: {
    fontFamily: brandFonts.body,
    fontSize: 11,
    color: brandColors.mutedText,
    marginTop: 4,
  },
  count: {
    fontFamily: brandFonts.display,
    fontSize: 22,
    color: '#fff',
    width: 56,
    textAlign: 'center',
    paddingTop: 4,
  },
  countOk: { color: '#4ade80' },
  countWarn: { color: '#fbbf24' },
  assignedCol: { width: 56, alignItems: 'center' },
  behindHint: {
    fontFamily: brandFonts.mono,
    fontSize: 8,
    color: '#fbbf24',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  centered: { paddingVertical: 32, alignItems: 'center', gap: 12 },
  errorText: { fontFamily: brandFonts.body, fontSize: 14, color: brandColors.alphaRed },
  retryBtn: { paddingVertical: 8, paddingHorizontal: 16 },
  retryText: { fontFamily: brandFonts.bodyMedium, fontSize: 14, color: '#00BFFF' },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 24,
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  emptyTitle: {
    fontFamily: brandFonts.bodyMedium,
    fontSize: 16,
    color: '#fff',
  },
  emptyHint: {
    fontFamily: brandFonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: brandColors.mutedText,
    textAlign: 'center',
  },
});
