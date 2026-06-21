/**
 * ReminderButton — Bell icon that attaches to any checklist item row.
 *
 * States:
 *   • Bell outline  = no reminder set
 *   • Bell filled + time label = reminder is scheduled
 *   • Tap opens inline time-picker modal
 *
 * LOCAL ONLY. No EventKit. No Reminders entitlement. No push server.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Linking,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  cancelNoteReminder,
  getPermissionStatus,
  getReminderForItem,
  scheduleNoteReminder,
} from '@/lib/notify';
import type { NotePhase } from '@/lib/notify';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(d: Date): string {
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function formatShort(d: Date): string {
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow =
    d.getDate() === tomorrow.getDate() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getFullYear() === tomorrow.getFullYear();

  if (isToday) return `Today ${formatTime(d)}`;
  if (isTomorrow) return `Tomorrow ${formatTime(d)}`;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + formatTime(d);
}

// ─── Quick-option presets ─────────────────────────────────────────────────────

interface QuickOption {
  label: string;
  getDate: () => Date;
}

function buildQuickOptions(): QuickOption[] {
  return [
    {
      label: 'In 1 hour',
      getDate: () => {
        const d = new Date();
        d.setHours(d.getHours() + 1, 0, 0, 0);
        return d;
      },
    },
    {
      label: 'Tomorrow morning (9 am)',
      getDate: () => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        d.setHours(9, 0, 0, 0);
        return d;
      },
    },
    {
      label: 'In 3 days (9 am)',
      getDate: () => {
        const d = new Date();
        d.setDate(d.getDate() + 3);
        d.setHours(9, 0, 0, 0);
        return d;
      },
    },
  ];
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ReminderButtonProps {
  itemId:             string;
  phase:              NotePhase;
  itemText:           string;
  onReminderChange?:  (date: Date | null) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ReminderButton({
  itemId,
  phase,
  itemText,
  onReminderChange,
}: ReminderButtonProps) {
  const [reminderDate, setReminderDate]   = useState<Date | null>(null);
  const [loading, setLoading]             = useState(true);
  const [modalVisible, setModalVisible]   = useState(false);
  const [permStatus, setPermStatus]       = useState<'granted' | 'denied' | 'undetermined'>('undetermined');
  const [pastError, setPastError]         = useState(false);
  const [scheduling, setScheduling]       = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Load existing reminder on mount / itemId change
  useEffect(() => {
    let active = true;
    setLoading(true);
    getReminderForItem(itemId)
      .then((r) => { if (active) setReminderDate(r?.date ?? null); })
      .catch(() => { if (active) setReminderDate(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [itemId]);

  // Pulse animation when a reminder is set
  useEffect(() => {
    if (!reminderDate) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.0, duration: 600, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reminderDate, pulseAnim]);

  const openPicker = useCallback(async () => {
    const status = await getPermissionStatus();
    setPermStatus(status);
    setPastError(false);
    setModalVisible(true);
  }, []);

  const scheduleQuick = useCallback(async (getDate: () => Date) => {
    const date = getDate();
    if (date.getTime() <= Date.now()) {
      setPastError(true);
      return;
    }
    setPastError(false);
    setScheduling(true);
    try {
      const id = await scheduleNoteReminder({
        itemId,
        phase,
        title: itemText,
        body: 'Tap to open your production notes.',
        date,
      });
      if (id !== null) {
        setReminderDate(date);
        onReminderChange?.(date);
        setModalVisible(false);
      }
    } finally {
      setScheduling(false);
    }
  }, [itemId, phase, itemText, onReminderChange]);

  const clearReminder = useCallback(async () => {
    await cancelNoteReminder(itemId);
    setReminderDate(null);
    onReminderChange?.(null);
  }, [itemId, onReminderChange]);

  if (loading) {
    return <ActivityIndicator size="small" color="#555" style={styles.loader} />;
  }

  return (
    <>
      <View style={styles.wrapper}>
        {reminderDate ? (
          // ── Set state: filled bell + time + clear button ──────────────
          <View style={styles.setRow}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Ionicons name="notifications" size={16} color="#00d4ff" />
            </Animated.View>
            <Text style={styles.timeLabel}>{formatShort(reminderDate)}</Text>
            <Pressable onPress={clearReminder} hitSlop={8} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={14} color="#555" />
            </Pressable>
          </View>
        ) : (
          // ── Unset state: outline bell ─────────────────────────────────
          <Pressable
            onPress={openPicker}
            hitSlop={10}
            style={({ pressed }) => [styles.bellBtn, pressed && { opacity: 0.6 }]}
          >
            <Ionicons name="notifications-outline" size={18} color="#555" />
          </Pressable>
        )}
      </View>

      {/* ── Picker modal ────────────────────────────────────────────────── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.sheet} onPress={e => e.stopPropagation()}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle} numberOfLines={2}>{itemText}</Text>
            <Text style={styles.sheetSubtitle}>Set a reminder</Text>

            {permStatus === 'denied' ? (
              // ── Permission denied state ──────────────────────────────
              <View style={styles.deniedBox}>
                <Ionicons name="notifications-off-outline" size={32} color="#555" />
                <Text style={styles.deniedText}>
                  Notifications are disabled. Enable them in Settings to set reminders.
                </Text>
                {Platform.OS !== 'web' && (
                  <Pressable
                    onPress={() => Linking.openSettings()}
                    style={styles.settingsBtn}
                  >
                    <Text style={styles.settingsBtnTxt}>Open Settings</Text>
                  </Pressable>
                )}
              </View>
            ) : (
              // ── Quick options ────────────────────────────────────────
              <>
                {buildQuickOptions().map((opt) => (
                  <Pressable
                    key={opt.label}
                    style={({ pressed }) => [
                      styles.optionBtn,
                      pressed && styles.optionBtnPressed,
                      scheduling && styles.optionBtnDisabled,
                    ]}
                    onPress={() => scheduleQuick(opt.getDate)}
                    disabled={scheduling}
                  >
                    <Ionicons name="time-outline" size={16} color="#00d4ff" />
                    <Text style={styles.optionTxt}>{opt.label}</Text>
                    {scheduling && (
                      <ActivityIndicator size="small" color="#555" style={styles.optSpinner} />
                    )}
                  </Pressable>
                ))}

                {pastError && (
                  <Text style={styles.errorTxt}>Please pick a future time.</Text>
                )}
              </>
            )}

            <Pressable
              onPress={() => setModalVisible(false)}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelTxt}>Cancel</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 28,
  },
  loader: {
    width: 28,
  },

  // Unset state
  bellBtn: {
    padding: 4,
  },

  // Set state
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  timeLabel: {
    color: '#00d4ff',
    fontSize: 10,
    fontWeight: '600',
    maxWidth: 70,
  },
  clearBtn: {
    padding: 2,
  },

  // Modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#111',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 12,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#333',
    alignSelf: 'center',
    marginBottom: 8,
  },
  sheetTitle: {
    color: '#eee',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  sheetSubtitle: {
    color: '#555',
    fontSize: 12,
    marginTop: -4,
    marginBottom: 4,
  },

  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  optionBtnPressed: {
    backgroundColor: 'rgba(0,212,255,0.1)',
    borderColor: 'rgba(0,212,255,0.3)',
  },
  optionBtnDisabled: {
    opacity: 0.5,
  },
  optionTxt: {
    flex: 1,
    color: '#eee',
    fontSize: 15,
  },
  optSpinner: {
    marginLeft: 4,
  },

  errorTxt: {
    color: '#E8000A',
    fontSize: 13,
    textAlign: 'center',
  },

  deniedBox: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  deniedText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  settingsBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,212,255,0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,212,255,0.3)',
  },
  settingsBtnTxt: {
    color: '#00d4ff',
    fontWeight: '700',
    fontSize: 14,
  },

  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  cancelTxt: {
    color: '#888',
    fontSize: 15,
    fontWeight: '600',
  },
});
