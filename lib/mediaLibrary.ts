/**
 * Lazy expo-media-library access — avoids launch/route crash when the native
 * module is missing from the installed TestFlight build (OTA-only JS update).
 */

type MediaLibraryModule = typeof import('expo-media-library');

let cached: MediaLibraryModule | null | undefined;

async function loadMediaLibrary(): Promise<MediaLibraryModule | null> {
  if (cached !== undefined) return cached;
  try {
    cached = await import('expo-media-library');
    return cached;
  } catch (err) {
    console.warn('[mediaLibrary] native module unavailable:', err);
    cached = null;
    return null;
  }
}

export async function isMediaLibraryAvailable(): Promise<boolean> {
  return (await loadMediaLibrary()) !== null;
}

export async function saveImageToPhotoLibrary(localUri: string): Promise<
  { ok: true } | { ok: false; reason: 'unavailable' | 'denied' | 'error'; message?: string }
> {
  const MediaLibrary = await loadMediaLibrary();
  if (!MediaLibrary) {
    return { ok: false, reason: 'unavailable' };
  }

  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      return { ok: false, reason: 'denied' };
    }
    await MediaLibrary.saveToLibraryAsync(localUri);
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Save failed';
    console.error('[mediaLibrary] saveToLibraryAsync failed:', err);
    return { ok: false, reason: 'error', message };
  }
}
