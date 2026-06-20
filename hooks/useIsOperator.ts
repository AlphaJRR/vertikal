/**
 * Returns whether the current user is a registered event operator.
 *
 * Operator status is granted by an admin via the event_operators table
 * (migration 006). It is NOT self-assignable and NOT a signup toggle.
 *
 * Implementation:
 *   Calls supabase.rpc('is_event_operator') — a SECURITY DEFINER function
 *   that checks event_operators for the calling user's UID.
 *
 * Safety contract:
 *   - While loading  → isOperator = false  (never assume elevated access)
 *   - On RPC error   → isOperator = false  (fail closed)
 *   - On sign-out    → isOperator = false  (reset immediately)
 *   - Result is cached per session; re-checks on auth state change.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface UseIsOperatorReturn {
  isOperator: boolean;
  loading:    boolean;
  refresh:    () => Promise<void>;
}

export function useIsOperator(): UseIsOperatorReturn {
  const { session } = useAuth();
  const [isOperator, setIsOperator] = useState(false);  // fail-closed default
  const [loading,    setLoading]    = useState(true);
  const checkedRef                  = useRef(false);

  const check = useCallback(async () => {
    if (!session?.user) {
      setIsOperator(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('is_event_operator');
      if (error) {
        // Fail closed — never assume operator on error
        console.warn('[useIsOperator] RPC error (defaulting to false):', error.message);
        setIsOperator(false);
      } else {
        setIsOperator(data === true);
      }
    } catch (err) {
      console.warn('[useIsOperator] unexpected error (defaulting to false):', err);
      setIsOperator(false);
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Check on mount + whenever session changes
  useEffect(() => {
    checkedRef.current = false;
    void check();
  }, [check]);

  // Re-check when app returns to foreground (operator grant may have changed)
  useEffect(() => {
    const handleAppState = (next: AppStateStatus) => {
      if (next === 'active' && session?.user) {
        void check();
      }
    };
    const sub = AppState.addEventListener('change', handleAppState);
    return () => sub.remove();
  }, [check, session]);

  return { isOperator, loading, refresh: check };
}
