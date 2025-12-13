import { Router } from 'express';
import { prisma } from '../lib/prisma';
import type { ApiResponse, CommentData } from '../types';

const router = Router();

// GET /api/comments/episode/:episodeId - Get comments for an episode (including Danmaku)
router.get('/episode/:episodeId', async (req, res) => {
  try {
    const { episodeId } = req.params;
    const { vibeMode } = req.query; // ?vibeMode=true for Danmaku only
    
    const where: any = { episodeId };
    if (vibeMode === 'true') {
      where.isDanmaku = true;
    }

    const comments = await prisma.comment.findMany({
      where,
      include: {
        user: {
          include: {
            profile: {
              select: {
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: vibeMode === 'true' 
        ? { timestamp: 'asc' } 
        : { createdAt: 'desc' },
    });

    const response: ApiResponse<CommentData[]> = {
      success: true,
      data: comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        timestamp: comment.timestamp || undefined,
        isDanmaku: comment.isDanmaku,
        user: {
          username: comment.user.username,
          avatarUrl: comment.user.profile?.avatarUrl || undefined,
        },
        createdAt: comment.createdAt,
      })),
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch comments',
    } as ApiResponse);
  }
});

// POST /api/comments - Create a comment (can be Danmaku)
router.post('/', async (req, res) => {
  try {
    const { content, episodeId, userId, timestamp, isDanmaku } = req.body;

    if (!content || !episodeId || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      } as ApiResponse);
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        episodeId,
        userId,
        timestamp: timestamp || null,
        isDanmaku: isDanmaku || false,
      },
      include: {
        user: {
          include: {
            profile: {
              select: {
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: {
        id: comment.id,
        content: comment.content,
        timestamp: comment.timestamp || undefined,
        isDanmaku: comment.isDanmaku,
        user: {
          username: comment.user.username,
          avatarUrl: comment.user.profile?.avatarUrl || undefined,
        },
        createdAt: comment.createdAt,
      },
      message: 'Comment created successfully',
    } as ApiResponse<CommentData>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create comment',
    } as ApiResponse);
  }
});

export default router;

