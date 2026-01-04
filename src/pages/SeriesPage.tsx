import { useEffect, useState } from 'react';
import { DEMO_SERIES, DEMO_CREATORS } from '../data/demoSeed';
import type { Series } from '../data/demoSeed';
import { BadgeOverlay } from '../components/features/BadgeOverlay';
import { triggerHaptic } from '../utils/helpers';

export const SeriesPage = () => {
  const [series, setSeries] = useState<Series[]>([]);

  useEffect(() => {
    // Use demo series if guest or if no API data
    setSeries(DEMO_SERIES);
  }, []);

  if (series.length === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-2">No series available</div>
          <div className="text-gray-600 text-sm">Check back later for new content</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-y-auto bg-black pb-24">
      <div className="p-4">
        <h1 className="text-2xl font-black text-white mb-6">Series</h1>
        
        <div className="grid grid-cols-2 gap-4">
          {series.map(s => {
            const creator = DEMO_CREATORS[s.creator_id];
            return (
              <div
                key={s.id}
                onClick={() => {
                  triggerHaptic('medium');
                  console.log(`[MOCK] Navigate to series: ${s.id}`);
                }}
                className="relative bg-[#0F172A] rounded-xl overflow-hidden border border-gray-800 active:scale-95 transition-transform cursor-pointer"
              >
                {/* Cover Image */}
                <div className="aspect-[9/16] relative bg-gray-900">
                  <img
                    src={s.cover}
                    alt={s.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      (e.target as HTMLImageElement).src = '/assets/covers/fallback-cover.png';
                    }}
                  />
                  {/* VIBE Overlay for Dark Room and Best Burgers */}
                  {(s.id === 'dark-room' || s.id === 'best-burgers') && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500/90 to-yellow-400/90 backdrop-blur-md px-3 py-1 rounded-full border-2 border-yellow-300/50 shadow-lg">
                      <span className="text-black font-black text-xs tracking-wider">VIBE™</span>
                    </div>
                  )}
                </div>
                
                {/* Series Info */}
                <div className="p-3">
                  <h3 className="text-white font-bold text-sm mb-1 truncate">{s.title}</h3>
                  {creator && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="relative w-6 h-6 rounded-full overflow-hidden border border-gray-700">
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          className="w-full h-full object-cover"
                        />
                        <BadgeOverlay creator={creator} size="sm" />
                      </div>
                      <span className="text-gray-400 text-xs truncate">{creator.name}</span>
                    </div>
                  )}
                  <div className="text-gray-500 text-xs">
                    {s.episodeCount} {s.episodeCount === 1 ? 'Episode' : 'Episodes'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* VIBE Explainer */}
        <div className="mt-8 p-4 bg-[#0F172A] border border-gray-800 rounded-xl">
          <h2 className="text-lg font-black text-white mb-2">VIBE™ shows the real-time pulse of your creative world.</h2>
          <ul className="text-gray-300 text-sm space-y-2 mt-3">
            <li>• See how creators, networks, and audiences interact in the moment.</li>
            <li>• Every tile reflects live activity, not static profiles.</li>
          </ul>
          <p className="text-gray-400 text-xs mt-4">
            VIBE™ is a live visual layer that updates as creators and networks move, post, and connect. Each tile represents real activity happening right now. It&apos;s a fast way to understand what&apos;s active, rising, or worth exploring.
          </p>
        </div>
      </div>
    </div>
  );
};
