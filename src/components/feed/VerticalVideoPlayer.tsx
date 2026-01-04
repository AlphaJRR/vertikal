import { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { triggerHaptic } from '../../utils/helpers';

interface VerticalVideoPlayerProps {
  videoUrl?: string;
  thumbnail: string;
  autoplay?: boolean;
  onPlay?: () => void;
}

export const VerticalVideoPlayer = ({
  videoUrl,
  thumbnail,
  autoplay = false,
  onPlay,
}: VerticalVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);

  useEffect(() => {
    if (autoplay && videoRef.current && videoUrl) {
      videoRef.current.play().catch(() => {
        console.log('Autoplay blocked');
        setShowPlayButton(true);
      });
    }
  }, [autoplay, videoUrl]);

  const handlePlay = () => {
    if (videoRef.current && videoUrl) {
      videoRef.current.play();
      setIsPlaying(true);
      setShowPlayButton(false);
      triggerHaptic('medium');
      onPlay?.();
    } else {
      // Mock play action
      console.log('[MOCK] Video play triggered');
      setIsPlaying(true);
      setShowPlayButton(false);
      triggerHaptic('medium');
      onPlay?.();
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowPlayButton(true);
    }
  };

  return (
    <div
      className="relative w-full h-full bg-black overflow-hidden"
      onClick={isPlaying ? handlePause : handlePlay}
    >
      {videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
          poster={thumbnail}
        />
      ) : (
        <img
          src={thumbnail}
          alt="Video thumbnail"
          className="w-full h-full object-cover"
        />
      )}

      {/* Play Overlay */}
      {showPlayButton && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <button
            onClick={e => {
              e.stopPropagation();
              handlePlay();
            }}
            className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all active:scale-90"
          >
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </button>
        </div>
      )}

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none"></div>
    </div>
  );
};


