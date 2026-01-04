import { useState } from 'react';
import { Heart, MessageCircle, DollarSign, Share2, Sparkles } from 'lucide-react';
import { triggerHaptic } from '../../utils/helpers';

interface ActionBarProps {
  showId: string;
  creatorId?: string;
  likes?: number;
  comments?: number;
  onLike?: () => void;
  onComment?: () => void;
  onTip?: () => void;
  onShare?: () => void;
  onVibeToggle?: (active: boolean) => void;
}

export const ActionBar = ({
  showId,
  creatorId,
  likes = 0,
  comments = 0,
  onLike,
  onComment,
  onTip,
  onShare,
  onVibeToggle,
}: ActionBarProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [vibeActive, setVibeActive] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    triggerHaptic('medium');
    onLike?.();
  };

  const handleVibeToggle = () => {
    const newState = !vibeActive;
    setVibeActive(newState);
    triggerHaptic('medium');
    onVibeToggle?.(newState);
  };

  return (
    <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-4 z-20">
      {/* Like Button */}
      <button
        onClick={handleLike}
        className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
      >
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm border transition-all ${
            isLiked
              ? 'bg-red-500/20 border-red-500/50'
              : 'bg-black/40 border-white/20'
          }`}
        >
          <Heart
            className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`}
          />
        </div>
        <span className="text-xs font-bold text-white">{likes}</span>
      </button>

      {/* Comment Button */}
      <button
        onClick={() => {
          triggerHaptic('light');
          onComment?.();
        }}
        className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
      >
        <div className="w-12 h-12 rounded-full bg-black/40 border border-white/20 flex items-center justify-center backdrop-blur-sm">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <span className="text-xs font-bold text-white">{comments}</span>
      </button>

      {/* Tip Button */}
      <button
        onClick={() => {
          triggerHaptic('medium');
          onTip?.();
        }}
        className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
      >
        <div className="w-12 h-12 rounded-full bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center backdrop-blur-sm">
          <DollarSign className="w-6 h-6 text-yellow-400" />
        </div>
        <span className="text-xs font-bold text-yellow-400">Tip</span>
      </button>

      {/* VIBE Toggle */}
      {onVibeToggle && (
        <button
          onClick={handleVibeToggle}
          className={`flex flex-col items-center gap-1 active:scale-90 transition-transform ${
            vibeActive ? 'animate-pulse' : ''
          }`}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm border transition-all ${
              vibeActive
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-transparent'
                : 'bg-black/40 border-white/20'
            }`}
          >
            <Sparkles
              className={`w-6 h-6 ${vibeActive ? 'text-white' : 'text-gray-400'}`}
            />
          </div>
          <span
            className={`text-xs font-bold ${vibeActive ? 'text-white' : 'text-gray-400'}`}
          >
            VIBE
          </span>
        </button>
      )}

      {/* Share Button */}
      <button
        onClick={() => {
          triggerHaptic('light');
          onShare?.();
        }}
        className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
      >
        <div className="w-12 h-12 rounded-full bg-black/40 border border-white/20 flex items-center justify-center backdrop-blur-sm">
          <Share2 className="w-6 h-6 text-white" />
        </div>
        <span className="text-xs font-bold text-white">Share</span>
      </button>
    </div>
  );
};


