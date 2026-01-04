import { useState, useEffect, useRef } from 'react';
import { VerticalFrame } from '../components/feed/VerticalFrame';
import { VerticalVideoPlayer } from '../components/feed/VerticalVideoPlayer';
import { ShowMetaOverlay } from '../components/feed/ShowMetaOverlay';
import { ActionBar } from '../components/feed/ActionBar';
import { DanmakuOverlay } from '../components/features/DanmakuOverlay';
import { VibeOverlay } from '../components/features/VibeOverlay';
import moreShowsData from '../data/more_shows.json';
import founding50Data from '../data/founding50.json';
import { DEMO_FEED, DEMO_CREATORS } from '../data/demoSeed';
import type { Creator } from '../utils/types';

// Import MOCK_CREATORS as fallback (will be replaced with proper data loading)
const MOCK_CREATORS_FALLBACK: Record<string, Creator> = {
  'joshuaroberts': {
    id: 'joshuaroberts',
    name: 'J.R.R. Roberts',
    role: 'Founder',
    company: 'Vertikal',
    avatar: 'https://www.dropbox.com/scl/fi/v77iz4i895pqmlmzvqhsk/JoshuaRoberts.JPG?rlkey=4bag3kp7ud5y8w8ibi8s3lfa2&st=04hrxb2c&raw=1',
    bio: 'Building the Vertical Film Network.',
    stats: { fans: '28k', series: '4' },
    type: 'creator',
    isFounding50: true,
    projects: [],
  },
  'joshuaargue': {
    id: 'joshuaargue',
    name: 'Joshua Argue',
    role: 'Creator / Lead',
    company: 'Black Awesomeness',
    avatar: 'https://www.dropbox.com/scl/fi/vaudy76mhaqtcukpkzeve/JoshuaArgue.JPG?rlkey=is2eixyxhseij6jft5k91zm9k&st=0mp4lgv9&raw=1',
    bio: 'Showrunner. Creating @BestBurgers.',
    stats: { fans: '42.5k', series: '8' },
    type: 'creator',
    isFounding50: true,
    projects: [],
  },
  'joeguridy': {
    id: 'joeguridy',
    name: 'Joe Guridy',
    role: 'Producer',
    company: 'Cloaq Productions',
    avatar: 'https://www.dropbox.com/scl/fi/dgf6xyzfvq5hl2kj093cq/Image-1.jpg?rlkey=c2por9s72xsafnng0dp9azex5&st=qgogul20&raw=1',
    bio: 'Production Management.',
    stats: { fans: '3k', series: '1' },
    type: 'creator',
    isFounding50: true,
    projects: [],
  },
  'kelmitchell': {
    id: 'kelmitchell',
    name: 'Kel Mitchell',
    role: 'Founding Ambassador',
    company: 'Vertikal',
    avatar: 'https://www.dropbox.com/scl/fi/ipg6ev6ku0ylgr2jnjg46/Image.jpg?rlkey=lcebirpcgnbtlduq2zncxotfq&st=zm8l3hfq&raw=1',
    bio: 'Talent/EP. Vertikal Original: The Lab.',
    stats: { fans: '1.2M', series: '1' },
    type: 'creator',
    isFounding50: true,
    projects: [],
  },
};

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
}

interface ShowWithCreator extends Show {
  creator?: Creator;
}

