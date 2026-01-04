import { Play } from 'lucide-react';
import { triggerHaptic } from '../../utils/helpers';

interface RelatedShow {
  id: string;
  title: string;
  thumbnail: string;
  creatorName?: string;
  views?: number;
}

interface RelatedShowsProps {
  shows: RelatedShow[];
  onShowSelect: (showId: string) => void;
}

export const RelatedShows = ({ shows, onShowSelect }: RelatedShowsProps) => {
  if (shows.length === 0) return null;

  const formatViews = (count?: number) => {
    if (!count) return '';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M views`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K views`;
    return `${count} views`;
  };

  return (
    <div className="bg-[#0F172A] p-4">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Related Shows</h3>
      <div className="grid grid-cols-2 gap-3">
        {shows.map(show => (
          <button
            key={show.id}
            onClick={() => {
              onShowSelect(show.id);
              triggerHaptic('medium');
            }}
            className="relative rounded-lg overflow-hidden aspect-[9/16] group hover:opacity-90 transition active:scale-95"
          >
            <img
              src={show.thumbnail}
              alt={show.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Play className="w-6 h-6 text-white fill-white ml-1" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h4 className="text-sm font-bold text-white mb-1 line-clamp-2">{show.title}</h4>
              {show.creatorName && (
                <p className="text-xs text-gray-300 mb-1">{show.creatorName}</p>
              )}
              {show.views && (
                <p className="text-xs text-gray-400">{formatViews(show.views)}</p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};


