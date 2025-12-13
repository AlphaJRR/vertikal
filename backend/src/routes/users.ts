/**
 * Users/Creators Routes
 * Handles all user/creator-related API endpoints
 */

import express from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

// GET /api/users - Get all users (with their projects/shows)
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;
    
    const users = await prisma.user.findMany({
      take: limit,
      skip: offset,
      include: {
        profile: {
          include: {
            shows: true, // Include shows (projects) in response
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    // Transform to match UserDTO format expected by frontend
    const usersWithProjects = users.map(user => ({
      id: user.id,
      email: user.email,
      username: user.username,
      avatar: user.profile?.avatarUrl || null,
      role: user.role,
      isFounding50: user.profile?.isFounding50 || false,
      bio: user.profile?.bio || null,
      coins: user.coinBalance,
      createdAt: user.createdAt.toISOString(),
      projects: (user.profile?.shows || []).map(show => ({
        id: show.id,
        title: show.title,
        type: show.type,
        coverImage: show.coverImage,
        videoUrl: show.videoUrl,
        progress: show.progress,
        subTitle: show.subTitle,
        creatorId: show.creatorId,
        createdAt: show.createdAt.toISOString(),
      })),
    }));
    
    res.json(usersWithProjects);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      error: 'Failed to fetch users',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// GET /api/users/:id - Get single user
router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        profile: {
          include: {
            shows: true, // Include shows (projects)
          },
        },
      },
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Transform to match UserDTO format expected by frontend
    const userWithProjects = {
      id: user.id,
      email: user.email,
      username: user.username,
      avatar: user.profile?.avatarUrl || null,
      role: user.role,
      isFounding50: user.profile?.isFounding50 || false,
      bio: user.profile?.bio || null,
      coins: user.coinBalance,
      createdAt: user.createdAt.toISOString(),
      projects: (user.profile?.shows || []).map(show => ({
        id: show.id,
        title: show.title,
        type: show.type,
        coverImage: show.coverImage,
        videoUrl: show.videoUrl,
        progress: show.progress,
        subTitle: show.subTitle,
        creatorId: show.creatorId,
        createdAt: show.createdAt.toISOString(),
      })),
    };
    
    res.json(userWithProjects);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;

