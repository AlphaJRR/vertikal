/**
 * CRUD hooks for events + attendees tables.
 * Table names match ava-event-delivery-migration.sql exactly.
 */

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { attendeeFullName } from '@/types/events';
import type { AVAEvent, Attendee } from '@/types/events';

// ─── useMyEvents ─────────────────────────────────────────────────────────────

export interface CreateEventInput {
  name:            string;
  event_date?:     string;   // ISO date, optional
  access_code:     string;   // required — attendees enter this to unlock gallery
  event_type?:     string;
  cover_image_url?: string;
}

interface UseMyEventsReturn {
  events:  AVAEvent[];
  loading: boolean;
  error:   string | null;
  refresh: () => Promise<void>;
  create:  (data: CreateEventInput) => Promise<AVAEvent | null>;
}

export function useMyEvents(): UseMyEventsReturn {
  const [events,  setEvents]  = useState<AVAEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });
      if (err) throw err;
      setEvents((data as AVAEvent[]) ?? []);
    } catch (err) {
      console.error('[useMyEvents] fetch failed:', err);
      setError('Could not load events.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const create = useCallback(async (input: CreateEventInput): Promise<AVAEvent | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error: err } = await supabase
        .from('events')
        .insert({
          photographer_id: user.id,
          name:            input.name,
          event_date:      input.event_date     ?? null,
          access_code:     input.access_code.trim().toUpperCase(),
          event_type:      input.event_type     ?? 'reunion',
          cover_image_url: input.cover_image_url ?? null,
          status:          'active',
        })
        .select()
        .single();

      if (err) throw err;
      await refresh();
      return data as AVAEvent;
    } catch (err) {
      console.error('[useMyEvents] create failed:', err);
      return null;
    }
  }, [refresh]);

  return { events, loading, error, refresh, create };
}

// ─── useEvent ────────────────────────────────────────────────────────────────

interface UseEventReturn {
  event:   AVAEvent | null;
  loading: boolean;
  error:   string | null;
  refresh: () => Promise<void>;
}

export function useEvent(eventId: string): UseEventReturn {
  const [event,   setEvent]   = useState<AVAEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();
      if (err) throw err;
      setEvent(data as AVAEvent);
    } catch (err) {
      console.error('[useEvent] fetch failed:', err);
      setError('Could not load event.');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => { void refresh(); }, [refresh]);
  return { event, loading, error, refresh };
}

// ─── useAttendees ─────────────────────────────────────────────────────────────

export interface AddAttendeeInput {
  first_name:       string;
  last_name:        string;
  email?:           string;
  phone?:           string;
  photos_purchased: number;
}

interface UseAttendeesReturn {
  attendees: Attendee[];
  loading:   boolean;
  error:     string | null;
  refresh:   () => Promise<void>;
  add:       (data: AddAttendeeInput) => Promise<Attendee | null>;
  search:    (query: string) => Attendee[];
}

export function useAttendees(eventId: string): UseAttendeesReturn {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('attendees')
        .select('*')
        .eq('event_id', eventId)
        .is('deleted_at', null)           // exclude soft-deleted
        .order('first_name');
      if (err) throw err;
      setAttendees((data as Attendee[]) ?? []);
    } catch (err) {
      console.error('[useAttendees] fetch failed:', err);
      setError('Could not load attendees.');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => { void refresh(); }, [refresh]);

  const add = useCallback(async (input: AddAttendeeInput): Promise<Attendee | null> => {
    try {
      const { data, error: err } = await supabase
        .from('attendees')
        .insert({
          event_id:         eventId,
          first_name:       input.first_name.trim(),
          last_name:        input.last_name.trim(),
          email:            input.email?.trim().toLowerCase() ?? null,
          phone:            input.phone?.trim() ?? null,
          photos_purchased: input.photos_purchased,
        })
        .select()
        .single();
      if (err) throw err;
      await refresh();
      return data as Attendee;
    } catch (err) {
      console.error('[useAttendees] add failed:', err);
      return null;
    }
  }, [eventId, refresh]);

  const search = useCallback((query: string): Attendee[] => {
    const q = query.toLowerCase().trim();
    if (!q) return attendees;
    return attendees.filter(a => {
      const full = attendeeFullName(a).toLowerCase();
      return full.includes(q) || (a.email ?? '').toLowerCase().includes(q);
    });
  }, [attendees]);

  return { attendees, loading, error, refresh, add, search };
}
