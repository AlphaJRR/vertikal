import { Router } from 'express';
import { prisma } from '../lib/prisma';
import type { ApiResponse } from '../types';

const router = Router();

// GET /api/subscriptions/user/:userId - Get user's subscriptions
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId,
        status: 'ACTIVE',
      },
      include: {
        creator: {
          include: {
            user: {
              select: { username: true },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      data: subscriptions,
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subscriptions',
    } as ApiResponse);
  }
});

// POST /api/subscriptions - Create subscription ($4.99/mo)
router.post('/', async (req, res) => {
  try {
    const { userId, creatorId, stripeSubId } = req.body;

    if (!userId || !creatorId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      } as ApiResponse);
    }

    // Calculate expiration (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        creatorId,
        status: 'ACTIVE',
        expiresAt,
        stripeSubId: stripeSubId || null,
      },
      include: {
        creator: true,
      },
    });

    res.status(201).json({
      success: true,
      data: subscription,
      message: 'Subscription created successfully',
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create subscription',
    } as ApiResponse);
  }
});

export default router;

