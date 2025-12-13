/**
 * Shows/Projects Routes
 * Handles all show/project-related API endpoints
 */

import express from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

// GET /api/shows - Get all projects/shows
router.get('/', async (req, res) => {
  try {
    const shows = await prisma.show.findMany({
      include: {
        creator: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                role: true,
                coinBalance: true,
                createdAt: true,
              },
            },
            // ✅ FIXED: creator IS the Profile, no need to include profile
          },
        },
      },
      orderBy: {
        releaseDate: 'desc',
      },
    });
    
    // Transform to match ProjectDTO format expected by frontend
    // Note: Show model has genre (not type), description (not subTitle), trailerUrl (not videoUrl)
    // Progress is calculated from episode views, type is derived from genre
    const projects = shows.map(show => ({
      id: show.id,
      title: show.title,
      type: show.genre || 'SERIES', // Map genre to ProjectType
      coverImage: show.coverImage,
      videoUrl: show.trailerUrl || null, // Use trailerUrl as videoUrl
      progress: 0, // Progress calculated from episode views (would need aggregation)
      subTitle: show.description || null, // Use description as subTitle
      creatorId: show.creatorId,
      creator: show.creator ? {
        id: show.creator.user.id,
        username: show.creator.user.username,
        email: show.creator.user.email,
        avatar: show.creator.avatarUrl || null, // ✅ FIXED: creator IS the Profile
        role: show.creator.user.role,
        isFounding50: show.creator.isFounding50 || false, // ✅ FIXED: creator IS the Profile
        bio: show.creator.bio || null, // ✅ FIXED: creator IS the Profile
        coins: show.creator.user.coinBalance,
        createdAt: show.creator.user.createdAt.toISOString(),
      } : undefined,
      createdAt: show.releaseDate.toISOString(),
    }));
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ 
      error: 'Failed to fetch projects', 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
});

// GET /api/shows/popular - Get popular shows (must be BEFORE /:id route)
router.get('/popular', async (req, res) => {
  try {
    const shows = await prisma.show.findMany({
      include: {
        creator: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                role: true,
                coinBalance: true,
                createdAt: true,
              },
            },
          },
        },
      },
      orderBy: {
        releaseDate: 'desc',
      },
      take: 20,
    });
    
    const projects = shows.map(show => ({
      id: show.id,
      title: show.title,
      type: show.genre || 'SERIES',
      coverImage: show.coverImage,
      videoUrl: show.trailerUrl || null,
      progress: 0,
      subTitle: show.description || null,
      creatorId: show.creatorId,
      creator: show.creator ? {
        id: show.creator.user.id,
        username: show.creator.user.username,
        email: show.creator.user.email,
        avatar: show.creator.avatarUrl || null,
        role: show.creator.user.role,
        isFounding50: show.creator.isFounding50 || false,
        bio: show.creator.bio || null,
        coins: show.creator.user.coinBalance,
        createdAt: show.creator.user.createdAt.toISOString(),
      } : undefined,
      createdAt: show.releaseDate.toISOString(),
    }));
    
    res.json(projects);
  } catch (error) {
    console.error('Error fetching popular projects:', error);
    res.status(500).json({ 
      error: 'Failed to fetch popular projects', 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
});

// GET /api/shows/trending - Get trending shows (must be BEFORE /:id route)
router.get('/trending', async (req, res) => {
  try {
    const shows = await prisma.show.findMany({
      include: {
        creator: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                role: true,
                coinBalance: true,
                createdAt: true,
              },
            },
          },
        },
      },
      orderBy: {
        releaseDate: 'desc',
      },
      take: 20,
    });
    
    const projects = shows.map(show => ({
      id: show.id,
      title: show.title,
      type: show.genre || 'SERIES',
      coverImage: show.coverImage,
      videoUrl: show.trailerUrl || null,
      progress: 0,
      subTitle: show.description || null,
      creatorId: show.creatorId,
      creator: show.creator ? {
        id: show.creator.user.id,
        username: show.creator.user.username,
        email: show.creator.user.email,
        avatar: show.creator.avatarUrl || null,
        role: show.creator.user.role,
        isFounding50: show.creator.isFounding50 || false,
        bio: show.creator.bio || null,
        coins: show.creator.user.coinBalance,
        createdAt: show.creator.user.createdAt.toISOString(),
      } : undefined,
      createdAt: show.releaseDate.toISOString(),
    }));
    
    res.json(projects);
  } catch (error) {
    console.error('Error fetching trending projects:', error);
    res.status(500).json({ 
      error: 'Failed to fetch trending projects', 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
});

// GET /api/shows/:id - Get single project/show (must be LAST)
router.get('/:id', async (req, res) => {
  try {
    const show = await prisma.show.findUnique({
      where: { id: req.params.id },
      include: {
        creator: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                role: true,
                coinBalance: true,
                createdAt: true,
              },
            },
            // ✅ FIXED: creator IS the Profile, no need to include profile
          },
        },
      },
    });
    
    if (!show) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Transform to match ProjectDTO format
    // Note: Show model has genre (not type), description (not subTitle), trailerUrl (not videoUrl)
    const project = {
      id: show.id,
      title: show.title,
      type: show.genre || 'SERIES', // Map genre to ProjectType
      coverImage: show.coverImage,
      videoUrl: show.trailerUrl || null, // Use trailerUrl as videoUrl
      progress: 0, // Progress calculated from episode views (would need aggregation)
      subTitle: show.description || null, // Use description as subTitle
      creatorId: show.creatorId,
      creator: show.creator ? {
        id: show.creator.user.id,
        username: show.creator.user.username,
        email: show.creator.user.email,
        avatar: show.creator.avatarUrl || null, // ✅ FIXED: creator IS the Profile
        role: show.creator.user.role,
        isFounding50: show.creator.isFounding50 || false, // ✅ FIXED: creator IS the Profile
        bio: show.creator.bio || null, // ✅ FIXED: creator IS the Profile
        coins: show.creator.user.coinBalance,
        createdAt: show.creator.user.createdAt.toISOString(),
      } : undefined,
      createdAt: show.releaseDate.toISOString(),
    };
    
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ 
      error: 'Failed to fetch project',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;