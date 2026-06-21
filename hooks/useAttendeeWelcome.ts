/**
 * Guest welcome state — event cover + assigned photo count after code redeem.
 * Scopes to the attendee row from the last redeem (see lib/redeemContext.ts).
 */

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { loadRedeemContext } from '@/lib/redeemContext';

export interface AttendeeWelcomeState {
  attendeeId:       string;
  eventId:          string;
  eventName:        string;
  coverImageUrl:    string | null;
  welcomeMessage:   string | null;
  assignedCount:    number;
  photoConsentAt:   string | null;
}

interface UseAttendeeWelcomeReturn {
  welcome:   AttendeeWelcomeState | null;
  loading:   boolean;
  refresh:   () => Promise<void>;
}

async function resolveAttendeeRow(userId: string): Promise<{
  id: string;
  event_id: string;
  photo_consent_at: string | null;
  events: { name: string; cover_image_url: string | null; welcome_message: string | null };
} | null> {
  const ctx = await loadRedeemContext();

  if (ctx?.attendeeId) {
    const { data, error } = await supabase
      .from('attendees')
      .select(`
        id,
        event_id,
        photo_consent_at,
        events!inner (
          name,
          cover_image_url,
          welcome_message
        )
      `)
      .eq('id', ctx.attendeeId)
      .eq('user_id', userId)
      .is('deleted_at', null)
      .maybeSingle();

    if (!error && data) {
      return data as typeof data & {
        events: { name: string; cover_image_url: string | null; welcome_message: string | null };
      };
    }
  }

  if (ctx?.code) {
    const { data, error } = await supabase
      .from('attendees')
      .select(`
        id,
        event_id,
        photo_consent_at,
        events!inner (
          name,
          cover_image_url,
          welcome_message
        )
      `)
      .eq('user_id', userId)
      .eq('redeem_code', ctx.code.toUpperCase())
      .is('deleted_at', null)
      .maybeSingle();

    if (!error && data) {
      return data as typeof data & {
        events: { name: string; cover_image_url: string | null; welcome_message: string | null };
      };
    }
  }

  const { data, error } = await supabase
    .from('attendees')
    .select(`
      id,
      event_id,
      photo_consent_at,
      events!inner (
        name,
        cover_image_url,
        welcome_message
      )
    `)
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data as typeof data & {
    events: { name: string; cover_image_url: string | null; welcome_message: string | null };
  };
}

export function useAttendeeWelcome(): UseAttendeeWelcomeReturn {
  const { session } = useAuth();
  const [welcome, setWelcome] = useState<AttendeeWelcomeState | null>(null);
  const [loading, setLoading]   = useState(true);

  const refresh = useCallback(async () => {
    if (!session?.user) {
      setWelcome(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const att = await resolveAttendeeRow(session.user.id);
      if (!att) {
        setWelcome(null);
        return;
      }

      const evRaw = att.events;
      const ev = (Array.isArray(evRaw) ? evRaw[0] : evRaw) as {
        name: string;
        cover_image_url: string | null;
        welcome_message: string | null;
      };

      const { count, error: countErr } = await supabase
        .from('photo_assignments')
        .select('*', { count: 'exact', head: true })
        .eq('attendee_id', att.id);

      if (countErr) {
        console.error('[useAttendeeWelcome] count failed:', countErr);
      }

      setWelcome({
        attendeeId:     att.id,
        eventId:        att.event_id,
        eventName:      ev.name,
        coverImageUrl:  ev.cover_image_url,
        welcomeMessage: ev.welcome_message,
        assignedCount:  count ?? 0,
        photoConsentAt: att.photo_consent_at,
      });
    } catch (err) {
      console.error('[useAttendeeWelcome] refresh failed:', err);
      setWelcome(null);
    } finally {
      setLoading(false);
    }
  }, [session?.user]);

  useEffect(() => { void refresh(); }, [refresh]);

  return { welcome, loading, refresh };
}
