import type { Creator, Project } from './types';

/**
 * Haptic feedback trigger (web bridge)
 */
export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if (navigator.vibrate) {
    if (type === 'light') navigator.vibrate(10);
    if (type === 'medium') navigator.vibrate(40);
    if (type === 'heavy') navigator.vibrate([50, 30, 50]);
  }
};

/**
 * Get all projects from all creators
 */
export const getAllProjects = (creators: Record<string, Creator>): Project[] => {
  const all: Project[] = [];
  Object.values(creators).forEach(creator => {
    if (creator.projects && creator.projects.length > 0) {
      creator.projects.forEach(p => {
        all.push({
          ...p,
          creatorName: creator.name,
          creatorAvatar: creator.avatar,
        });
      });
    }
  });
  return all.sort(() => 0.5 - Math.random());
};


