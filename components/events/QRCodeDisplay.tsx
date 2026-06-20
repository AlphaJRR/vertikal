/**
 * Renders a QR code for an event's join URL.
 * Attendees scan this with their native camera app → deep link opens AVA → join flow.
 *
 * Uses react-native-qrcode-svg (pure JS; uses existing react-native-svg native module).
 * Install: npm install react-native-qrcode-svg
 * ⚠️ JR: run `npm install react-native-qrcode-svg` then OTA — no new native modules needed.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { brandFonts } from '@/constants/theme';

interface QRCodeDisplayProps {
  qrToken:   string;
  eventName: string;
  size?:     number;
}

// Deep link scheme is 'ava' (registered in app.json)
export function joinUrl(token: string): string {
  return `ava://attendee/join?token=${encodeURIComponent(token)}`;
}

export function QRCodeDisplay({ qrToken, eventName, size = 220 }: QRCodeDisplayProps) {
  const url = joinUrl(qrToken);

  return (
    <View style={styles.container}>
      <View style={styles.qrWrapper}>
        <QRCode
          value={url}
          size={size}
          backgroundColor="#fff"
          color="#000"
          // Embed the AVA logo in the centre of the QR
          // logo={require('@/assets/icon.png')}
          // logoSize={40}
          // logoBackgroundColor="#fff"
        />
      </View>
      <Text style={styles.label} numberOfLines={1}>
        {eventName}
      </Text>
      <Text style={styles.hint}>Scan to access your photos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  label: {
    fontFamily: brandFonts.display,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  hint: {
    fontFamily: brandFonts.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
});
