/**
 * Guest gallery unlock — code only, no email account required.
 * Uses invisible Supabase anonymous session behind the scenes.
 */

import { useCallback, useState } from 'react';
import { useRouter, type Href } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { ensureGuestSession } from '@/lib/guestSession';
import {
  clearStashedRedeemCode,
  normalizeRedeemCode,
  stashRedeemCode,
} from '@/lib/redeemDeepLink';
import { saveRedeemContext } from '@/lib/redeemContext';
import type { RedeemResult } from '@/types/events';

const GALLERY: Href = '/gallery';
const LAST_CODE_KEY = 'ava:last_redeem_code';

export function useGuestGalleryUnlock(initialCode = '') {
  const router = useRouter();

  const [code, setCode] = useState(initialCode);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unlock = useCallback(async () => {
    const eventCode = normalizeRedeemCode(code);
    if (!eventCode || eventCode.length < 3) {
      setError('Enter the code your photographer gave you.');
      return;
    }

    setBusy(true);
    setError(null);

    try {
      await stashRedeemCode(eventCode);
      await ensureGuestSession();

      const { data, error: rpcErr } = await supabase
        .rpc('redeem_attendee_code', { p_code: eventCode });

      if (rpcErr) {
        const msg = rpcErr.message ?? '';
        if (msg.includes('Invalid code')) {
          setError('That code wasn\'t found. Ask your photographer to double-check it.');
        } else if (msg.includes('Code already claimed')) {
          setError('This code was opened on another phone. Use that device or ask your photographer for help.');
        } else if (msg.includes('Not authenticated')) {
          setError('Could not connect. Check your internet and try again.');
        } else {
          setError('Could not open your gallery. Please try again.');
          console.error('[guestUnlock] RPC error:', rpcErr);
        }
        return;
      }

      await clearStashedRedeemCode();
      await AsyncStorage.setItem(LAST_CODE_KEY, eventCode);

      const row = Array.isArray(data) ? (data[0] as RedeemResult) : (data as RedeemResult);
      if (!row?.attendee_id || !row?.event_id) {
        setError('Could not open your gallery. Please try again.');
        return;
      }

      await saveRedeemContext({
        attendeeId: row.attendee_id,
        eventId:    row.event_id,
        code:       eventCode,
      });

      router.replace(GALLERY);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      console.error('[guestUnlock] unexpected error:', err);
      setError(message);
    } finally {
      setBusy(false);
    }
  }, [code, router]);

  return {
    code,
    setCode,
    busy,
    error,
    unlock,
    setError,
  };
}
