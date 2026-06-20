/**
 * Event dashboard — realtime metrics (PRD Section 06).
 * Six primary metrics + leads / opt-in / release counts.
 * Uses Supabase Realtime on event_photos, attendees, orders, install_events.
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
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
import { useEvent } from '@/hooks/useEvents';
import { useOperatorGuard } from '@/hooks/useOperatorGuard';
import type { EventDashboard } from '@/types/events';

export default function DashboardScreen() {
  const { id }  = useLocalSearchParams<{ id: string }>();
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { isOperator, loading: guardLoading } = useOperatorGuard();
  const { event } = useEvent(id ?? '');

  const [stats,      setStats]      = useState<EventDashboard | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!id) return;
    try {
      const [photosRes, attendeesRes, installsRes] = await Promise.all([
        supabase.from('event_photos').select('id', { count: 'exact' }).eq('event_id', id),
        supabase.from('attendees').select('id,user_id,marketing_opt_in,photo_consent_at', { count: 'exact' })
          .eq('event_id', id).is('deleted_at', null),
        supabase.from('install_events').select('id', { count: 'exact' }).eq('event_id', id),
      ]);

      // attendees with at least one assignment (delivered)
      const { count: deliveredCount } = await supabase
        .from('photo_assignments')
        .select('attendee_id', { count: 'exact', head: true })
        .in('attendee_id',
          ((await supabase.from('attendees').select('id').eq('event_id', id).is('deleted_at', null)).data ?? [])
            .map((a: { id: string }) => a.id),
        );

      const attendees = (attendeesRes.data ?? []) as Array<{
        user_id: string | null;
        marketing_opt_in: boolean;
        photo_consent_at: string | null;
      }>;

      setStats({
        event:          event ?? { id, name: '', photographer_id: '', access_code: '', qr_token: '', event_type: '', status: 'active', event_date: null, cover_image_url: null, expires_at: null, created_at: '' },
        totalPhotos:    photosRes.count ?? 0,
        totalAttendees: attendeesRes.count ?? 0,
        installs:       installsRes.count ?? 0,
        delivered:      deliveredCount ?? 0,
        codesRedeemed:  attendees.filter(a => a.user_id !== null).length,
        leads:          attendees.filter(a => a.user_id !== null).length,
        optIns:         attendees.filter(a => a.marketing_opt_in).length,
        releaseSigned:  attendees.filter(a => a.photo_consent_at !== null).length,
      });
    } catch (err) {
      console.error('[dashboard] fetchStats error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id, event]);

  useEffect(() => { void fetchStats(); }, [fetchStats]);

  useEffect(() => {
    if (!id) return;
    const ch = supabase.channel(`dashboard:${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'event_photos',  filter: `event_id=eq.${id}` }, () => void fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attendees',     filter: `event_id=eq.${id}` }, () => void fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders',        filter: `event_id=eq.${id}` }, () => void fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'install_events',filter: `event_id=eq.${id}` }, () => void fetchStats())
      .subscribe();
    return () => { void supabase.removeChannel(ch); };
  }, [id, fetchStats]);

  const onRefresh = () => { setRefreshing(true); void fetchStats(); };

  if (guardLoading || !isOperator) {
    return (
      <View style={[styles.root, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color="#00BFFF" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00BFFF" />}
    >
      <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backRow}>
        <Ionicons name="chevron-back" size={22} color={brandColors.alphaRed} />
        <Text style={styles.backText}>{event?.name ?? 'Event'}</Text>
      </Pressable>

      <View style={styles.titleRow}>
        <Text style={styles.title}>Dashboard</Text>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}><ActivityIndicator color="#00BFFF" /></View>
      ) : stats ? (
        <>
          <Text style={styles.sectionLabel}>Six metrics</Text>
          <View style={styles.grid}>
            <MetricCard icon="images-outline"           label="Photos"          value={stats.totalPhotos}    />
            <MetricCard icon="people-outline"           label="Attendees"       value={stats.totalAttendees} />
            <MetricCard icon="download-outline"         label="Installs"        value={stats.installs}       />
            <MetricCard icon="albums-outline"           label="Delivered"       value={stats.delivered}      accent />
            <MetricCard icon="key-outline"              label="Codes redeemed"  value={stats.codesRedeemed}  accent />
            <MetricCard icon="checkmark-circle-outline" label="Releases signed" value={stats.releaseSigned}  />
          </View>

          <Text style={[styles.sectionLabel, { marginTop: 8 }]}>Leads & consent</Text>
          <View style={styles.leadBox}>
            <LeadRow icon="person-circle-outline" label="Leads (with account)" value={stats.leads}        total={stats.totalAttendees} />
            <LeadRow icon="mail-outline"          label="Marketing opt-ins"    value={stats.optIns}       total={stats.totalAttendees} />
            <LeadRow icon="document-text-outline" label="Photo consent signed" value={stats.releaseSigned} total={stats.totalAttendees} />
          </View>
        </>
      ) : (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Could not load dashboard.</Text>
          <Pressable onPress={() => void fetchStats()} style={styles.retryBtn}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

function MetricCard({ icon, label, value, accent }: { icon: string; label: string; value: number | string; accent?: boolean }) {
  return (
    <View style={mStyles.card}>
      <Ionicons name={icon as never} size={20} color={accent ? '#00BFFF' : brandColors.mutedText} />
      <Text style={[mStyles.value, accent && mStyles.accent]}>{value}</Text>
      <Text style={mStyles.label}>{label}</Text>
    </View>
  );
}

function LeadRow({ icon, label, value, total }: { icon: string; label: string; value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <View style={lStyles.row}>
      <Ionicons name={icon as never} size={16} color="#00BFFF" />
      <Text style={lStyles.label}>{label}</Text>
      <Text style={lStyles.value}>{value} <Text style={lStyles.pct}>({pct}%)</Text></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: '#0a0a0a' },
  content: { paddingHorizontal: 20, gap: 20 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText:{ fontFamily: brandFonts.bodyMedium, fontSize: 15, color: brandColors.alphaRed },
  titleRow:{ flexDirection: 'row', alignItems: 'center', gap: 12 },
  title:   { fontFamily: brandFonts.display, fontSize: 32, color: '#fff', textTransform: 'uppercase', flex: 1 },
  liveBadge:{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,191,255,0.1)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00BFFF' },
  liveText:{ fontFamily: brandFonts.mono, fontSize: 10, letterSpacing: 1, color: '#00BFFF' },
  sectionLabel:{ fontFamily: brandFonts.mono, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: brandColors.mutedText },
  grid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  leadBox: { backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' },
  centered:{ paddingVertical: 40, alignItems: 'center', gap: 12 },
  errorText:{ fontFamily: brandFonts.body, fontSize: 14, color: brandColors.alphaRed },
  retryBtn: { paddingVertical: 10, paddingHorizontal: 20 },
  retryText:{ fontFamily: brandFonts.bodyMedium, fontSize: 14, color: '#00BFFF' },
});

const mStyles = StyleSheet.create({
  card: { flex: 1, minWidth: '44%', backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, gap: 4, alignItems: 'flex-start' },
  value:  { fontFamily: brandFonts.display, fontSize: 34, color: '#fff' },
  accent: { color: '#00BFFF' },
  label:  { fontFamily: brandFonts.body, fontSize: 12, color: brandColors.mutedText },
});

const lStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  label: { fontFamily: brandFonts.body, fontSize: 14, color: '#fff', flex: 1 },
  value: { fontFamily: brandFonts.bodyMedium, fontSize: 14, color: '#00BFFF' },
  pct:   { color: brandColors.mutedText, fontWeight: '400' },
});
