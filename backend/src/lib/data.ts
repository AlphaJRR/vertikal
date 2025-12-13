// Client-side data generation (for mobile app mock data)
// This matches the seed script logic for consistency

const ROLES = ['Director', 'Showrunner', 'DP', 'Editor', 'Colorist', 'Sound', 'Writer'];
const NETWORKS = ['Black Awesomeness', 'Alpha Visuals', 'Cloaq', 'Hulu Vertical', 'Netflix Next'];
const GENRES = ['Drama', 'Docu', 'Comedy', 'Sci-Fi', 'Thriller'];

// High-Res Unsplash Images
const IMAGES = [
  "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800",
  "https://images.unsplash.com/photo-1533518463841-d62e1fc91373?q=80&w=800",
  "https://images.unsplash.com/photo-1515634918668-6195e8f25878?q=80&w=800",
  "https://images.unsplash.com/photo-1506157786151-b8491531f43b?q=80&w=800",
  "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800",
];

const CREATOR_NAMES = [
  'Joshua Argue', 'Kel Mitchell', 'J.R. Roberts', 'Nate Hosseini', 'Sarah Jones',
  'Michael Chen', 'Jessica Williams', 'David Park', 'Emma Thompson', 'Alex Rivera',
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

export const generateCreators = (count: number): Creator[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `creator_${i}`,
    name: i < CREATOR_NAMES.length ? CREATOR_NAMES[i] : `Creator ${i + 1}`,
    type: i < 10 ? 'network' : 'creator',
    avatar: IMAGES[i % IMAGES.length],
    role: i < 10 ? 'Production Network' : ROLES[Math.floor(Math.random() * ROLES.length)],
    isFounding50: i < 50,
  }));
};

export const generateProjects = (count: number): Project[] => {
  const showTitles = [
    'Beyond the Bases', 'Midnight Run', 'The Last Echo', 'Chicago Nights',
    'Vertical Dreams', 'Street Stories', 'Urban Legends', 'City Lights',
  ];

  return Array.from({ length: count }).map((_, i) => ({
    id: `proj_${i}`,
    title: i < showTitles.length ? showTitles[i] : `Project Vertikal ${i + 1}`,
    type: GENRES[Math.floor(Math.random() * GENRES.length)],
    img: IMAGES[(i + 5) % IMAGES.length],
    progress: Math.random(),
    sub: `S1:E${Math.floor(Math.random() * 10) + 1} • ${Math.floor(Math.random() * 20)}m left`,
  }));
};

// Export the massive lists (matching seed script output)
export const CREATORS_FULL = generateCreators(200);
export const PROJECTS_FULL = generateProjects(100);

