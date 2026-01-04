import { useState } from 'react';
import type { Creator } from '../../utils/types';

interface BadgeOverlayProps {
  creator: Creator;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export const BadgeOverlay = ({ creator, size = 'md', showTooltip = false }: BadgeOverlayProps) => {
  const [showTooltipState, setShowTooltipState] = useState(false);

  // Determine badge type
  const isNetwork = creator.type === 'network';
  const badgeType = isNetwork ? 'network' : 'founding50';

  // Size mappings
  const sizeMap = {
    sm: { badge: 'w-4 h-4', tooltip: 'text-xs' },
    md: { badge: 'w-6 h-6', tooltip: 'text-sm' },
    lg: { badge: 'w-8 h-8', tooltip: 'text-base' },
  };

  const badgeSize = sizeMap[size].badge;
  const tooltipSize = sizeMap[size].tooltip;

  // Badge tooltip text
  const tooltipText = isNetwork
    ? 'Network Titanium: Verified network leader'
    : 'Founding 50: Early platform architect';

  // Only show badge if applicable
  if (isNetwork || creator.isFounding50) {
    return (
      <div className="relative">
        <div
          className={`absolute -top-1 -right-1 ${badgeSize} z-10`}
          onMouseEnter={() => showTooltip && setShowTooltipState(true)}
          onMouseLeave={() => setShowTooltipState(false)}
        >
          <img
            src={
              badgeType === 'network'
                ? '/assets/badges/badge-network-titanium.png'
                : '/assets/badges/badge-founding50-gold.png'
            }
            alt={badgeType === 'network' ? 'Network Badge' : 'Founding 50 Badge'}
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>
        {showTooltip && showTooltipState && (
          <div
            className={`absolute -top-12 right-0 bg-black/90 text-white px-3 py-2 rounded-lg ${tooltipSize} whitespace-nowrap z-20 border border-gray-700 shadow-xl`}
          >
            {tooltipText}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

