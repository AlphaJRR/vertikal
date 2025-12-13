// types/index.ts - Backend-aligned types

// ============================================
// BACKEND API RESPONSE TYPES (Matches backend/src/types/index.ts)
// ============================================

export enum Role {
  USER = 'USER',
  CREATOR = 'CREATOR',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum ProfileType {
  VIEWER = 'VIEWER',
  CREATOR = 'CREATOR',
  NETWORK = 'NETWORK',
}

export enum ProjectType {
  SERIES = 'SERIES',
  DOCU = 'DOCU',
  SHORT = 'SHORT',
  FILM = 'FILM',
}

// Backend API response format (matches backendClient.ts UserProfile)
export interface UserProfile {
  id: string;
  username: string;        // Backend uses "username"
  email: string;
  coinBalance: number;
  profile?: {
    displayName: string;
    bio?: string;
    avatarUrl?: string;
    type: 'VIEWER' | 'CREATOR' | 'NETWORK';
    isFounding50: boolean;
    followerCount: number;
    totalViews: number;
  };
}

// Backend API response format (matches backendClient.ts ShowData)
export interface ShowData {
  id: string;
  title: string;
  description: string;
  coverImage: string;      // Backend uses "coverImage"
  genre: string;
  creator: {
    displayName: string;
    avatarUrl?: string;
    type: string;
  };
}

// DTO format (what Prisma returns, flattened for easier transformation)
export interface UserDTO {
  id: string;
  email: string;
  username: string;
  avatar: string | null;
  role: Role;
  isFounding50: boolean;
  bio: string | null;
  coins: number;
  createdAt: string;
  projects?: ProjectDTO[];
}

export interface ProjectDTO {
  id: string;
  title: string;
  type: ProjectType;
  coverImage: string;
  videoUrl: string | null;
  progress: number;
  subTitle: string | null;
  creatorId: string;
  creator?: UserDTO;
  createdAt: string;
}

// ============================================
// MOBILE APP TYPES (UI-Friendly)
// ============================================

export interface Creator {
  id: string;
  name: string;            // Transformed from username
  avatar: string;
  role: 'USER' | 'CREATOR' | 'NETWORK';
  company?: string;        // Derived from role
  isFounding50: boolean;
  bio: string;
  coins: number;
  stats: {
    fans: string;          // Computed/mocked for now
    series: string;        // Count of projects
    views?: string;        // Computed/mocked
  };
  projects: Project[];
  type: 'creator' | 'network'; // UI display logic
}

export interface Project {
  id: string;
  title: string;
  type: string;            // SERIES, DOCU, etc.
  img: string;             // Transformed from coverImage
  videoUrl?: string;
  progress?: number;       // 0-1
  subTitle?: string;
  creatorName?: string;
  creatorAvatar?: string;
}

// ============================================
// TRANSFORMERS (Backend API Response → Mobile UI)
// ============================================

/**
 * Transform UserProfile (backend API format) to Creator (mobile UI format)
 */
export const transformUserProfile = (user: UserProfile): Creator => {
  const followerCount = user.profile?.followerCount || 0;
  const displayName = user.profile?.displayName || user.username;
  const profileType = user.profile?.type || 'VIEWER';
  
  return {
    id: user.id,
    name: displayName,    // ✅ displayName or username → name
    avatar: user.profile?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.username,
    role: profileType as 'USER' | 'CREATOR' | 'NETWORK',
    company: profileType === 'NETWORK' ? displayName : undefined,
    isFounding50: user.profile?.isFounding50 || false,
    bio: user.profile?.bio || '',
    coins: user.coinBalance,
    stats: {
      fans: formatNumber(followerCount),
      series: '0', // Would need separate API call to get project count
      views: user.profile?.totalViews ? formatNumber(user.profile.totalViews) : undefined,
    },
    projects: [], // Projects fetched separately
    type: profileType === 'NETWORK' ? 'network' : 'creator',
  };
};

/**
 * Transform UserDTO (Prisma format) to Creator (mobile UI format)
 * Note: UserDTO from backend includes projects array from profile.shows
 */
export const transformUserDTO = (dto: UserDTO): Creator => {
  // Calculate followerCount from projects (if available) or use coins as fallback
  // In a real app, followerCount would come from the profile relation
  const followerCount = dto.projects?.length * 10 || dto.coins * 10; // Mock calculation
  
  return {
    id: dto.id,
    name: dto.username,    // username → name
    avatar: dto.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + dto.username,
    role: dto.role as 'USER' | 'CREATOR' | 'NETWORK',
    company: dto.role === Role.NETWORK ? dto.username : undefined,
    isFounding50: dto.isFounding50,
    bio: dto.bio || '',
    coins: dto.coins,
    stats: {
      fans: formatNumber(followerCount), // ✅ Use calculated followerCount
      series: dto.projects?.length.toString() || '0',
      views: dto.projects ? formatViews(dto.projects) : undefined,
    },
    projects: dto.projects?.map(transformProjectDTO) || [],
    type: dto.role === Role.NETWORK ? 'network' : 'creator',
  };
};

/**
 * Transform ShowData (backend API format) to Project (mobile UI format)
 */
export const transformShowData = (show: ShowData): Project => {
  return {
    id: show.id,
    title: show.title,
    type: show.genre || 'SERIES',
    img: show.coverImage,   // ✅ coverImage → img
    progress: undefined,   // Not in ShowData
    subTitle: show.description || undefined,
    creatorName: show.creator?.displayName,
    creatorAvatar: show.creator?.avatarUrl,
  };
};

/**
 * Transform ProjectDTO (Prisma format) to Project (mobile UI format)
 */
export const transformProjectDTO = (dto: ProjectDTO): Project => {
  return {
    id: dto.id,
    title: dto.title,
    type: dto.type,
    img: dto.coverImage,   // ✅ coverImage → img
    videoUrl: dto.videoUrl || undefined,
    progress: dto.progress,
    subTitle: dto.subTitle || undefined,
    creatorName: dto.creator?.username,
    creatorAvatar: dto.creator?.avatar || undefined,
  };
};

// Legacy aliases for backward compatibility
export const transformUser = transformUserDTO;
export const transformProject = transformProjectDTO;

// ============================================
// HELPER FUNCTIONS
// ============================================

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
};

const formatViews = (projects: ProjectDTO[]): string => {
  const total = projects.reduce((sum, p) => sum + (p.progress * 100000), 0);
  return formatNumber(Math.floor(total));
};

