'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Tv, Smartphone, Clapperboard, User } from 'lucide-react';
import clsx from 'clsx';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { id: 'home', label: 'HOME', icon: Home, path: '/' },
    { id: 'series', label: 'SERIES', icon: Tv, path: '/series' },
    { id: 'shorts', label: 'SHORTS', icon: Smartphone, path: '/shorts' },
    { id: 'cinema', label: 'CINEMA', icon: Clapperboard, path: '/cinema' },
    { id: 'profile', label: 'ME', icon: User, path: '/profile/me' }
  ];

  return (
    <div className="h-20 bg-vertikal-dark border-t border-white/10 flex justify-around items-center pb-4 absolute bottom-0 w-full z-50 backdrop-blur-md bg-opacity-95">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        const Icon = item.icon;
        
        return (
          <button 
            key={item.id} 
            onClick={() => router.push(item.path)}
            className="flex flex-col items-center gap-1 w-16 active:scale-90 transition-transform duration-200"
          >
            <Icon 
              size={24} 
              className={clsx(
                "transition-colors duration-200",
                isActive ? "text-vertikal-blue" : "text-gray-500"
              )} 
            />
            <span className={clsx(
              "text-[10px] font-bold tracking-wide transition-colors duration-200",
              isActive ? "text-vertikal-blue" : "text-gray-600"
            )}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}