import { useState } from 'react';
import { ChevronRight, Play } from 'lucide-react';
import { VideoHero } from '../components/features/VideoHero';
import { ProjectCard } from '../components/cards/ProjectCard';
import { CreatorAvatar } from '../components/cards/CreatorAvatar';
import { ContinueWatchingCard } from '../components/cards/ContinueWatchingCard';
import { getAllProjects } from '../utils/helpers';
import type { Creator, Project } from '../utils/types';
import { IMG_HERO, IMG_NATURE } from '../utils/constants';

interface HomePageProps {
  creators: Record<string, Creator>;
  onViewProfile: (id: string) => void;
}

export const HomePage = ({ creators, onViewProfile }: HomePageProps) => {
  // VIBE comments enabled by default for featured video
  const [danmakuOn, setDanmakuOn] = useState(true);
  const [filter, setFilter] = useState('For You');
  const allProjects = getAllProjects(creators);

  // Prioritize demo creators (Joe Guidry, Joshua Argue) for guest mode
  const isGuest = typeof window !== 'undefined' && localStorage.getItem('vertikal_is_guest') === 'true';

  const displayCreators =
    filter === 'Networks'
      ? Object.entries(creators).filter(([, v]) => v.type === 'network')
      : Object.entries(creators).filter(([, v]) => v.type === 'creator');

  // Sort creators to prioritize Joe Guidry and Joshua Argue for guests
  const sortedCreators = isGuest
    ? [...displayCreators].sort(([a], [b]) => {
        if (a === 'joeguidry') return -1;
        if (b === 'joeguidry') return 1;
        if (a === 'joshuaargue') return -1;
        if (b === 'joshuaargue') return 1;
        return 0;
      })
    : displayCreators;

  const creatorAvatars = (
    <>
      <CreatorAvatar isAddButton />
      {sortedCreators.slice(0, 10).map(([key, creator]) => (
        <CreatorAvatar
          key={key}
          creator={creator}
          onClick={() => onViewProfile(key)}
        />
      ))}
    </>
  );

  return (
    <div className="pb-24 animate-fade overflow-y-auto h-full no-scrollbar relative">
      <VideoHero
        danmakuOn={danmakuOn}
        setDanmakuOn={setDanmakuOn}
        filter={filter}
        setFilter={setFilter}
        onPlay={() => console.log('Play clicked')}
        creatorAvatars={creatorAvatars}
      />

      <div className="mt-8 px-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">Continue Watching</h2>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar">
          <ContinueWatchingCard
            title="The Last Echo"
            episode="S1:E3"
            timeLeft="12m left"
            progress={75}
            thumbnail={IMG_HERO}
          />
          <ContinueWatchingCard
            title="Midnight Run"
            episode="S1:E3"
            timeLeft="12m left"
            progress={25}
            thumbnail={IMG_NATURE}
          />
        </div>
      </div>

      <div className="mt-8 px-4 mb-20">
        <h2 className="text-lg font-bold mb-3">Director Originals</h2>
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {allProjects.map((project: Project, i: number) => (
            <ProjectCard key={i} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
};


