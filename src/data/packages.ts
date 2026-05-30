/**
 * Service Packages Data
 * Available production packages for booking
 */

export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  deposit: number;
  duration: string;
  features: string[];
  popular?: boolean;
}

export const packages: Package[] = [
  {
    id: 'short-form',
    name: 'Short-Form Content',
    description: '3 social media reels + BTS content',
    price: 1500,
    deposit: 500,
    duration: '2-3 hours',
    features: [
      '3 edited reels',
      'Raw footage',
      'Music licensing',
      '2 revisions',
    ],
  },
  {
    id: 'event-coverage',
    name: 'Event Coverage',
    description: 'Full event documentation',
    price: 3000,
    deposit: 1000,
    duration: '4-6 hours',
    features: [
      '4-6 hour coverage',
      'Highlight reel',
      'Full edit option',
      'Same-day cuts',
    ],
    popular: true,
  },
  {
    id: 'commercial',
    name: 'Commercial Production',
    description: 'Full-service brand commercial',
    price: 7500,
    deposit: 2500,
    duration: 'Full day',
    features: [
      'Pre-production',
      'Full crew',
      '4K delivery',
      'Unlimited revisions',
      'Usage rights',
    ],
  },
  {
    id: 'music-video',
    name: 'Music Video',
    description: 'Professional music video production',
    price: 5000,
    deposit: 2000,
    duration: 'Full day',
    features: [
      'Concept development',
      'Full production',
      'Color grading',
      '3 revisions',
      'Final delivery',
    ],
  },
  {
    id: 'documentary',
    name: 'Documentary',
    description: 'Documentary filmmaking',
    price: 10000,
    deposit: 3500,
    duration: 'Multi-day',
    features: [
      'Pre-production planning',
      'Interview setup',
      'B-roll coverage',
      'Narrative editing',
      'Color correction',
    ],
  },
];

// Helper functions
export const getPackageById = (id: string): Package | undefined => {
  return packages.find(pkg => pkg.id === id);
};

export const getPopularPackages = (): Package[] => {
  return packages.filter(pkg => pkg.popular);
};
