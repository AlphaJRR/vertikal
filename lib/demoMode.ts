// lib/demoMode.ts
// -----------------------------------------------------------------------------
// Local dev-only reviewer mode. Does NOT touch Supabase auth.
// Gated by ENABLE_REVIEWER_DEMO (__DEV__) — never active in App Store builds.
// When demo mode is ON in dev, useAvaPro() returns Pro for gate testing.
// -----------------------------------------------------------------------------
import { useSyncExternalStore } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENABLE_REVIEWER_DEMO } from '../constants/demoReview';

const STORAGE_KEY = 'ava_demo_mode_v1';

let isDemoModeFlag = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

/** Call once on app start (e.g. in app/_layout.tsx). Clears stale demo state on production builds. */
export async function hydrateDemoMode(): Promise<void> {
  if (!ENABLE_REVIEWER_DEMO) {
    isDemoModeFlag = false;
    emit();
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    return;
  }

  try {
    const v = await AsyncStorage.getItem(STORAGE_KEY);
    if (v === 'true') {
      isDemoModeFlag = true;
      emit();
    }
  } catch {
    // ignore – default stays false (locked)
  }
}

/** Turn on reviewer/demo mode. Dev builds only — no-op on App Store / TestFlight. */
export async function enableDemoMode(): Promise<void> {
  if (!ENABLE_REVIEWER_DEMO) return;

  isDemoModeFlag = true;
  emit();
  try {
    await AsyncStorage.setItem(STORAGE_KEY, 'true');
  } catch {
    // in-memory flag still works for this session
  }
}

/** Exit reviewer/demo mode and return to the normal (free/locked) experience. */
export async function exitDemoMode(): Promise<void> {
  isDemoModeFlag = false;
  emit();
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** Non-hook read, for use inside useAvaPro or anywhere outside React render. */
export function getDemoMode(): boolean {
  return ENABLE_REVIEWER_DEMO && isDemoModeFlag;
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/** Reactive hook – re-renders consumers when demo mode flips. */
export function useDemoMode(): boolean {
  return useSyncExternalStore(subscribe, getDemoMode, getDemoMode);
}
