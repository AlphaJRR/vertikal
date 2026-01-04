import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { triggerHaptic } from '../../utils/helpers';

interface Episode {
  id: string;
  title: string;
  thumbnail: string;
  episode: number;
  season: number;
  locked?: boolean;
}

interface EpisodeCarouselProps {
  episodes: Episode[];
  currentEpisodeId: string;
  onEpisodeSelect: (episodeId: string) => void;
}

export const EpisodeCarousel = ({
  episodes,
  currentEpisodeId,
  onEpisodeSelect,
}: EpisodeCarouselProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const scrollAmount = 300;
    const newPosition =
      direction === 'left'
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;
    setScrollPosition(newPosition);
    containerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
    triggerHaptic('light');
  };

  if (episodes.length <= 1) return null;

  return (
    <div className="bg-[#0F172A] border-b border-gray-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Episodes</h3>
        <div className="text-xs text-gray-400">
          {episodes.findIndex(e => e.id === currentEpisodeId) + 1} / {episodes.length}
        </div>
      </div>

      <div className="relative">
        {/* Scroll Buttons */}
        {scrollPosition > 0 && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        )}

        {/* Episodes Container */}
        <div
          ref={containerRef}
          className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth"
          style={{ scrollLeft: scrollPosition }}
        >
          {episodes.map(episode => {
            const isActive = episode.id === currentEpisodeId;
            return (
              <button
                key={episode.id}
                onClick={() => {
                  if (!episode.locked) {
                    onEpisodeSelect(episode.id);
                    triggerHaptic('medium');
                  }
                }}
                disabled={episode.locked}
                className={`flex-shrink-0 w-32 relative rounded-lg overflow-hidden transition-all ${
                  isActive
                    ? 'ring-2 ring-white scale-105'
                    : 'opacity-70 hover:opacity-100'
                } ${episode.locked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <img
                  src={episode.thumbnail}
                  alt={episode.title}
                  className="w-full h-20 object-cover"
                />
                {episode.locked && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                  <div className="text-xs font-bold text-white">Ep {episode.episode}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Scroll Button */}
        {containerRef.current &&
          scrollPosition <
            (containerRef.current.scrollWidth - containerRef.current.clientWidth - 50) && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          )}
      </div>
    </div>
  );
};

