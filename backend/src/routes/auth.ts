/**
 * Authentication Routes
 * Handles user registration and login
 */

/**
 * Authentication Routes
 * Handles user registration and login with complete error handling and validation
 */

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key-change-in-production';

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ 
        error: 'Email, password, and name are required' 
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }
    
    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters' 
      });
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { 
        OR: [
          { email },
          { username: name }
        ]
      }
    });
    
    if (existingUser) {
      return res.status(409).json({ 
        error: 'User already exists' 
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: { 
        email, 
        passwordHash: hashedPassword, 
        username: name,
        role: 'USER',
        coinBalance: 0,
      }
    });
    
    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
    
    // Return user data (exclude passwordHash)
    const { passwordHash: _, ...userResponse } = user;
    
    res.status(201).json({ 
      token, 
      user: userResponse 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Failed to register user',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }
    
    // Find user
    const user = await prisma.user.findUnique({ 
      where: { email },
      include: {
        profile: true,
      },
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
    
    // Return user data (exclude passwordHash)
    const { passwordHash: _, ...userResponse } = user;
    
    res.json({ token, user: userResponse });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Failed to login',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/auth/me - Get current authenticated user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Transform to match UserProfile format
    const { passwordHash: _, ...userResponse } = user;
    
    res.json({
      id: userResponse.id,
      username: userResponse.username,
      email: userResponse.email,
      coinBalance: userResponse.coinBalance,
      profile: userResponse.profile ? {
        displayName: userResponse.profile.displayName,
        bio: userResponse.profile.bio,
        avatarUrl: userResponse.profile.avatarUrl,
        type: userResponse.profile.type,
        isFounding50: userResponse.profile.isFounding50,
        followerCount: userResponse.profile.followerCount,
        totalViews: userResponse.profile.totalViews,
      } : undefined,
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ 
      error: 'Failed to get current user',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;

