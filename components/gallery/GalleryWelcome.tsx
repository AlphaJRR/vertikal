/**
 * Shown when a guest redeemed their code but no photos are assigned yet.
 */

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { brandColors, brandFonts } from '@/constants/theme';
import {
  ensureNotifPermission,
  getNotificationAvailability,
} from '@/lib/notify';
import type { AttendeeWelcomeState } from '@/hooks/useAttendeeWelcome';

const DEFAULT_MESSAGE =
  "You're in the right place! Your photos aren't ready yet — they'll show up here as soon as your photographer uploads them.";

interface GalleryWelcomeProps {
  welcome:    AttendeeWelcomeState;
  onRefresh:  () => void;
  refreshing: boolean;
}

export function GalleryWelcome({ welcome, onRefresh, refreshing }: GalleryWelcomeProps) {
  const [notifyBusy, setNotifyBusy] = useState(false);
  const [notifySet, setNotifySet]   = useState(false);

  useEffect(() => {
    const timer = setInterval(() => { onRefresh(); }, 30_000);
    return () => clearInterval(timer);
  }, [onRefresh]);

  const handleNotify = async () => {
    setNotifyBusy(true);
    try {
      const availability = await getNotificationAvailability();
      if (availability !== 'available') {
        Alert.alert(
          'Notifications unavailable',
          'Turn on notifications in Settings to get alerted when photos are ready. Pull down to refresh — your gallery updates automatically when photos land.',
        );
        setNotifySet(true);
        return;
      }
      const granted = await ensureNotifPermission();
      if (granted) {
        setNotifySet(true);
        Alert.alert('You\'re set', 'We\'ll alert you when your photos are ready.');
      } else {
        Alert.alert(
          'Notifications off',
          'Open Settings → Notifications → AVA and turn on Allow Notifications.',
        );
      }
    } finally {
      setNotifyBusy(false);
    }
  };

  const message = welcome.welcomeMessage?.trim() || DEFAULT_MESSAGE;

  return (
    <View style={styles.root}>
      <View style={styles.hero}>
        {welcome.coverImageUrl ? (
          <Image
            source={{ uri: welcome.coverImageUrl }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.heroPlaceholder}>
            <Ionicons name="people-outline" size={48} color={brandColors.mutedText} />
          </View>
        )}
      </View>

      <Text style={styles.eventName}>{welcome.eventName}</Text>
      <Text style={styles.headline}>You&apos;re in the right place</Text>
      <Text style={styles.body}>{message}</Text>

      <Pressable
        style={[styles.refreshBtn, refreshing && styles.btnDisabled]}
        onPress={() => onRefresh()}
        disabled={refreshing}
      >
        {refreshing ? (
          <ActivityIndicator color="#00BFFF" />
        ) : (
          <>
            <Ionicons name="refresh-outline" size={18} color="#00BFFF" />
            <Text style={styles.refreshText}>Check for photos</Text>
          </>
        )}
      </Pressable>

      <Pressable
        style={[styles.notifyBtn, (notifyBusy || notifySet) && styles.btnDisabled]}
        onPress={() => void handleNotify()}
        disabled={notifyBusy || notifySet}
      >
        {notifyBusy ? (
          <ActivityIndicator color="#000" />
        ) : (
          <>
            <Ionicons name={notifySet ? 'checkmark-circle' : 'notifications-outline'} size={18} color="#000" />
            <Text style={styles.notifyText}>
              {notifySet ? 'Alerts noted' : 'Notify me when photos are ready'}
            </Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    gap: 14,
    alignItems: 'center',
  },
  hero: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  heroImage: { width: '100%', height: '100%' },
  heroPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
  },
  eventName: {
    fontFamily: brandFonts.mono,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#00BFFF',
    textAlign: 'center',
  },
  headline: {
    fontFamily: brandFonts.display,
    fontSize: 28,
    color: '#fff',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  body: {
    fontFamily: brandFonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: brandColors.subtleText,
    textAlign: 'center',
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,191,255,0.35)',
    marginTop: 8,
    minWidth: 220,
    justifyContent: 'center',
  },
  refreshText: {
    fontFamily: brandFonts.bodyMedium,
    fontSize: 14,
    color: '#00BFFF',
  },
  notifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#00BFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    minWidth: 280,
    justifyContent: 'center',
  },
  notifyText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  btnDisabled: { opacity: 0.55 },
});
