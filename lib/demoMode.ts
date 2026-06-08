// lib/demoMode.ts
import { useSyncExternalStore } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'ava_demo_mode_v1';
let isDemoModeFlag = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export async function hydrateDemoMode(): Promise<void> {
  try {
    const v = await AsyncStorage.getItem(STORAGE_KEY);
    if (v === 'true') { isDemoModeFlag = true; emit(); }
  } catch {}
}
export async function enableDemoMode(): Promise<void> {
  isDemoModeFlag = true; emit();
  try { await AsyncStorage.setItem(STORAGE_KEY, 'true'); } catch {}
}
export async function exitDemoMode(): Promise<void> {
  isDemoModeFlag = false; emit();
  try { await AsyncStorage.removeItem(STORAGE_KEY); } catch {}
}
export function getDemoMode(): boolean { return isDemoModeFlag; }
function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}
export function useDemoMode(): boolean {
  return useSyncExternalStore(subscribe, getDemoMode, getDemoMode);
}
