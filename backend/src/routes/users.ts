/**
 * Users/Creators Routes
 * Handles all user/creator-related API endpoints
 */

import express from 'express';
import { prisma } from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';

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
        type: show.genre || 'SERIES', // Map genre to type
        coverImage: show.coverImage,
        videoUrl: show.trailerUrl || null, // Map trailerUrl to videoUrl
        progress: 0, // Not stored in Show model
        subTitle: show.description || null, // Map description to subTitle
        creatorId: show.creatorId,
        createdAt: show.releaseDate.toISOString(), // Map releaseDate to createdAt
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
        type: show.genre || 'SERIES', // Map genre to type
        coverImage: show.coverImage,
        videoUrl: show.trailerUrl || null, // Map trailerUrl to videoUrl
        progress: 0, // Not stored in Show model
        subTitle: show.description || null, // Map description to subTitle
        creatorId: show.creatorId,
        createdAt: show.releaseDate.toISOString(), // Map releaseDate to createdAt
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

// PUT /api/users/profile - Update authenticated user's profile
// 🔒 SECURITY: Users can only update identity fields, NOT role or permissions
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id; // Extracted from JWT token (authenticateToken ensures this exists)
    const { username, displayName, avatarUrl } = req.body;

    // 1. VALIDATION
    if (!username || !displayName) {
      return res.status(400).json({ 
        error: 'Username and Display Name are required.' 
      });
    }

    // Sanitize username (lowercase, remove spaces, allowed chars only)
    const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, '');

    if (cleanUsername.length < 3) {
      return res.status(400).json({ 
        error: 'Username must be at least 3 characters.' 
      });
    }

    if (cleanUsername.length > 30) {
      return res.status(400).json({ 
        error: 'Username must be less than 30 characters.' 
      });
    }

    // Validate displayName
    if (displayName.trim().length < 1) {
      return res.status(400).json({ 
        error: 'Display Name cannot be empty.' 
      });
    }

    if (displayName.length > 100) {
      return res.status(400).json({ 
        error: 'Display Name must be less than 100 characters.' 
      });
    }

    // 2. UNIQUENESS CHECK
    // Check if username is taken by SOMEONE ELSE
    const existingUser = await prisma.user.findUnique({
      where: { username: cleanUsername }
    });

    if (existingUser && existingUser.id !== userId) {
      return res.status(409).json({ 
        error: 'Username is already taken.' 
      });
    }

    // 3. EXECUTE UPDATE
    // 🔒 SECURITY: We do NOT update 'role' here. Roles are assigned by Admin only.
    // Update User table
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username: cleanUsername,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        coinBalance: true,
        createdAt: true,
      }
    });

    // Update or create Profile
    const profile = await prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        displayName: displayName.trim(),
        avatarUrl: avatarUrl || null,
      },
      update: {
        displayName: displayName.trim(),
        avatarUrl: avatarUrl || null,
      },
      select: {
        displayName: true,
        avatarUrl: true,
        bio: true,
        isFounding50: true,
        followerCount: true,
        totalViews: true,
      }
    });

    // Return combined user + profile data
    return res.json({ 
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        displayName: profile.displayName,
        avatarUrl: profile.avatarUrl,
        role: updatedUser.role,
        coinBalance: updatedUser.coinBalance,
        bio: profile.bio,
        isFounding50: profile.isFounding50,
        followerCount: profile.followerCount,
        totalViews: profile.totalViews,
        createdAt: updatedUser.createdAt.toISOString(),
      }
    });

  } catch (error) {
    console.error('Profile Update Error:', error);
    
    // Handle Prisma unique constraint errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return res.status(409).json({ 
        error: 'Username is already taken.' 
      });
    }
    
    return res.status(500).json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;

