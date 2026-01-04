import { ArrowRight } from 'lucide-react';
import { triggerHaptic } from '../../utils/helpers';

interface ShowMetaOverlayProps {
  title: string;
  series?: string;
  creatorName?: string;
  tags?: string[];
  onViewDetails: () => void;
}

export const ShowMetaOverlay = ({
  title,
  series,
  creatorName,
  tags = [],
  onViewDetails,
}: ShowMetaOverlayProps) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
      <div className="space-y-2">
        {/* Series Name */}
        {series && (
          <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
            {series}
          </div>
        )}

        {/* Title */}
        <h3 className="text-2xl font-black text-white leading-tight">{title}</h3>

        {/* Creator Name */}
        {creatorName && (
          <div className="text-sm text-gray-300">
            by <span className="font-bold text-white">{creatorName}</span>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-xs bg-white/10 backdrop-blur-sm text-white px-2 py-1 rounded-full border border-white/20"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* View Details Button */}
        <button
          onClick={e => {
            e.stopPropagation();
            onViewDetails();
            triggerHaptic('light');
          }}
          className="mt-4 flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all active:scale-95 border border-white/20"
        >
          <span className="text-sm font-bold">View Details</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};


