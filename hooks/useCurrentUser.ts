import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // DEMO MODE: Return null immediately
    setUser(null);
    setSession(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    data: null,
    user: null,
    session: null,
    isLoading: false,
    error: null,
  };
}




