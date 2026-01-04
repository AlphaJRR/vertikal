import type { Creator } from '../utils/types';

interface Show {
  id: string;
  title: string;
  series?: string;
  creator_id: string;
  thumbnail: string;
  video_url?: string;
  tags?: string[];
  duration?: number;
  views?: number;
  likes?: number;
  published_at?: string;
  episode?: number;
  season?: number;
  cloudflare?: {
    uid: string;
    iframe: string;
    thumbnail: string;
    duration: number;
    readyToStream: boolean;
  };
  streamUid?: string; // Alias for cloudflare.uid
  readyToStream?: boolean; // Alias for cloudflare.readyToStream
}

// Demo Creator: JoeGuidry
export const DEMO_JOEGUIDRY: Creator = {
  id: 'joeguidry',
  name: 'Joe Guidry',
  role: 'Creator',
  company: 'Independent',
  avatar: 'https://www.dropbox.com/scl/fi/dgf6xyzfvq5hl2kj093cq/Image-1.jpg?rlkey=c2por9s72xsafnng0dp9azex5&st=qgogul20&raw=1',
  bio: 'Creating compelling vertical content.',
  stats: { fans: '5.2k', series: '1', views: '12k' },
  type: 'creator',
  isFounding50: true,
  projects: [],
};

// Demo Network: Cloaq Studios
export const DEMO_CLOAQ: Creator = {
  id: 'cloaqstudios',
  name: 'Cloaq Studios',
  role: 'NETWORK',
  company: 'Cloaq Studios',
  avatar: 'https://www.dropbox.com/scl/fi/dgf6xyzfvq5hl2kj093cq/Image-1.jpg?rlkey=c2por9s72xsafnng0dp9azex5&st=qgogul20&raw=1',
  bio: 'A creative network for vertical storytelling.',
  stats: { fans: '25k', series: '2', views: '150k' },
  type: 'network',
  isFounding50: false,
  projects: [],
  roster: ['joeguidry'],
};

// Demo Network: Black Awesomeness
export const DEMO_BLACK_AWESOMENESS: Creator = {
  id: 'blackawesomeness',
  name: 'Black Awesomeness',
  role: 'NETWORK',
  company: 'Black Awesomeness',
  avatar: 'https://www.dropbox.com/scl/fi/7deqzj0fkqr4my6cgi9ik/Image-2.jpg?rlkey=szrgy5uqh14m7k8k3lvvu5fic&st=a6f8yfx0&raw=1',
  bio: 'The Hub for Urban Cinema.',
  stats: { fans: '150k', series: '12', views: '2.5M' },
  type: 'network',
  isFounding50: true,
  projects: [
    {
      title: 'ARGUEably the Best Burgers',
      type: 'DOCU',
      img: 'https://customer-fyh68ijrcuys7ag8.cloudflarestream.com/9d3d0efed36b71e5f75c7b5e218809d7/thumbnails/thumbnail.jpg',
    },
  ],
  roster: ['joshuaargue'],
};

// Cloudflare Customer ID
const CLOUDFLARE_CUSTOMER_ID = 'fyh68ijrcuys7ag8';

// Helper to build Cloudflare URLs
function buildCloudflareUrls(uid: string) {
  return {
    uid,
    iframe: `https://customer-${CLOUDFLARE_CUSTOMER_ID}.cloudflarestream.com/${uid}/iframe`,
    thumbnail: `https://customer-${CLOUDFLARE_CUSTOMER_ID}.cloudflarestream.com/${uid}/thumbnails/thumbnail.jpg?time=2s`,
    duration: 57.3,
    readyToStream: true,
  };
}

// Demo Shows - All with Cloudflare Stream data
export const DEMO_SHOW_DARK_ROOM: Show = {
  id: 'dark-room-ep1',
  title: 'Dark Room - Episode 1',
  series: 'Dark Room',
  creator_id: 'joeguidry',
  // ✅ Use Cloudflare Stream thumbnail
  thumbnail: `https://customer-${CLOUDFLARE_CUSTOMER_ID}.cloudflarestream.com/9d3d0efed36b71e5f75c7b5e218809d7/thumbnails/thumbnail.jpg?time=2s`,
  video_url: `https://customer-${CLOUDFLARE_CUSTOMER_ID}.cloudflarestream.com/9d3d0efed36b71e5f75c7b5e218809d7/mp4`,
  cloudflare: buildCloudflareUrls('9d3d0efed36b71e5f75c7b5e218809d7'),
  streamUid: '9d3d0efed36b71e5f75c7b5e218809d7',
  readyToStream: true,
  tags: ['thriller', 'mystery', 'series'],
  duration: 300,
  views: 8500,
  likes: 234,
  published_at: '2024-01-10T10:00:00Z',
  episode: 1,
  season: 1,
};

export const DEMO_SHOW_BEST_BURGERS: Show = {
  id: 'best-burgers-ep1',
  title: 'The Best Burgers - Episode 1',
  series: 'The Best Burgers',
  creator_id: 'joshuaargue',
  // ✅ Use Cloudflare Stream thumbnail
  thumbnail: `https://customer-${CLOUDFLARE_CUSTOMER_ID}.cloudflarestream.com/9d3d0efed36b71e5f75c7b5e218809d7/thumbnails/thumbnail.jpg?time=2s`,
  video_url: `https://customer-${CLOUDFLARE_CUSTOMER_ID}.cloudflarestream.com/9d3d0efed36b71e5f75c7b5e218809d7/mp4`,
  cloudflare: buildCloudflareUrls('9d3d0efed36b71e5f75c7b5e218809d7'),
  streamUid: '9d3d0efed36b71e5f75c7b5e218809d7',
  readyToStream: true,
  tags: ['food', 'documentary', 'chicago'],
  duration: 240,
  views: 125000,
  likes: 5200,
  published_at: '2024-01-15T10:00:00Z',
  episode: 1,
  season: 1,
};

