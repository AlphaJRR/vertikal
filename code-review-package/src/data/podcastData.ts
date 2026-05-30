/**
 * Centralized data source for AVA Media
 * Contains podcast episodes and video content
 */

export interface PodcastEpisode {
  id: string;
  title: string;
  url: string;
  description: string;
  guestName?: string;
  featured: boolean;
  thumbnail?: string;
  duration?: string;
  publishDate?: string;
}

export interface VideoContent {
  id: string;
  title: string;
  url: string;
  description: string;
  creator?: string;
  featured: boolean;
  thumbnail?: string;
  duration?: string;
  category?: 'podcast' | 'video' | 'behind-scenes' | 'portfolio';
}

// Podcast Episodes Data
export const podcastEpisodes: PodcastEpisode[] = [
  {
    id: 'podcast-001',
    title: 'The Future of Video Production',
    url: 'https://example.com/podcasts/episode-001.mp4',
    description: 'Exploring the latest trends in video production and cinematography.',
    guestName: 'John Director',
    featured: true,
    thumbnail: '/assets/thumbnails/podcast-001.jpg',
    duration: '45:30',
    publishDate: '2024-01-15',
  },
  {
    id: 'podcast-002',
    title: 'Cinematic Storytelling Techniques',
    url: 'https://example.com/podcasts/episode-002.mp4',
    description: 'Deep dive into advanced storytelling methods for filmmakers.',
    guestName: 'Sarah Cinematographer',
    featured: true,
    thumbnail: '/assets/thumbnails/podcast-002.jpg',
    duration: '52:15',
    publishDate: '2024-01-22',
  },
  {
    id: 'podcast-003',
    title: 'Building a Production Company',
    url: 'https://example.com/podcasts/episode-003.mp4',
    description: 'Lessons learned from starting and scaling a video production business.',
    guestName: 'Mike Producer',
    featured: false,
    thumbnail: '/assets/thumbnails/podcast-003.jpg',
    duration: '38:45',
    publishDate: '2024-01-29',
  },
];

// Video Content Data
export const videoContent: VideoContent[] = [
  {
    id: 'video-001',
    title: 'Behind the Scenes: Commercial Shoot',
    url: 'https://example.com/videos/behind-scenes-001.mp4',
    description: 'A look behind the scenes of our latest commercial production.',
    creator: 'AVA Media',
    featured: true,
    thumbnail: '/assets/thumbnails/video-001.jpg',
    duration: '5:30',
    category: 'behind-scenes',
  },
  {
    id: 'video-002',
    title: 'Portfolio Highlight: Music Video',
    url: 'https://example.com/videos/portfolio-001.mp4',
    description: 'Showcasing our latest music video production work.',
    creator: 'AVA Media',
    featured: true,
    thumbnail: '/assets/thumbnails/video-002.jpg',
    duration: '3:45',
    category: 'portfolio',
  },
  {
    id: 'video-003',
    title: 'Client Testimonial: Brand Campaign',
    url: 'https://example.com/videos/testimonial-001.mp4',
    description: 'Hear from our clients about their experience working with AVA Media.',
    creator: 'AVA Media',
    featured: false,
    thumbnail: '/assets/thumbnails/video-003.jpg',
    duration: '2:15',
    category: 'portfolio',
  },
];

// Helper functions
export const getFeaturedPodcasts = (): PodcastEpisode[] => {
  return podcastEpisodes.filter(episode => episode.featured);
};

export const getFeaturedVideos = (): VideoContent[] => {
  return videoContent.filter(video => video.featured);
};

export const getAllPodcasts = (): PodcastEpisode[] => {
  return podcastEpisodes;
};

export const getAllVideos = (): VideoContent[] => {
  return videoContent;
};

export const getPodcastById = (id: string): PodcastEpisode | undefined => {
  return podcastEpisodes.find(episode => episode.id === id);
};

export const getVideoById = (id: string): VideoContent | undefined => {
  return videoContent.find(video => video.id === id);
};
