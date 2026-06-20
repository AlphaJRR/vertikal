/**
 * Account Settings screen.
 * Required by App Store guideline 5.1.1: in-app account deletion.
 *
 * Accessible from the Home tab or any screen that surfaces a settings link.
 * Works for both photographers and attendees.
 */

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { brandColors, brandFonts } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

// ⚠️ JR: replace with the live privacy policy URL before App Store submission
const PRIVACY_POLICY_URL = 'https://alphavisualartists.com/privacy';
const TERMS_URL          = 'https://alphavisualartists.com/terms';

export default function SettingsScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { session } = useAuth();

  const [deleting,     setDeleting]     = useState(false);
  const [signingOut,   setSigningOut]   = useState(false);
  const [marketingOn,  setMarketingOn]  = useState(false);  // loaded below
  const [marketingBusy, setMarketingBusy] = useState(false);

  // Load current marketing preference on mount
  React.useEffect(() => {
    if (!session?.user) return;
    supabase
      .from('profiles')
      .select('marketing_opt_in')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => {
        if (data) setMarketingOn(data.marketing_opt_in);
      });
  }, [session]);

  const toggleMarketing = async (value: boolean) => {
    setMarketingBusy(true);
    setMarketingOn(value);
    try {
      await supabase
        .from('profiles')
        .update({ marketing_opt_in: value })
        .eq('id', session?.user.id ?? '');
    } catch (err) {
      console.error('[settings] marketing update failed:', err);
      setMarketingOn(!value); // revert
    } finally {
      setMarketingBusy(false);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await supabase.auth.signOut();
      router.replace('/(tabs)' as never);
    } finally {
      setSigningOut(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete account',
      'This permanently deletes your account and all your data — photos, events, gallery access. This cannot be undone.\n\nAre you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete my account',
          style: 'destructive',
          onPress: () => void confirmDelete(),
        },
      ],
    );
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      const { error } = await supabase.functions.invoke('delete-account');
      if (error) {
        Alert.alert('Error', 'Could not delete your account. Please contact support at help@alphavisualartists.com.');
        return;
      }
      // Auth token is now invalid; sign out locally
      await supabase.auth.signOut();
      Alert.alert(
        'Account deleted',
        'Your account and all associated data have been permanently removed.',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)' as never) }],
      );
    } catch (err) {
      console.error('[settings] delete failed:', err);
      Alert.alert('Error', 'Something went wrong. Contact help@alphavisualartists.com.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 },
      ]}
    >
      {/* Back */}
      <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backRow}>
        <Ionicons name="chevron-back" size={22} color={brandColors.alphaRed} />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <Text style={styles.title}>Settings</Text>

      {session ? (
        <>
          {/* Account info */}
          <Section title="Account">
            <InfoRow label="Email" value={session.user.email ?? '—'} />
          </Section>

          {/* Notifications / marketing */}
          <Section title="Communication">
            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Text style={styles.switchLabel}>Marketing emails</Text>
                <Text style={styles.switchSub}>
                  AVA announcements, tips, and event photo reminders
                </Text>
              </View>
              <Switch
                value={marketingOn}
                onValueChange={v => void toggleMarketing(v)}
                disabled={marketingBusy}
                trackColor={{ false: '#333', true: '#00d4ff' }}
                thumbColor={marketingOn ? '#fff' : '#888'}
              />
            </View>
          </Section>

          {/* Legal */}
          <Section title="Legal">
            <LinkRow
              label="Privacy Policy"
              onPress={() => void Linking.openURL(PRIVACY_POLICY_URL)}
            />
            <LinkRow
              label="Terms of Service"
              onPress={() => void Linking.openURL(TERMS_URL)}
            />
          </Section>

          {/* Account actions */}
          <Section title="Account actions">
            <Pressable
              style={[styles.signOutBtn, signingOut && styles.btnDisabled]}
              onPress={() => void handleSignOut()}
              disabled={signingOut}
            >
              {signingOut ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="log-out-outline" size={18} color="#fff" />
                  <Text style={styles.signOutText}>Sign out</Text>
                </>
              )}
            </Pressable>

            <Pressable
              style={[styles.deleteBtn, deleting && styles.btnDisabled]}
              onPress={handleDeleteAccount}
              disabled={deleting}
            >
              {deleting ? (
                <ActivityIndicator size="small" color={brandColors.alphaRed} />
              ) : (
                <>
                  <Ionicons name="trash-outline" size={18} color={brandColors.alphaRed} />
                  <Text style={styles.deleteText}>Delete my account</Text>
                </>
              )}
            </Pressable>

            <Text style={styles.deleteNote}>
              Deleting your account permanently removes all your photos, events, and gallery
              access. This cannot be undone.
            </Text>
          </Section>
        </>
      ) : (
        <View style={styles.centeredState}>
          <Text style={styles.notSignedIn}>Sign in to manage your account settings.</Text>
          <Pressable style={styles.signInBtn} onPress={() => router.push('/sign-in')}>
            <Text style={styles.signInBtnText}>Sign in</Text>
          </Pressable>

          <Section title="Legal">
            <LinkRow
              label="Privacy Policy"
              onPress={() => void Linking.openURL(PRIVACY_POLICY_URL)}
            />
            <LinkRow
              label="Terms of Service"
              onPress={() => void Linking.openURL(TERMS_URL)}
            />
          </Section>
        </View>
      )}
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={sectionStyles.container}>
      <Text style={sectionStyles.title}>{title}</Text>
      <View style={sectionStyles.body}>{children}</View>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={rowStyles.row}>
      <Text style={rowStyles.label}>{label}</Text>
      <Text style={rowStyles.value}>{value}</Text>
    </View>
  );
}

