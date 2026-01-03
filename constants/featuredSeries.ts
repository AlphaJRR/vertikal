/**
 * Featured Originals - Locked Series Titles
 * TODO: Replace with CMS source before public launch
 * 
 * These are the 3 locked titles from the HIGGLED list.
 * Exact titles and loglines must be preserved.
 */

export interface FeaturedSeries {
  id: string;
  title: string;
  logline: string;
  status: 'IN DEVELOPMENT' | 'PILOT IN PROGRESS';
  creator: string;
  slug: string; // For routing
}

export const FEATURED_ORIGINALS: FeaturedSeries[] = [
  {
    id: 'beyond-the-bases',
    title: 'Beyond the Bases',
    logline: 'A deep dive into America\'s favorite pastime through the lens of vertical cinema.',
    status: 'PILOT IN PROGRESS',
    creator: 'J.R. Roberts',
    slug: 'beyond-the-bases',
  },
  {
    id: 'dark-room',
    title: 'Dark Room',
    logline: 'An intimate exploration of photography and storytelling in vertical format.',
    status: 'IN DEVELOPMENT',
    creator: 'Joe Guidry',
    slug: 'dark-room',
  },
  {
    id: 'argueably-the-best-burgers',
    title: 'Argueably the Best Burgers',
    logline: 'A culinary journey across America\'s burger capitals.',
    status: 'PILOT IN PROGRESS',
    creator: 'Joshua Argue',
    slug: 'argueably-the-best-burgers',
  },
];

