/**
 * Operator attendee report — guests ordered by code creation time (created_at).
 * Includes package photo count vs assigned photo count.
 */

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { attendeeFullName } from '@/types/events';
import type { Attendee } from '@/types/events';

export interface AttendeeReportRow {
  attendee: Attendee;
  photosAssigned: number;
  displayName: string;
}

interface UseAttendeeReportReturn {
  rows:    AttendeeReportRow[];
  loading: boolean;
  error:   string | null;
  refresh: () => Promise<void>;
}

type AttendeeRow = Attendee & {
  photo_assignments: Array<{ count: number }> | null;
};

export function useAttendeeReport(eventId: string): UseAttendeeReportReturn {
  const [rows,    setRows]    = useState<AttendeeReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('attendees')
        .select(`
          *,
          photo_assignments(count)
        `)
        .eq('event_id', eventId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true });

      if (err) throw err;

      const mapped = ((data as AttendeeRow[]) ?? []).map(row => {
        const { photo_assignments, ...attendee } = row;
        const photosAssigned = photo_assignments?.[0]?.count ?? 0;
        return {
          attendee: attendee as Attendee,
          photosAssigned,
          displayName: attendeeFullName(attendee as Attendee),
        };
      });

      setRows(mapped);
    } catch (err) {
      console.error('[useAttendeeReport] fetch failed:', err);
      setError('Could not load attendee report.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => { void refresh(); }, [refresh]);

  useEffect(() => {
    if (!eventId) return;
    const ch = supabase
      .channel(`attendee-report:${eventId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'attendees', filter: `event_id=eq.${eventId}` },
        () => { void refresh(); },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'photo_assignments' },
        () => { void refresh(); },
      )
      .subscribe();
    return () => { void supabase.removeChannel(ch); };
  }, [eventId, refresh]);

  return { rows, loading, error, refresh };
}