export const DEMO_SHOW_ORIGINS: Show = {
  id: 'origins-ep1',
  title: 'Origins - Episode 1',
  series: 'Origins',
  creator_id: 'cloaqstudios',
  // ✅ Use Cloudflare Stream thumbnail
  thumbnail: `https://customer-${CLOUDFLARE_CUSTOMER_ID}.cloudflarestream.com/9d3d0efed36b71e5f75c7b5e218809d7/thumbnails/thumbnail.jpg?time=2s`,
  video_url: `https://customer-${CLOUDFLARE_CUSTOMER_ID}.cloudflarestream.com/9d3d0efed36b71e5f75c7b5e218809d7/mp4`,
  cloudflare: buildCloudflareUrls('9d3d0efed36b71e5f75c7b5e218809d7'),
  streamUid: '9d3d0efed36b71e5f75c7b5e218809d7',
  readyToStream: true,
  tags: ['drama', 'series', 'origin'],
  duration: 280,
  views: 12000,
  likes: 456,
  published_at: '2024-01-12T14:00:00Z',
  episode: 1,
  season: 1,
};

// FEATURED VIDEO: ARGUEably the Best Burgers (Cloudflare Stream)
export const FEATURED_VIDEO = {
  id: "cf_9d3d0efed36b71e5f75c7b5e218809d7",
  title: "ARGUEably the Best Burgers",
  series: "The Best Burgers",
  creator_id: "joshuaargue",
  creatorHandle: "joshuaargue",
  networkHandle: "blackawesomeness",
  cloudflare: {
    uid: "9d3d0efed36b71e5f75c7b5e218809d7",
    iframe: "https://customer-fyh68ijrcuys7ag8.cloudflarestream.com/9d3d0efed36b71e5f75c7b5e218809d7/iframe",
    hls: "https://customer-fyh68ijrcuys7ag8.cloudflarestream.com/9d3d0efed36b71e5f75c7b5e218809d7/manifest/video.m3u8",
    mp4: "https://customer-fyh68ijrcuys7ag8.cloudflarestream.com/9d3d0efed36b71e5f75c7b5e218809d7/mp4",
    thumbnail: "https://customer-fyh68ijrcuys7ag8.cloudflarestream.com/9d3d0efed36b71e5f75c7b5e218809d7/thumbnails/thumbnail.jpg",
    duration: 57.3,
    readyToStream: true, // ✅ Joshua Argue's Best Burgers video is ready
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
  thumbnail: "https://customer-fyh68ijrcuys7ag8.cloudflarestream.com/9d3d0efed36b71e5f75c7b5e218809d7/thumbnails/thumbnail.jpg",
  video_url: "https://customer-fyh68ijrcuys7ag8.cloudflarestream.com/9d3d0efed36b71e5f75c7b5e218809d7/mp4",
  tags: ["featured", "premiere", "food", "documentary"],
  duration: 57,
  views: 0,
  likes: 0,
  published_at: new Date().toISOString(),
  episode: 1,
  season: 1,
};

// Demo Feed Data - Featured video first, then Best Burgers
export const DEMO_FEED: Show[] = [
  FEATURED_VIDEO as Show,
  DEMO_SHOW_BEST_BURGERS,
  DEMO_SHOW_DARK_ROOM,
  DEMO_SHOW_ORIGINS,
];

// Demo Creator: Joshua Argue (for The Best Burgers)
export const DEMO_JOSHUA_ARGUE: Creator = {
  id: 'joshuaargue',
  name: 'Joshua Argue',
  role: 'Creator / Lead',
  company: 'Black Awesomeness',
  avatar: 'https://www.dropbox.com/scl/fi/vaudy76mhaqtcukpkzeve/JoshuaArgue.JPG?rlkey=is2eixyxhseij6jft5k91zm9k&st=0mp4lgv9&raw=1',
  bio: 'Showrunner. Creating @BestBurgers.',
  stats: { fans: '850k', series: '5', views: '42M' },
  type: 'creator',
  isFounding50: true,
  projects: [
    {
      title: 'ARGUEably the Best Burgers',
      type: 'DOCU',
      img: 'https://customer-fyh68ijrcuys7ag8.cloudflarestream.com/9d3d0efed36b71e5f75c7b5e218809d7/thumbnails/thumbnail.jpg',
    },
  ],
};

// Demo Creators Map
export const DEMO_CREATORS: Record<string, Creator> = {
  joeguidry: DEMO_JOEGUIDRY,
  cloaqstudios: DEMO_CLOAQ,
  joshuaargue: DEMO_JOSHUA_ARGUE,
  blackawesomeness: DEMO_BLACK_AWESOMENESS,
};

// Demo Series Data
export interface Series {
  id: string;
  title: string;
  creator_id: string;
  cover: string;
  episodeCount: number;
  description?: string;
}

export const DEMO_SERIES: Series[] = [
  {
    id: 'best-burgers',
    title: 'The Best Burgers',
    creator_id: 'joshuaargue',
    cover: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
    episodeCount: 1,
    description: 'Arguably the best burgers documentary',
  },
  {
    id: 'dark-room',
    title: 'Dark Room',
    creator_id: 'joeguidry',
    cover: '/assets/covers/dark-room.png',
    episodeCount: 1,
    description: 'A thrilling mystery series',
  },
  {
    id: 'origins',
    title: 'Origins',
    creator_id: 'cloaqstudios',
    cover: '/assets/covers/origins.png',
    episodeCount: 1,
    description: 'The beginning of everything',
  },
];