export const FeedPage = ({ onShowDetail }: { onShowDetail: (showId: string) => void }) => {
  const [shows, setShows] = useState<ShowWithCreator[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [vibeActive, setVibeActive] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user is guest or if API returns empty
    const isGuest = typeof window !== 'undefined' && localStorage.getItem('vertikal_is_guest') === 'true';
    
    // Load shows and merge with creator data
    let showsList = (moreShowsData as { shows: Show[] }).shows || [];
    let creators = (founding50Data as { creators: Creator[] }).creators || [];

    // ALWAYS use demo seed for guests, or if empty
    if (isGuest || showsList.length === 0) {
      showsList = DEMO_FEED as Show[];
      creators = Object.values(DEMO_CREATORS);
    }

    // Create creator map using Object.fromEntries as specified
    const allCreators = creators.length > 0 ? creators : Object.values(MOCK_CREATORS_FALLBACK);
    const creatorMap = Object.fromEntries(allCreators.map(c => [c.id, c]));

    // Merge shows with creators
    const showsWithCreators: ShowWithCreator[] = showsList.map(show => ({
      ...show,
      creator: creatorMap[show.creator_id] || undefined,
    }));

    // Sort by published_at descending (newest first)
    showsWithCreators.sort((a, b) => {
      const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
      const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
      return dateB - dateA;
    });

    setShows(showsWithCreators);

    // Auto-enable VIBE comments for Dark Room and Best Burgers
    const vibeShows = showsWithCreators.filter(
      s => s.series === 'Dark Room' || s.series === 'The Best Burgers' || s.title?.includes('Best Burgers')
    );
    const initialVibeState: Record<string, boolean> = {};
    vibeShows.forEach(show => {
      initialVibeState[show.id] = true;
    });
    setVibeActive(initialVibeState);
  }, []);

  // Intersection Observer for auto-play
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setActiveIndex(index);
            console.log(`[AUTOPLAY] Show ${index} entered viewport`);
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '0px',
      }
    );

    const frames = containerRef.current.querySelectorAll('[data-index]');
    frames.forEach(frame => observer.observe(frame));

    return () => {
      frames.forEach(frame => observer.unobserve(frame));
    };
  }, [shows]);

  const handleVibeToggle = (showId: string, active: boolean) => {
    setVibeActive(prev => ({
      ...prev,
      [showId]: active,
    }));
  };

  if (shows.length === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-2">No shows available</div>
          <div className="text-gray-600 text-sm">Check back later for new content</div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black no-scrollbar"
    >
      {shows.map((show, index) => (
        <div key={show.id} data-index={index} className="snap-start snap-mandatory">
          <VerticalFrame>
            <VerticalVideoPlayer
              videoUrl={show.video_url}
              thumbnail={show.thumbnail}
              autoplay={activeIndex === index}
              onPlay={() => console.log(`[MOCK] Playing show: ${show.title}`)}
            />

            {/* VIBE Comments Overlay - Auto-enabled for Dark Room/Best Burgers, or when manually toggled */}
            {(vibeActive[show.id] || show.series === 'Dark Room' || show.series === 'The Best Burgers' || show.title?.includes('Best Burgers') || show.title?.includes('ARGUEably')) && (
              <DanmakuOverlay 
                active={true}
                vibeThreadId={(show as any).vibeThreadId}
                vibePreset={(show as any).vibePreset}
              />
            )}
            
            {/* VIBE™ LIVE Overlay for Dark Room and The Best Burgers - ALWAYS VISIBLE */}
            {(show.series === 'Dark Room' || show.series === 'The Best Burgers' || show.title?.includes('Best Burgers')) && <VibeOverlay />}

            {/* Show Metadata */}
            <ShowMetaOverlay
              title={show.title}
              series={show.series}
              creatorName={show.creator?.name || 'Unknown Creator'}
              tags={show.tags}
              onViewDetails={() => onShowDetail(show.id)}
            />

            {/* Action Bar */}
            <ActionBar
              showId={show.id}
              creatorId={show.creator_id}
              likes={show.likes || 0}
              comments={0}
              onLike={() => console.log(`[MOCK] Liked show: ${show.id}`)}
              onComment={() => console.log(`[MOCK] Comment on show: ${show.id}`)}
              onTip={() => console.log(`[MOCK] Tip creator: ${show.creator_id}`)}
              onShare={() => console.log(`[MOCK] Share show: ${show.id}`)}
              onVibeToggle={active => handleVibeToggle(show.id, active)}
            />
          </VerticalFrame>
        </div>
      ))}
    </div>
  );
};

