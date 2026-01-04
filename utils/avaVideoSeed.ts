/**
 * AVA Profile Video Seed Data
 * App-only Cloudflare Stream video for Alpha Visual Artists profile preview
 */

export interface AVAVideoData {
  id: string;
  title: string;
  creatorHandle: string;
  networkHandle: string;
  cloudflare: {
    uid: string;
    iframe: string;
    thumbnail: string;
    duration: number;
  };
  vibeThreadId: string;
  vibePreset: Array<{ t: number; u: string; m: string }>;
  placement: {
    surfaces: string[];
    appOnly: boolean;
    hideFrom: string[];
  };
}

export const AVA_KT_CONSIGNMENT_VIDEO: AVAVideoData = {
  id: "cf_547a1e91b487fdae35cf018718b4c07d",
  title: "KT CONSIGNMENT — Music Trailer",
  creatorHandle: "alphavisualartists",
  networkHandle: "alphavisualartists",
  cloudflare: {
    uid: "547a1e91b487fdae35cf018718b4c07d",
    iframe: "https://customer-fyh68ijrcuys7ag8.cloudflarestream.com/547a1e91b487fdae35cf018718b4c07d/iframe",
    thumbnail: "https://customer-fyh68ijrcuys7ag8.cloudflarestream.com/547a1e91b487fdae35cf018718b4c07d/thumbnails/thumbnail.jpg",
    duration: 91.4,
  },
  vibeThreadId: "vibe_ava_kt_trailer_v1",
  vibePreset: [
    { t: 2.0, u: "Founder50", m: "AVA always looks cinematic 😮‍💨" },
    { t: 6.0, u: "Network", m: "This trailer energy is crazy 🔥" },
    { t: 11.0, u: "Producer", m: "KT Consignment bout to go UP." },
    { t: 18.0, u: "Creator", m: "That cut timing is clean." },
    { t: 28.0, u: "Viewer", m: "Need the full series ASAP." },
    { t: 42.0, u: "AVA_Member", m: "VIBE™ makes this feel live." },
    { t: 60.0, u: "Director", m: "Okay… this is premium." },
  ],
  placement: {
    surfaces: ["app_profile_preview_alphavisualartists"],
    appOnly: true,
    hideFrom: ["app_home_hero", "app_feed_default", "web_all"],
  },
};

/**
 * Check if video should be shown for a given creator
 * Matches on: 'Alpha', 'alphavisualartists', 'Alpha Visuals', 'Alpha Visual Artists'
 */
export function shouldShowAVAVideo(creatorId: string, creatorHandle?: string, creatorUsername?: string, creatorSlug?: string, creatorName?: string): boolean {
  const identifiers = [creatorId, creatorHandle, creatorUsername, creatorSlug, creatorName].filter(Boolean);
  const normalized = identifiers.map(id => id?.toLowerCase().replace(/\s+/g, ''));
  return normalized.some(id => 
    id === 'alphavisualartists' || 
    id === 'alphavisuals' ||
    id === 'alpha'
  );
}

/**
 * Get AVA video data if applicable
 */
export function getAVAVideoData(creatorId: string, creatorHandle?: string, creatorUsername?: string, creatorSlug?: string, creatorName?: string): AVAVideoData | null {
  if (shouldShowAVAVideo(creatorId, creatorHandle, creatorUsername, creatorSlug, creatorName)) {
    return AVA_KT_CONSIGNMENT_VIDEO;
  }
  return null;
}

