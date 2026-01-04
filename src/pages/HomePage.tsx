import { useState, useMemo } from 'react';
import { ChevronRight, Play } from 'lucide-react';
import { VideoHero } from '../components/features/VideoHero';
import { ProjectCard } from '../components/cards/ProjectCard';
import { CreatorAvatar } from '../components/cards/CreatorAvatar';
import { ContinueWatchingCard } from '../components/cards/ContinueWatchingCard';
import { getAllProjects } from '../utils/helpers';
import type { Creator, Project } from '../utils/types';
import { DEMO_FEED } from '../data/demoSeed';
import type { Show } from '../utils/types';

interface HomePageProps {
  creators: Record<string, Creator>;
  onViewProfile: (id: string) => void;
  onShowSelect?: (showId: string) => void;
}

export const HomePage = ({ creators, onViewProfile, onShowSelect }: HomePageProps) => {
  // VIBE comments enabled by default for featured video
  const [danmakuOn, setDanmakuOn] = useState(true);
  const [filter, setFilter] = useState('For You');
  const allProjects = getAllProjects(creators);
  
  // ✅ FILTER: Only show videos that have actual video URLs (live/available videos)
  // ✅ PRIORITY: Show videos with Cloudflare Stream data first
  const availableVideos = useMemo(() => {
    const filtered = DEMO_FEED.filter((show: any) => {
      // Include if it has video_url OR cloudflare data
      const hasVideoUrl = show.video_url && typeof show.video_url === 'string' && show.video_url.trim() !== '';
      const hasCloudflare = show.cloudflare?.readyToStream || show.readyToStream;
      return hasVideoUrl || hasCloudflare;
    });
    
    // Debug: Log what videos we're showing
    if (typeof window !== 'undefined') {
      console.log('[HomePage] Available videos:', filtered.map((s: any) => ({
        id: s.id,
        title: s.title,
        hasCloudflare: !!s.cloudflare,
        thumbnail: s.cloudflare?.thumbnail || s.thumbnail,
        readyToStream: s.cloudflare?.readyToStream || s.readyToStream,
      })));
    }
    
    return filtered;
  }, []);
  
  // Continue Watching: Videos with progress > 0 (simulated - in real app, this comes from user data)
  const continueWatchingVideos = useMemo(() => {
    return availableVideos.slice(0, 4); // Show up to 4 videos
  }, [availableVideos]);
  
  // Director Originals: All available videos (excluding the featured hero video)
  const directorOriginals = useMemo(() => {
    return availableVideos.filter((show: any) => 
      show.id !== 'cf_9d3d0efed36b71e5f75c7b5e218809d7' // Exclude featured hero video
    );
  }, [availableVideos]);

  // Prioritize demo creators (Joe Guidry, Joshua Argue) for guest mode
  const isGuest = typeof window !== 'undefined' && localStorage.getItem('vertikal_is_guest') === 'true';

  const displayCreators =
    filter === 'Networks'
      ? Object.entries(creators).filter(([, v]) => v.type === 'network')
      : Object.entries(creators).filter(([, v]) => v.type === 'creator');

  // Sort creators to prioritize Joe Guidry and Joshua Argue for guests
  const sortedCreators = isGuest
    ? [...displayCreators].sort(([a], [b]) => {
        if (a === 'joeguidry') return -1;
        if (b === 'joeguidry') return 1;
        if (a === 'joshuaargue') return -1;
        if (b === 'joshuaargue') return 1;
        return 0;
      })
    : displayCreators;

  const creatorAvatars = (
    <>
      <CreatorAvatar isAddButton />
      {sortedCreators.slice(0, 10).map(([key, creator]) => (
        <CreatorAvatar
          key={key}
          creator={creator}
          onClick={() => onViewProfile(key)}
        />
      ))}
    </>
  );

  return (
    <div className="pb-24 animate-fade overflow-y-auto h-full no-scrollbar relative">
      <VideoHero
        danmakuOn={danmakuOn}
        setDanmakuOn={setDanmakuOn}
        filter={filter}
        setFilter={setFilter}
        onPlay={() => console.log('Play clicked')}
        creatorAvatars={creatorAvatars}
      />

      {/* Continue Watching - Only videos with actual video URLs */}
      {continueWatchingVideos.length > 0 && (
        <div className="mt-8 px-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold">Continue Watching</h2>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar">
            {continueWatchingVideos.map((show: any) => {
              const episode = show.episode && show.season 
                ? `S${show.season}:E${show.episode}` 
                : show.series || 'Episode';
              const duration = show.duration ? Math.round(show.duration / 60) : 0;
              // Simulate progress (in real app, this comes from user data)
              const progress = Math.floor(Math.random() * 80) + 10; // 10-90% progress
              const timeLeft = duration > 0 ? `${Math.max(1, Math.round(duration * (1 - progress / 100)))}m left` : '';
              
              // ✅ Use Cloudflare thumbnail if available
              const thumbnail = show.cloudflare?.thumbnail || show.thumbnail;
              return (
                <ContinueWatchingCard
                  key={show.id}
                  title={show.title}
                  episode={episode}
                  timeLeft={timeLeft}
                  progress={progress}
                  thumbnail={thumbnail}
                  onClick={() => {
                    onShowSelect?.(show.id);
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Director Originals - Only videos with actual video URLs */}
      {directorOriginals.length > 0 && (
        <div className="mt-8 px-4 mb-20">
          <h2 className="text-lg font-bold mb-3">Director Originals</h2>
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {directorOriginals.map((show: any) => {
              // ✅ Use Cloudflare thumbnail if available
              const thumbnail = show.cloudflare?.thumbnail || show.thumbnail;
              // Convert Show to Project format for ProjectCard
              const project: Project = {
                title: show.title,
                type: show.series ? 'SERIES' : 'DOCU',
                img: thumbnail,
              };
              return (
                <ProjectCard 
                  key={show.id} 
                  project={project}
                  onClick={() => {
                    onShowSelect?.(show.id);
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};


