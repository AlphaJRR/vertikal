/**
 * Data Transformation Utilities
 * Transforms backend API responses to mobile app format
 * 
 * Backend → Mobile Mapping:
 * - User.username → Creator.name
 * - Project.coverImage → Project.img
 */

import { ShowData } from '../services/backendClient';
import { PROJECTS_FULL, Project } from '../data';

/**
 * Transform backend ShowData to mobile Project format
 * Maps: coverImage → img, description → sub
 */
export function transformShowDataToProject(show: ShowData): Project {
  return {
    id: show.id,
    title: show.title,
    type: show.genre || 'SERIES', // ✅ Backend genre → Mobile type
    img: show.coverImage, // ✅ Backend coverImage → Mobile img
    progress: 0, // Default progress (can be calculated from user's watch history)
    sub: show.description || '', // ✅ Backend description → Mobile sub
  };
}

/**
 * Transform array of ShowData to Project array
 */
export function transformShowsToProjects(shows: ShowData[]): Project[] {
  return shows.map(transformShowDataToProject);
}

/**
 * Transform mock Project to ShowData format (for fallback)
 * Maps: img → coverImage, sub → description
 */
export function transformProjectToShowData(project: Project): ShowData {
  return {
    id: project.id,
    title: project.title,
    description: project.sub || '',
    coverImage: project.img, // ✅ Mobile img → Backend coverImage
    genre: project.type,
    creator: {
      displayName: 'VERTIKAL',
      avatarUrl: undefined,
      type: 'NETWORK',
    },
  };
}

/**
 * Transform array of Projects to ShowData array (for fallback)
 */
export function transformProjectsToShowData(projects: Project[]): ShowData[] {
  return projects.map(transformProjectToShowData);
}

/**
 * Get projects with fallback to mock data
 * Transforms backend ShowData[] to mobile Project[] format
 */
export function getProjectsWithFallback(apiProjects: ShowData[] | undefined): Project[] {
  if (apiProjects && apiProjects.length > 0) {
    // Transform backend format to mobile format
    return transformShowsToProjects(apiProjects);
  }
  // Fallback to mock data (already in mobile format)
  return PROJECTS_FULL;
}
