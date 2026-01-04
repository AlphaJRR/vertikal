import { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { formatTime, getProgressPercentage, getQuartile, seekByPercentage, emitAnalyticsEvent } from '../../lib/playerUtils';
import { triggerHaptic } from '../../utils/helpers';

interface ShowPlayerProps {
  videoUrl: string;
  thumbnail?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onComplete?: () => void;
  onTimeUpdate?: (current: number, duration: number) => void;
  showId?: string;
  cloudflare?: {
    uid: string;
    iframe: string;
    thumbnail: string;
    duration: number;
    readyToStream: boolean;
  };
  readyToStream?: boolean;
}

export const ShowPlayer = ({
  videoUrl,
  thumbnail,
  autoPlay = true,
  loop = false,
  muted: initialMuted = true,
  onPlay,
  onPause,
  onComplete,
  onTimeUpdate,
  showId,
  cloudflare,
  readyToStream,
}: ShowPlayerProps) => {
  // ✅ Use Cloudflare iframe if available and ready
  const useCloudflareIframe = (cloudflare?.readyToStream || readyToStream) && cloudflare?.iframe;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [lastQuartile, setLastQuartile] = useState<number | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-play on mount
  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch(() => {
        console.log('Autoplay blocked');
      });
    }
  }, [autoPlay]);

  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setIsPlaying(true);
      emitAnalyticsEvent('video_start', {
        show_id: showId,
        start_time: Date.now(),
      });
      onPlay?.();
    };

    const handlePause = () => {
      setIsPlaying(false);
      emitAnalyticsEvent('video_pause', {
        show_id: showId,
        current_time: video.currentTime,
      });
      onPause?.();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      emitAnalyticsEvent('video_complete', {
        show_id: showId,
        duration: video.duration,
      });
      onComplete?.();
    };

    const handleTimeUpdate = () => {
      const current = video.currentTime;
      const dur = video.duration;
      setCurrentTime(current);
      setDuration(dur);
      onTimeUpdate?.(current, dur);

      // Track quartiles
      const quartile = getQuartile(current, dur);
      if (quartile !== null && quartile !== lastQuartile) {
        setLastQuartile(quartile);
        emitAnalyticsEvent('video_quartile', {
          show_id: showId,
          quartile: `${quartile}%`,
        });
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [showId, onPlay, onPause, onComplete, onTimeUpdate, lastQuartile]);

  // Hide controls after 2 seconds
  useEffect(() => {
    if (showControls && isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, isPlaying]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      triggerHaptic('medium');
      setShowControls(true);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      triggerHaptic('light');
      setShowControls(true);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    
    seekByPercentage(videoRef.current, percentage);
    emitAnalyticsEvent('video_scrub', {
      show_id: showId,
      from_time: currentTime,
      to_time: (percentage / 100) * duration,
    });
    triggerHaptic('light');
  };

  const handleProgressDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;
    
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    
    seekByPercentage(videoRef.current, percentage);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const progress = getProgressPercentage(currentTime, duration);

  return (
    <div
      className="relative w-full bg-black"
      style={{ aspectRatio: '9/16' }}
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => {
        if (isPlaying) {
          setTimeout(() => setShowControls(false), 2000);
        }
      }}
    >
      {useCloudflareIframe ? (
        // ✅ Cloudflare Stream iframe
        <iframe
          src={cloudflare!.iframe}
          style={{
            border: 0,
            width: '100%',
            height: '100%',
            aspectRatio: '9/16',
            borderRadius: '0',
            overflow: 'hidden',
          }}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen
          className="w-full h-full object-cover"
        />
      ) : (
        // Standard video player
        <video
          ref={videoRef}
          src={videoUrl}
          poster={thumbnail}
          className="w-full h-full object-cover"
          muted={isMuted}
          loop={loop}
          playsInline
          onClick={togglePlayPause}
        />
      )}

      {/* Controls Overlay */}
      {showControls && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none">
          {/* Top Controls */}
          <div className="absolute top-4 right-4 flex items-center gap-2 pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition active:scale-90"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </button>
          </div>

          {/* Center Play/Pause Button */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlayPause();
              }}
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition active:scale-90 pointer-events-auto"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white fill-white" />
              ) : (
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              )}
            </button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto">
            {/* Progress Bar */}
            <div
              className="relative h-2 bg-white/20 rounded-full mb-3 cursor-pointer"
              onClick={handleProgressClick}
              onMouseDown={handleProgressDrag}
              onMouseUp={handleMouseUp}
              onMouseMove={(e) => {
                if (isDragging) {
                  handleProgressDrag(e);
                }
              }}
            >
              <div
                className="absolute top-0 left-0 h-full bg-white rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full -translate-x-1/2 transition-all"
                style={{ left: `${progress}%` }}
              />
            </div>

            {/* Time Display */}
            <div className="flex items-center justify-between text-white text-xs">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


