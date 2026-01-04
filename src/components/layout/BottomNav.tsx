import { Home, Tv, Smartphone, Clapperboard, User } from 'lucide-react';
import type { Creator } from '../../utils/types';
import { triggerHaptic } from '../../utils/helpers';

interface BottomNavProps {
  activeTab: string;
  setTab: (tab: string) => void;
  myProfileId?: string;
  creators?: Record<string, Creator>;
}

export default function BottomNav({ activeTab, setTab, myProfileId = 'joshuaroberts', creators = {} }: BottomNavProps) {
  const navItems = [
    { id: 'home', label: 'HOME', icon: Home },
    { id: 'series', label: 'SERIES', icon: Tv },
    { id: 'shorts', label: 'SHORTS', icon: Smartphone },
    { id: 'trailers', label: 'TRAILERS', icon: Clapperboard },
    { id: 'profile', label: '', icon: User, isAvatar: true },
  ];

  const myProfile = creators[myProfileId];

  return (
    <div className="h-20 bg-black border-t border-gray-900 flex justify-around items-center pb-4 absolute bottom-0 w-full z-50">
      {navItems.map(item => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => {
              setTab(item.id);
              triggerHaptic('medium');
            }}
            className="flex flex-col items-center gap-1 w-16 active:scale-90 transition-transform"
          >
            {item.isAvatar ? (
              <img
                src={myProfile?.avatar || ''}
                className={`w-6 h-6 rounded-full border-2 ${
                  activeTab === item.id ? 'border-white' : 'border-transparent opacity-50'
                } object-cover`}
                alt="Profile"
              />
            ) : (
              <Icon
                className={`w-6 h-6 ${activeTab === item.id ? 'text-yellow-500' : 'text-gray-500'}`}
              />
            )}
            {item.label && (
              <span
                className={`text-[10px] font-bold ${
                  activeTab === item.id ? 'text-yellow-500' : 'text-gray-600'
                }`}
              >
                {item.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
