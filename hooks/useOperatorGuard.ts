/**
 * Operator route guard hook.
 *
 * Add to the top of every operator-only screen (create event, upload,
 * assign, create-attendee, dashboard). If the user is a non-operator
 * (after the loading check resolves), they are redirected to the Events
 * tab entry point.
 *
 * Critical: the redirect only fires AFTER loading = false.
 * While loading = true we return { isOperator: false, loading: true }
 * so callers must render a neutral skeleton, not the operator surface.
 *
 * Note: this is UI-level enforcement only. The actual security is at the DB
 * layer via the events_operator_insert RLS policy in migration 006.
 */

import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useIsOperator } from './useIsOperator';

interface UseOperatorGuardReturn {
  isOperator: boolean;
  loading:    boolean;
}

export function useOperatorGuard(): UseOperatorGuardReturn {
  const router = useRouter();
  const { isOperator, loading } = useIsOperator();

  useEffect(() => {
    if (!loading && !isOperator) {
      // Redirect to the Events tab, which will show the attendee view
      router.replace('/(tabs)' as never);
    }
  }, [isOperator, loading, router]);

  return { isOperator, loading };
}
