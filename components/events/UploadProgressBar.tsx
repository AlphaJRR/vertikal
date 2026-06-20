import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { brandColors, brandFonts } from '@/constants/theme';

interface UploadProgressBarProps {
  pending:   number;
  uploading: boolean;
}

export function UploadProgressBar({ pending, uploading }: UploadProgressBarProps) {
  if (pending === 0 && !uploading) return null;

  return (
    <View style={styles.bar}>
      {uploading ? (
        <ActivityIndicator size="small" color="#00d4ff" />
      ) : (
        <Ionicons name="cloud-upload-outline" size={16} color="#00d4ff" />
      )}
      <Text style={styles.label}>
        {uploading
          ? `Uploading — ${pending} remaining…`
          : `${pending} photo${pending !== 1 ? 's' : ''} queued`}
      </Text>
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
  label: {
    fontFamily: brandFonts.body,
    fontSize:   13,
    color:      '#00d4ff',
    flex:       1,
  },
});
