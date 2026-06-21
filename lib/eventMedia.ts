/**
 * Shared helpers for event photo + video delivery.
 */

export type EventMediaKind = 'photo' | 'video';

const VIDEO_EXTS = new Set(['mp4', 'mov', 'm4v', 'webm']);

export function isVideoMediaKind(kind: string | null | undefined): boolean {
  return kind === 'video';
}

export function mediaKindFromFilename(name: string | null | undefined): EventMediaKind {
  if (!name) return 'photo';
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  return VIDEO_EXTS.has(ext) ? 'video' : 'photo';
}

export function contentTypeForUpload(filename: string, mediaKind: EventMediaKind): string {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  if (mediaKind === 'video') {
    if (ext === 'mov') return 'video/quicktime';
    if (ext === 'webm') return 'video/webm';
    return 'video/mp4';
  }
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  return 'image/jpeg';
}

export function defaultFilename(mediaKind: EventMediaKind, itemId: string): string {
  return mediaKind === 'video' ? `clip-${itemId.slice(0, 8)}.mp4` : `photo-${itemId.slice(0, 8)}.jpg`;
}

export function cacheExtension(localUri: string, mediaKind: EventMediaKind): string {
  const lower = localUri.toLowerCase();
  if (mediaKind === 'video') {
    if (lower.includes('.mov')) return 'mov';
    if (lower.includes('.m4v')) return 'm4v';
    return 'mp4';
  }
  return lower.includes('.png') ? 'png' : 'jpg';
}
