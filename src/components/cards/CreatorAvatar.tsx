import { Plus } from 'lucide-react';
import { BadgeOverlay } from '../features/BadgeOverlay';
import type { Creator } from '../../utils/types';
import { triggerHaptic } from '../../utils/helpers';

interface CreatorAvatarProps {
  creator?: Creator;
  isAddButton?: boolean;
  onClick?: () => void;
}

export const CreatorAvatar = ({ creator, isAddButton, onClick }: CreatorAvatarProps) => {
  if (isAddButton) {
    return (
      <div className="flex flex-col items-center gap-1 min-w-[64px]">
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center relative active:scale-90 transition-transform">
          <Plus className="text-gray-400" />
        </div>
        <span className="text-xs text-gray-400">Add</span>
      </div>
    );
  }

  if (!creator) return null;

  const isNetwork = creator.type === 'network';

  return (
    <div
      className="flex flex-col items-center gap-1 cursor-pointer min-w-[64px]"
      onClick={() => {
        onClick?.();
        triggerHaptic('light');
      }}
    >
      <div
        className={`w-16 h-16 rounded-full border-2 p-0.5 overflow-hidden active:scale-90 transition-transform relative ${
          isNetwork ? 'border-yellow-500' : 'border-purple-500'
        }`}
      >
        <img
          src={creator.avatar}
          className="w-full h-full rounded-full object-cover bg-black"
          alt={creator.name}
        />
        <BadgeOverlay creator={creator} size="sm" />
      </div>
      <span className="text-xs font-bold truncate w-16 text-center">
        {creator.name.split(' ')[0]}
      </span>
    </div>
  );
};


