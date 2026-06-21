import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { brandColors, brandFonts } from '@/constants/theme';

interface UploadProgressBarProps {
  pending:   number;
  failed:    number;
  uploading: boolean;
  lastError?: string | null;
  onRetry?:  () => void;
}

export function UploadProgressBar({
  pending,
  failed,
  uploading,
  lastError,
  onRetry,
}: UploadProgressBarProps) {
  if (pending === 0 && failed === 0 && !uploading && !lastError) return null;

  const label = uploading
    ? `Uploading — ${pending} remaining…`
    : failed > 0
      ? `${failed} upload${failed !== 1 ? 's' : ''} failed`
      : pending > 0
        ? `Processing ${pending} photo${pending !== 1 ? 's' : ''}…`
        : 'Upload issue';

  const showRetry = !uploading && (pending > 0 || failed > 0) && onRetry;

  return (
    <View style={[styles.bar, (failed > 0 || lastError) && !uploading && styles.barError]}>
      {uploading ? (
        <ActivityIndicator size="small" color="#00d4ff" />
      ) : (
        <Ionicons
          name={failed > 0 || lastError ? 'alert-circle-outline' : 'cloud-upload-outline'}
          size={16}
          color={failed > 0 || lastError ? '#fbbf24' : '#00d4ff'}
        />
      )}
      <View style={styles.textCol}>
        <Text style={[styles.label, (failed > 0 || lastError) && !uploading && styles.labelError]}>
          {label}
        </Text>
        {lastError && !uploading ? (
          <Text style={styles.errorDetail} numberOfLines={3}>{lastError}</Text>
        ) : null}
      </View>
      {showRetry ? (
        <Pressable onPress={onRetry} hitSlop={8} style={styles.retryBtn}>
          <Text style={styles.retryTxt}>Retry</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection:    'row',
    alignItems:       'center',
    gap:              10,
    backgroundColor:  'rgba(0,212,255,0.1)',
    borderRadius:     10,
    paddingHorizontal: 14,
    paddingVertical:  10,
    marginHorizontal: 16,
    marginBottom:     8,
  },
  barError: {
    backgroundColor: 'rgba(251,191,36,0.12)',
  },
  label: {
    fontFamily: brandFonts.body,
    fontSize:   13,
    color:      '#00d4ff',
  },
  textCol: {
    flex: 1,
    gap: 4,
  },
  errorDetail: {
    fontFamily: brandFonts.body,
    fontSize:   11,
    lineHeight: 15,
    color:      '#fbbf24',
  },
  retryBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,212,255,0.35)',
  },
  retryTxt: {
    fontFamily: brandFonts.bodyMedium,
    fontSize: 12,
    color: '#00d4ff',
    fontWeight: '700',
  },
  labelError: {
    color: '#fbbf24',
  },
});
