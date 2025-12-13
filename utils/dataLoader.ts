/**
 * Data Loader Utility
 * Loads founding50.json and more_shows.json for VERTIKAL brand UI
 */

// Import JSON data (TypeScript will handle this if resolveJsonModule is enabled)
// For React Native, we'll use require for JSON files
const founding50Data = require('../founding50.json');
const moreShowsData = require('../more_shows.json');

export interface Founding50Creator {
  id: string;
  name: string;
  type: 'network' | 'creator';
  avatar: string;
  role: string;
  isFounding50: boolean;
  bio?: string;
  stats?: {
    fans: string;
    series: string;
    views?: string;
  };
}

export interface ShowData {
  id: string;
  title: string;
  type: string;
  img: string;
  coverImage: string;
  videoUrl: string | null;
  progress: number;
  subTitle: string;
  description: string;
  genre: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  createdAt: string;
}

/**
 * Get all Founding 50 creators/networks
 */
export function getFounding50Creators(): Founding50Creator[] {
  return founding50Data.creators || [];
}

/**
 * Get all shows/projects
 */
export function getShows(): ShowData[] {
  return moreShowsData.shows || [];
}

/**
 * Get shows by creator ID
 */
export function getShowsByCreator(creatorId: string): ShowData[] {
  const shows = moreShowsData.shows || [];
  return shows.filter((show: ShowData) => show.creatorId === creatorId);
}

/**
 * Get creator by ID
 */
export function getCreatorById(id: string): Founding50Creator | undefined {
  const creators = founding50Data.creators || [];
  return creators.find((creator: Founding50Creator) => creator.id === id);
}

