// lib/demoMode.ts
// -----------------------------------------------------------------------------
// Reviewer / Demo mode for Apple App Review (Guideline 2.1 / 2.1(a)).
// Non-destructive. Zero new dependencies (uses React's useSyncExternalStore +
// AsyncStorage, both already in the app). Does NOT touch Supabase auth.
//
// When demo mode is ON, useAvaPro() returns Pro, so EVERY existing gate
// (Tools-tab locks, app/lesson/[id] guard, RateCalculator) unlocks in one place.
// -----------------------------------------------------------------------------
import { useSyncExternalStore } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'ava_demo_mode_v1';
const DEMO_MODE_ENABLED = false;

let isDemoModeFlag = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

/** Call once on app start (e.g. in app/_layout.tsx) so demo mode survives relaunch. */
export async function hydrateDemoMode(): Promise<void> {
  if (!DEMO_MODE_ENABLED) {
    isDemoModeFlag = false;
    emit();
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore – production launch always defaults demo mode off
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

/** Turn on reviewer/demo mode. Persists so a reviewer stays in after backgrounding. */
export async function enableDemoMode(): Promise<void> {
  if (!DEMO_MODE_ENABLED) {
    isDemoModeFlag = false;
    emit();
    return;
  }

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
  if (!DEMO_MODE_ENABLED) return false;
  return isDemoModeFlag;
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
