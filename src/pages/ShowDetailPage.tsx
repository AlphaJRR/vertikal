import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ShowPlayer } from '../components/show/ShowPlayer';
import { ShowInfo } from '../components/show/ShowInfo';
import { Comments } from '../components/show/Comments';
import { EpisodeCarousel } from '../components/show/EpisodeCarousel';
import { RelatedShows } from '../components/show/RelatedShows';
import { triggerHaptic } from '../utils/helpers';
import moreShowsData from '../data/more_shows.json';
import commentsData from '../data/comments.json';
import founding50Data from '../data/founding50.json';
import type { Creator } from '../utils/types';

interface Show {
  id: string;
  title: string;
  series?: string;
  creator_id: string;
  creator_avatar?: string;
  creator_handle?: string;
  thumbnail: string;
  video_url?: string;
  tags?: string[];
  duration?: number;
  duration_seconds?: number;
  views?: number;
  likes?: number;
  published_at?: string;
  episode?: number;
  season?: number;
}

interface Comment {
  id: string;
  show_id: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
}

interface ShowDetailPageProps {
  showId: string;
  onBack: () => void;
  onShowSelect?: (showId: string) => void;
  onCreatorSelect?: (creatorId: string) => void;
}

export const ShowDetailPage = ({
  showId,
  onBack,
  onShowSelect,
  onCreatorSelect,
}: ShowDetailPageProps) => {
  const [show, setShow] = useState<Show | null>(null);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [relatedShows, setRelatedShows] = useState<Show[]>([]);
  const [activeTab, setActiveTab] = useState<'comments' | 'related'>('comments');
  const [currentEpisodeId, setCurrentEpisodeId] = useState<string>(showId);

  // Load show data
  useEffect(() => {
    const showsList = (moreShowsData as { shows: Show[] }).shows || [];
    const foundShow = showsList.find(s => s.id === showId);

    if (foundShow) {
      setShow(foundShow);
      setCurrentEpisodeId(foundShow.id);

      // Load creator data
      const creators = (founding50Data as { creators: Creator[] }).creators || [];
      const foundCreator = creators.find(c => c.id === foundShow.creator_id);
      if (foundCreator) {
        setCreator(foundCreator);
      }

      // Load comments for this show
      const allComments = (commentsData as { comments: Comment[] }).comments || [];
      const showComments = allComments.filter(c => c.show_id === showId);
      setComments(showComments);

      // Find related shows (tag-based matching)
      const related = showsList
        .filter(s => {
          if (s.id === showId) return false;
          if (!foundShow.tags || !s.tags) return false;
          return foundShow.tags.some(tag => s.tags?.includes(tag));
        })
        .slice(0, 6); // Top 6 related shows
      setRelatedShows(related);
    }
  }, [showId]);

  // Create episodes array (for now, single episode shows)
  const episodes = show
    ? [
        {
          id: show.id,
          title: show.title,
          thumbnail: show.thumbnail,
          episode: show.episode || 1,
          season: show.season || 1,
          locked: false,
        },
      ]
    : [];

  const handleCreatorTap = () => {
    if (show?.creator_id) {
      triggerHaptic('medium');
      onCreatorSelect?.(show.creator_id);
    }
  };

  const handleEpisodeSelect = (episodeId: string) => {
    setCurrentEpisodeId(episodeId);
    // In a real app, this would load the new episode
    console.log(`[MOCK] Episode selected: ${episodeId}`);
  };

  const handleCommentSubmit = (text: string) => {
    // Mock: Add comment to local state
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      show_id: showId,
      username: 'You',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
      text,
      timestamp: new Date().toISOString(),
      likes: 0,
    };
    setComments(prev => [newComment, ...prev]);
    console.log(`[ANALYTICS] comment_submit:`, {
      show_id: showId,
      user_id: 'current_user',
    });
  };

  const handleSubscribe = () => {
    triggerHaptic('medium');
    console.log(`[MOCK] Subscribe to creator: ${show?.creator_id}`);
  };

  if (!show) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-2">Show not found</p>
          <button
            onClick={onBack}
            className="text-blue-500 hover:text-blue-400 transition"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-black flex flex-col overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5 p-4 flex items-center gap-4 flex-shrink-0">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-full transition active:scale-90"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-lg font-bold text-white flex-1 truncate">{show.title}</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Video Player */}
        <div className="sticky top-0 z-40">
          <ShowPlayer
            videoUrl={show.video_url || show.thumbnail}
            thumbnail={show.thumbnail}
            autoPlay={true}
            loop={false}
            muted={true}
            showId={show.id}
            onPlay={() => console.log(`[ANALYTICS] video_start:`, { show_id: show.id })}
            onPause={() => console.log(`[ANALYTICS] video_pause:`, { show_id: show.id })}
            onComplete={() => {
              console.log(`[ANALYTICS] video_complete:`, { show_id: show.id });
              // Auto-advance to next episode if available
              if (episodes.length > 1) {
                const currentIndex = episodes.findIndex(e => e.id === currentEpisodeId);
                if (currentIndex < episodes.length - 1) {
                  setTimeout(() => {
                    handleEpisodeSelect(episodes[currentIndex + 1].id);
                  }, 3000);
                }
              }
            }}
          />
        </div>

        {/* Show Info */}
        <ShowInfo
          title={show.title}
          series={show.series}
          creatorName={creator?.name || show.creator_id}
          creatorHandle={show.creator_handle || creator?.id}
          creatorAvatar={show.creator_avatar || creator?.avatar}
          tags={show.tags}
          views={show.views}
          likes={show.likes}
          publishedAt={show.published_at}
          onCreatorTap={handleCreatorTap}
          onSubscribe={handleSubscribe}
        />

        {/* Episode Carousel */}
        {episodes.length > 1 && (
          <EpisodeCarousel
            episodes={episodes}
            currentEpisodeId={currentEpisodeId}
            onEpisodeSelect={handleEpisodeSelect}
          />
        )}

        {/* Tabs */}
        <div className="bg-[#0F172A] border-b border-gray-800 flex">
          <button
            onClick={() => {
              setActiveTab('comments');
              triggerHaptic('light');
            }}
            className={`flex-1 py-3 text-sm font-bold transition ${
              activeTab === 'comments'
                ? 'text-white border-b-2 border-white'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Comments
          </button>
          <button
            onClick={() => {
              setActiveTab('related');
              triggerHaptic('light');
            }}
            className={`flex-1 py-3 text-sm font-bold transition ${
              activeTab === 'related'
                ? 'text-white border-b-2 border-white'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Related
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'comments' ? (
          <Comments
            showId={show.id}
            comments={comments}
            onCommentSubmit={handleCommentSubmit}
          />
        ) : (
          <RelatedShows
            shows={relatedShows.map(s => {
              // Find creator for each related show
              const creators = (founding50Data as { creators: Creator[] }).creators || [];
              const relatedCreator = creators.find(c => c.id === s.creator_id);
              return {
                id: s.id,
                title: s.title,
                thumbnail: s.thumbnail,
                creatorName: relatedCreator?.name || s.creator_id,
                views: s.views,
              };
            })}
            onShowSelect={id => {
              onShowSelect?.(id);
            }}
          />
        )}
      </div>
    </div>
  );
};
