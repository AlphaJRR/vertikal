import { Play, Plus } from 'lucide-react';
import { DanmakuOverlay } from './DanmakuOverlay';
import { triggerHaptic } from '../../utils/helpers';
import { VIDEO_TRAILER, IMG_BASES } from '../../utils/constants';
// ✅ HARD-LOCKED: No longer importing FEATURED_VIDEO - hero is hard-coded
import { useRef, useEffect, useState } from 'react';

interface VideoHeroProps {
  danmakuOn: boolean;
  setDanmakuOn: (on: boolean) => void;
  filter: string;
  setFilter: (filter: string) => void;
  onPlay: () => void;
  creatorAvatars: React.ReactNode;
}

export const VideoHero = ({
  danmakuOn,
  setDanmakuOn,
  filter,
  setFilter,
  onPlay,
  creatorAvatars,
}: VideoHeroProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // ✅ HARD-LOCKED: Always use Joshua Argue's Best Burgers video (UID: 9d3d0efed36b71e5f75c7b5e218809d7)
  // Do not rely on demoSeed selection - this is the permanent hero video
  const HERO_VIDEO_UID = "9d3d0efed36b71e5f75c7b5e218809d7";
  const HERO_VIDEO_IFRAME = `https://customer-fyh68ijrcuys7ag8.cloudflarestream.com/${HERO_VIDEO_UID}/iframe`;
  const useCloudflareVideo = true; // Always use Cloudflare for hero

  useEffect(() => {
    if (!useCloudflareVideo && videoRef.current) {
      videoRef.current.play().catch(() => console.log('Autoplay blocked'));
    }
  }, [useCloudflareVideo]);

  return (
    <div
      className="relative h-[500px] w-full cursor-pointer gpu-accelerated"
      onClick={() => {
        setDanmakuOn(!danmakuOn);
        triggerHaptic('light');
      }}
    >
      <div className="absolute inset-0">
        {useCloudflareVideo ? (
          // ✅ HARD-LOCKED: Joshua Argue's Best Burgers video (UID: 9d3d0efed36b71e5f75c7b5e218809d7)
          <iframe
            src={HERO_VIDEO_IFRAME}
            style={{
              border: 0,
              width: '100%',
              height: '100%',
              aspectRatio: '9/16',
              borderRadius: '18px',
              overflow: 'hidden',
            }}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen
            className="w-full h-full object-cover"
          />
        ) : (
          // Fallback: Standard video player
          <>
            <video
              ref={videoRef}
              src={VIDEO_TRAILER}
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
              poster={IMG_BASES}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
          </>
        )}
      </div>
      {/* VIBE Comments Overlay - Hard-locked preset for Joshua Argue's Best Burgers */}
      <DanmakuOverlay 
        active={danmakuOn} 
        vibeThreadId="vibe_argueably_best_burgers_v1"
        vibePreset={[
          { t: 2.5, u: "AVA_Member", m: "This intro is CRAZY 🔥" },
          { t: 6.0, u: "Founder50", m: "Vertical cinema is rotating. Not dying." },
          { t: 9.2, u: "BlackAwe", m: "Argue don't miss 🎬" },
          { t: 13.0, u: "KelFan", m: "That pacing is clean 😮‍💨" },
          { t: 18.5, u: "Showrunner", m: "This looks premium." },
          { t: 25.0, u: "Network", m: "We need Episode 1 ASAP." },
          { t: 33.0, u: "Creator", m: "The vibe overlay is the sauce." },
          { t: 45.0, u: "Viewer", m: "Okay… I'm locked in." },
        ]}
      />
      
      {/* VIBE™ LIVE Badge */}
      <div className="absolute top-4 left-4 z-30">
        <div className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 px-3 py-1 rounded-full border-2 border-yellow-300/70 shadow-lg">
          <span className="text-black font-black text-xs tracking-wider">VIBE™ LIVE</span>
        </div>
      </div>
      
      <div className="absolute top-4 right-4 z-30">
        <button
          onClick={e => {
            e.stopPropagation();
            setDanmakuOn(!danmakuOn);
            triggerHaptic('medium');
          }}
          className={`px-4 py-1.5 text-[10px] font-black tracking-widest rounded-full border backdrop-blur-md transition-all ${
            danmakuOn
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-transparent text-white animate-hype shadow-lg shadow-purple-500/50'
              : 'bg-black/40 border-white/20 text-gray-400'
          }`}
        >
          VIBE {danmakuOn ? 'ON' : 'OFF'}
        </button>
      </div>
      <div className="absolute bottom-0 w-full p-4 flex flex-col items-center z-30">
        <div className="flex gap-2 overflow-x-auto no-scrollbar w-full justify-center mb-6 z-40">
          {['For You', 'Networks', 'Drama', 'Docu'].map(g => (
            <button
              key={g}
              onClick={e => {
                e.stopPropagation();
                setFilter(g);
                triggerHaptic('light');
              }}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                filter === g
                  ? 'bg-white text-black'
                  : 'bg-white/10 backdrop-blur text-white'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
        <div className="flex flex-col items-center mb-6">
          <span className="text-blue-500 font-black tracking-widest text-[10px] mb-2 block animate-pulse border border-blue-500/50 px-2 py-0.5 rounded bg-blue-900/20">
            ★ FEATURED PREMIERE
          </span>
          <h1 className="text-5xl font-black text-white mb-2 leading-none text-center drop-shadow-2xl italic tracking-tighter">
            ARGUEABLY THE BEST BURGERS
          </h1>
          <div className="flex gap-2">
            <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">
              98% Match
            </span>
            <span className="bg-blue-600/20 text-blue-400 text-xs font-bold px-2 py-1 rounded">
              Sports Docu
            </span>
          </div>
        </div>
        <div className="flex gap-3 w-full max-w-xs mb-8">
          <button
            className="flex-1 bg-white text-black font-bold py-3 rounded flex items-center justify-center gap-2 active:scale-95 transition-transform"
            onClick={e => {
              e.stopPropagation();
              onPlay();
              triggerHaptic('heavy');
            }}
          >
            <Play className="fill-black w-4 h-4" />
            PLAY
          </button>
          <button
            className="w-12 bg-gray-800/80 text-white rounded flex items-center justify-center active:scale-95 transition-transform"
            onClick={e => {
              e.stopPropagation();
              triggerHaptic('light');
            }}
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
        <div className="flex gap-4 w-full overflow-x-auto no-scrollbar justify-start px-2">
          {creatorAvatars}
        </div>
      </div>
    </div>
  );
};


