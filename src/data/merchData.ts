/**
 * Merch Data - AVA Media Apparel Line
 * All items are black/washed black/dark grey oversized tees and hoodies
 */

export interface MerchItem {
  id: string;
  name: string;
  category: 'tee' | 'hoodie';
  color: 'black' | 'washed-black' | 'dark-grey';
  size: string[];
  price: number;
  imageUrl: string;
  oneLiner: string; // The one-liner used on each design
  description: string;
  featured: boolean;
}

export const merchItems: MerchItem[] = [
  {
    id: 'merch-001',
    name: 'Cinematic Oversized Tee',
    category: 'tee',
    color: 'black',
    size: ['S', 'M', 'L', 'XL', 'XXL'],
    price: 45,
    imageUrl: '/assets/merch/tee-black-001.jpg',
    oneLiner: 'Frame the moment',
    description: 'Premium oversized black tee with cinematic design',
    featured: true,
  },
  {
    id: 'merch-002',
    name: 'Storyteller Hoodie',
    category: 'hoodie',
    color: 'washed-black',
    size: ['S', 'M', 'L', 'XL', 'XXL'],
    price: 85,
    imageUrl: '/assets/merch/hoodie-washed-black-001.jpg',
    oneLiner: 'Every frame tells a story',
    description: 'Comfortable oversized washed black hoodie',
    featured: true,
  },
  {
    id: 'merch-003',
    name: 'Director Oversized Tee',
    category: 'tee',
    color: 'dark-grey',
    size: ['S', 'M', 'L', 'XL', 'XXL'],
    price: 45,
    imageUrl: '/assets/merch/tee-dark-grey-001.jpg',
    oneLiner: 'Direct the narrative',
    description: 'Dark grey oversized tee with bold typography',
    featured: false,
  },
  {
    id: 'merch-004',
    name: 'Producer Hoodie',
    category: 'hoodie',
    color: 'black',
    size: ['S', 'M', 'L', 'XL', 'XXL'],
    price: 85,
    imageUrl: '/assets/merch/hoodie-black-001.jpg',
    oneLiner: 'Produce the vision',
    description: 'Classic black oversized hoodie',
    featured: true,
  },
  {
    id: 'merch-005',
    name: 'Creator Oversized Tee',
    category: 'tee',
    color: 'washed-black',
    size: ['S', 'M', 'L', 'XL', 'XXL'],
    price: 45,
    imageUrl: '/assets/merch/tee-washed-black-001.jpg',
    oneLiner: 'Create the culture',
    description: 'Washed black tee with minimalist design',
    featured: false,
  },
  {
    id: 'merch-006',
    name: 'Visionary Hoodie',
    category: 'hoodie',
    color: 'dark-grey',
    size: ['S', 'M', 'L', 'XL', 'XXL'],
    price: 85,
    imageUrl: '/assets/merch/hoodie-dark-grey-001.jpg',
    oneLiner: 'See beyond the frame',
    description: 'Dark grey oversized hoodie',
    featured: false,
  },
];

// Helper functions
export const getFeaturedMerch = (): MerchItem[] => {
  return merchItems.filter(item => item.featured);
};

export const getMerchByCategory = (category: 'tee' | 'hoodie' | 'all'): MerchItem[] => {
  if (category === 'all') {
    return merchItems;
  }
  return merchItems.filter(item => item.category === category);
};

export const getMerchById = (id: string): MerchItem | undefined => {
  return merchItems.find(item => item.id === id);
};

// Export for use in ShopPage
export const getAllMerch = (): MerchItem[] => {
  return merchItems;
};
