/**
 * Joshua Argue Profile Video Seed Data
 * Cloudflare Stream video for Joshua Argue profile preview
 */

export interface JoshuaArgueVideoData {
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

export const JOSHUA_ARGUE_BEST_BURGERS_VIDEO: JoshuaArgueVideoData = {
  id: "cf_9d3d0efed36b71e5f75c7b5e218809d7",
  title: "ARGUEably the Best Burgers",
  creatorHandle: "joshuaargue",
  networkHandle: "blackawesomeness",
  cloudflare: {
    uid: "9d3d0efed36b71e5f75c7b5e218809d7",
    iframe: "https://customer-fyh68ijrcuys7ag8.cloudflarestream.com/9d3d0efed36b71e5f75c7b5e218809d7/iframe",
    thumbnail: "https://customer-fyh68ijrcuys7ag8.cloudflarestream.com/9d3d0efed36b71e5f75c7b5e218809d7/thumbnails/thumbnail.jpg",
    duration: 57.3,
  },
  vibeThreadId: "vibe_argueably_best_burgers_v1",
  vibePreset: [
    { t: 2.5, u: "AVA_Member", m: "This intro is CRAZY 🔥" },
    { t: 6.0, u: "Founder50", m: "Vertical cinema is rotating. Not dying." },
    { t: 9.2, u: "BlackAwe", m: "Argue don't miss 🎬" },
    { t: 13.0, u: "KelFan", m: "That pacing is clean 😮‍💨" },
    { t: 18.5, u: "Showrunner", m: "This looks premium." },
    { t: 25.0, u: "Network", m: "We need Episode 1 ASAP." },
    { t: 33.0, u: "Creator", m: "The vibe overlay is the sauce." },
    { t: 45.0, u: "Viewer", m: "Okay… I'm locked in." },
  ],
  placement: {
    surfaces: ["app_profile_preview_joshuaargue"],
    appOnly: true,
    hideFrom: ["app_home_hero", "app_feed_default", "web_all"],
  },
};

/**
 * Check if video should be shown for Joshua Argue
 */
export function shouldShowJoshuaArgueVideo(creatorId: string, creatorHandle?: string, creatorUsername?: string, creatorSlug?: string, creatorName?: string): boolean {
  const identifiers = [creatorId, creatorHandle, creatorUsername, creatorSlug, creatorName].filter(Boolean);
  const normalized = identifiers.map(id => id?.toLowerCase().replace(/\s+/g, ''));
  return normalized.some(id => 
    id === 'joshuaargue' || 
    id === 'joshua-argue' ||
    id === 'joshua argue' ||
    (id.includes('joshua') && id.includes('argue'))
  );
}

/**
 * Get Joshua Argue video data if applicable
 */
export function getJoshuaArgueVideoData(creatorId: string, creatorHandle?: string, creatorUsername?: string, creatorSlug?: string, creatorName?: string): JoshuaArgueVideoData | null {
  if (shouldShowJoshuaArgueVideo(creatorId, creatorHandle, creatorUsername, creatorSlug, creatorName)) {
    return JOSHUA_ARGUE_BEST_BURGERS_VIDEO;
  }
  return null;
}

