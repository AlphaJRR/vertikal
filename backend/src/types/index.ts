// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// User Types
export interface UserProfile {
  id: string;
  username: string;
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

// Content Types
export interface ShowData {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  genre: string;
  creator: {
    displayName: string;
    avatarUrl?: string;
    type: string;
  };
}

export interface EpisodeData {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  views: number;
}

// Comment Types (Vibe Mode)
export interface CommentData {
  id: string;
  content: string;
  timestamp?: number; // For Danmaku
  isDanmaku: boolean;
  user: {
    username: string;
    avatarUrl?: string;
  };
  createdAt: Date;
}

