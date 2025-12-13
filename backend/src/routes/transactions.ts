import { Router } from 'express';
import { prisma } from '../lib/prisma';
import type { ApiResponse } from '../types';

const router = Router();

// GET /api/transactions/user/:userId - Get user's transaction history
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      include: {
        sender: {
          select: { username: true },
        },
        receiver: {
          select: { username: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json({
      success: true,
      data: transactions,
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions',
    } as ApiResponse);
  }
});

// POST /api/transactions/coins - Purchase coins (for $150 balance)
router.post('/coins', async (req, res) => {
  try {
    const { userId, amount } = req.body; // amount in cents (e.g., 15000 = $150)

    if (!userId || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      } as ApiResponse);
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        type: 'COIN_PURCHASE',
        status: 'COMPLETED',
        senderId: userId,
      },
    });

    // Update user coin balance
    await prisma.user.update({
      where: { id: userId },
      data: {
        coinBalance: {
          increment: amount,
        },
      },
    });

    res.status(201).json({
      success: true,
      data: transaction,
      message: 'Coins purchased successfully',
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to process coin purchase',
    } as ApiResponse);
  }
});

export default router;