function LinkRow({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={rowStyles.row} onPress={onPress} accessibilityRole="link">
      <Text style={rowStyles.linkLabel}>{label}</Text>
      <Ionicons name="open-outline" size={14} color={brandColors.mutedText} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: '#0a0a0a' },
  content: { paddingHorizontal: 20, gap: 24 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  backText:{ fontFamily: brandFonts.bodyMedium, fontSize: 15, color: brandColors.alphaRed },
  title:   { fontFamily: brandFonts.display, fontSize: 32, color: '#fff', textTransform: 'uppercase' },
  switchRow:{ flexDirection: 'row', alignItems: 'center', gap: 12 },
  switchInfo:{ flex: 1, gap: 2 },
  switchLabel:{ fontFamily: brandFonts.bodyMedium, fontSize: 14, color: '#fff' },
  switchSub:  { fontFamily: brandFonts.body, fontSize: 12, lineHeight: 16, color: brandColors.mutedText },
  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10, paddingVertical: 14, paddingHorizontal: 16,
  },
  signOutText:{ fontFamily: brandFonts.bodyMedium, fontSize: 14, color: '#fff' },
  deleteBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderColor: 'rgba(232,0,10,0.4)',
    borderRadius: 10, paddingVertical: 14, paddingHorizontal: 16,
  },
  deleteText: { fontFamily: brandFonts.bodyMedium, fontSize: 14, color: brandColors.alphaRed },
  deleteNote: {
    fontFamily: brandFonts.body, fontSize: 11, lineHeight: 16,
    color: brandColors.mutedText,
  },
  btnDisabled: { opacity: 0.6 },
  centeredState: { gap: 20 },
  notSignedIn: { fontFamily: brandFonts.body, fontSize: 14, color: brandColors.subtleText },
  signInBtn: {
    backgroundColor: '#00d4ff', borderRadius: 10,
    paddingVertical: 14, alignItems: 'center',
  },
  signInBtnText: { color: '#000', fontSize: 13, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' },
});

const sectionStyles = StyleSheet.create({
  container: { gap: 10 },
  title: {
    fontFamily: brandFonts.mono, fontSize: 10,
    letterSpacing: 1.5, textTransform: 'uppercase', color: brandColors.mutedText,
  },
  body: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12, padding: 16, gap: 16,
  },
});

const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  label: { fontFamily: brandFonts.body, fontSize: 14, color: brandColors.mutedText },
  value: { fontFamily: brandFonts.bodyMedium, fontSize: 14, color: '#fff', flex: 1, textAlign: 'right' },
  linkLabel: { fontFamily: brandFonts.bodyMedium, fontSize: 14, color: '#00d4ff', flex: 1 },
});
