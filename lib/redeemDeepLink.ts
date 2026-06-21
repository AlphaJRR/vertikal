/**
 * Redeem code deep link helpers — universal link /r/:code and auth handoff.
 * Codes are stashed in AsyncStorage so sign-in → consent → redeem keeps the code.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STASH_KEY = 'ava_pending_redeem_code_v1';

/** Human-typable redeem codes — same charset as gen_redeem_code() in migration 005. */
export function normalizeRedeemCode(raw: string | string[] | undefined | null): string | null {
  if (raw == null) return null;
  const value = (Array.isArray(raw) ? raw[0] : raw).trim().toUpperCase();
  if (!value) return null;
  const cleaned = value.replace(/[^A-Z0-9]/g, '');
  return cleaned.length >= 3 ? cleaned.slice(0, 8) : null;
}

/** Parse https://alphavisualartists.com/r/CODE or ava://r/CODE */
export function parseRedeemCodeFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const match = parsed.pathname.match(/^\/r\/([^/?#]+)/i);
    if (match?.[1]) return normalizeRedeemCode(match[1]);
    if (parsed.hostname?.toLowerCase() === 'r' && parsed.pathname) {
      const seg = parsed.pathname.replace(/^\/+/, '').split('/')[0];
      if (seg) return normalizeRedeemCode(seg);
    }
  } catch {
    // ava:// links may need expo-linking parse — fall through
  }

  if (url.startsWith('ava://')) {
    const path = url.replace(/^ava:\/\//i, '');
    const segments = path.split('/').filter(Boolean);
    if (segments[0]?.toLowerCase() === 'r' && segments[1]) {
      return normalizeRedeemCode(segments[1]);
    }
  }

  return null;
}

export async function stashRedeemCode(code: string): Promise<void> {
  const normalized = normalizeRedeemCode(code);
  if (!normalized) return;
  await AsyncStorage.setItem(STASH_KEY, normalized);
}

export async function peekStashedRedeemCode(): Promise<string | null> {
  try {
    const raw = await AsyncStorage.getItem(STASH_KEY);
    return normalizeRedeemCode(raw);
  } catch {
    return null;
  }
}

export async function clearStashedRedeemCode(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STASH_KEY);
  } catch {
    // non-blocking
  }
}

export async function consumeStashedRedeemCode(): Promise<string | null> {
  const code = await peekStashedRedeemCode();
  return code;
}
