import { useLocalSearchParams } from 'expo-router';

/** Normalize expo-router params that may be string | string[]. */
export function useRouteParam(name: string): string {
  const params = useLocalSearchParams<Record<string, string | string[]>>();
  const raw = params[name];
  if (Array.isArray(raw)) return raw[0] ?? '';
  return typeof raw === 'string' ? raw : '';
}
