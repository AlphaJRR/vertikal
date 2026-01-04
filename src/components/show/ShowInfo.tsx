import { User, Plus } from 'lucide-react';
import { triggerHaptic } from '../../utils/helpers';

interface ShowInfoProps {
  title: string;
  series?: string;
  creatorName?: string;
  creatorHandle?: string;
  creatorAvatar?: string;
  tags?: string[];
  views?: number;
  likes?: number;
  publishedAt?: string;
  onCreatorTap?: () => void;
  onSubscribe?: () => void;
}

export const ShowInfo = ({
  title,
  series,
  creatorName,
  creatorHandle,
  creatorAvatar,
  tags = [],
  views = 0,
  likes = 0,
  publishedAt,
  onCreatorTap,
  onSubscribe,
}: ShowInfoProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatViews = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className="bg-[#0F172A] border-b border-gray-800 p-4 space-y-4">
      {/* Title & Series */}
      <div>
        {series && (
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            {series}
          </div>
        )}
        <h1 className="text-2xl font-black text-white leading-tight">{title}</h1>
      </div>

      {/* Creator Attribution */}
      {(creatorName || creatorHandle) && (
        <button
          onClick={() => {
            triggerHaptic('light');
            onCreatorTap?.();
          }}
          className="flex items-center gap-3 w-full hover:opacity-80 transition active:scale-95"
        >
          {creatorAvatar ? (
            <img
              src={creatorAvatar}
              alt={creatorName || 'Creator'}
              className="w-12 h-12 rounded-full object-cover border border-white/20"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center border border-white/20">
              <User className="w-6 h-6 text-gray-400" />
            </div>
          )}
          <div className="flex-1 text-left">
            <div className="text-sm font-bold text-white">{creatorName || 'Creator'}</div>
            {creatorHandle && (
              <div className="text-xs text-gray-400">{creatorHandle}</div>
            )}
          </div>
        </button>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-400">
        {views > 0 && <span>{formatViews(views)} views</span>}
        {likes > 0 && <span>{formatViews(likes)} likes</span>}
        {publishedAt && <span>{formatDate(publishedAt)}</span>}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-full border border-white/20"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Subscribe Button */}
      {onSubscribe && (
        <button
          onClick={() => {
            triggerHaptic('medium');
            onSubscribe?.();
          }}
          className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Subscribe</span>
        </button>
      )}
    </div>
  );
};


