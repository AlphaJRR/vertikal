// 1. REAL ASSETS
const IMG_HERO = "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800"; 
const IMG_BASES = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800"; 
const IMG_BURGERS = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800";
const IMG_NATURE = "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800";

// 2. THE VIP LIST
const VIPS = [
  { id: 'BAF', name: 'Black Awesomeness', type: 'network' as const, avatar: 'https://www.dropbox.com/scl/fi/7deqzj0fkqr4my6cgi9ik/Image-2.jpg?rlkey=szrgy5uqh14m7k8k3lvvu5fic&st=a6f8yfx0&raw=1', role: 'Production Network', isFounding50: true },
  { id: 'Alpha', name: 'Alpha Visuals', type: 'network' as const, avatar: 'https://www.dropbox.com/scl/fi/4edlkaew0pq5xwjgc63p1/IMG_2737.JPG?rlkey=edr0wep6sp31g7k10dwoub76s&st=yhl5i0lp&raw=1', role: 'Production Network', isFounding50: true },
  { id: 'joshuaargue', name: 'Joshua Argue', type: 'creator' as const, avatar: 'https://www.dropbox.com/scl/fi/vaudy76mhaqtcukpkzeve/JoshuaArgue.JPG?rlkey=is2eixyxhseij6jft5k91zm9k&st=0mp4lgv9&raw=1', role: 'Showrunner', isFounding50: true },
  { id: 'joshuaroberts', name: 'J.R.R. Roberts', type: 'creator' as const, avatar: 'https://www.dropbox.com/scl/fi/v77iz4i895pqmlmzvqhsk/JoshuaRoberts.JPG?rlkey=4bag3kp7ud5y8w8ibi8s3lfa2&st=04hrxb2c&raw=1', role: 'Founder', isFounding50: true },
  { id: 'kelmitchell', name: 'Kel Mitchell', type: 'creator' as const, avatar: 'https://www.dropbox.com/scl/fi/ipg6ev6ku0ylgr2jnjg46/Image.jpg?rlkey=lcebirpcgnbtlduq2zncxotfq&st=zm8l3hfq&raw=1', role: 'Founding Ambassador', isFounding50: true },
];

interface Creator {
  id: string;
  name: string;
  type: 'network' | 'creator';
  avatar: string;
  role: string;
  isFounding50: boolean;
}

interface Project {
  id: string;
  title: string;
  type: string;
  img: string;
  progress: number;
  sub: string;
}

const AVATAR_POOL = [IMG_HERO, IMG_BASES, IMG_BURGERS, IMG_NATURE];

const generateArmy = (count: number): Creator[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `creator_${i}`,
    name: `Creator ${i + 6}`,
    type: i % 10 === 0 ? 'network' as const : 'creator' as const,
    avatar: AVATAR_POOL[i % AVATAR_POOL.length],
    role: 'Creator',
    isFounding50: false,
  }));
};

export const CREATORS_FULL: Creator[] = [...VIPS, ...generateArmy(195)];

export const PROJECTS_FULL: Project[] = [
    { id: '1', title: 'Beyond the Bases', type: 'SERIES', img: IMG_BASES, progress: 0.9, sub: 'S1:E4 • Finale' },
    { id: '2', title: 'The Best Burgers', type: 'DOCU', img: IMG_BURGERS, progress: 0.4, sub: 'Ep 2 • Chicago' },
    { id: '3', title: 'The Darkroom', type: 'SERIES', img: IMG_HERO, progress: 0, sub: 'New Release' },
    { id: '4', title: 'Lost in LA', type: 'DOCU', img: IMG_NATURE, progress: 0.1, sub: 'Ep 1 • Pilot' },
];
