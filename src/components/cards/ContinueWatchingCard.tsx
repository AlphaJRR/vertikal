import { Play } from 'lucide-react';

interface ContinueWatchingCardProps {
  title: string;
  episode: string;
  timeLeft: string;
  progress: number;
  thumbnail: string;
  onClick?: () => void;
}

export const ContinueWatchingCard = ({
  title,
  episode,
  timeLeft,
  progress,
  thumbnail,
  onClick,
}: ContinueWatchingCardProps) => {
  return (
    <div className="min-w-[160px]">
      <div className="h-24 w-full relative rounded-lg overflow-hidden mb-2">
        <img src={thumbnail} className="w-full h-full object-cover" alt={title} />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Play className="fill-white text-white w-8 h-8" />
        </div>
        <div className="absolute bottom-0 w-full h-1 bg-gray-700">
          <div className="h-full bg-red-600" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <h3 className="text-xs font-bold">{title}</h3>
      <p className="text-[10px] text-gray-500">
        {episode} • {timeLeft}
      </p>
    </div>
  );
};


