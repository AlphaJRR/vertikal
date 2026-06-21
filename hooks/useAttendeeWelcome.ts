/**
 * Guest welcome state — event cover + assigned photo count after code redeem.
 */

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

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
      const { data: att, error: attErr } = await supabase
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
        .eq('user_id', session.user.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (attErr || !att) {
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
        attendeeId:     att.id as string,
        eventId:        att.event_id as string,
        eventName:      ev.name,
        coverImageUrl:  ev.cover_image_url,
        welcomeMessage: ev.welcome_message,
        assignedCount:  count ?? 0,
        photoConsentAt: att.photo_consent_at as string | null,
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
