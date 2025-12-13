/**
 * Messages/DM Routes
 * Handles direct messaging with role-based permissions
 * Only CREATOR and PRODUCTION roles can send DMs
 */

import express from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

// GET /api/messages - Get all messages for current user
router.get('/', async (req, res) => {
  try {
    const userId = req.headers['user-id'] as string; // TODO: Get from auth token
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            role: true,
            profile: {
              select: {
                avatarUrl: true,
                displayName: true,
              },
            },
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            role: true,
            profile: {
              select: {
                avatarUrl: true,
                displayName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ 
      error: 'Failed to fetch messages',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// GET /api/messages/conversation/:userId - Get conversation with specific user
router.get('/conversation/:userId', async (req, res) => {
  try {
    const currentUserId = req.headers['user-id'] as string; // TODO: Get from auth token
    const otherUserId = req.params.userId;

    if (!currentUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: currentUserId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                avatarUrl: true,
                displayName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ 
      error: 'Failed to fetch conversation',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// POST /api/messages/send - Send a message
router.post('/send', async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    if (!senderId || !receiverId || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // ⛔️ HARD STOP: Check if sender has permission to send DMs
    const sender = await prisma.user.findUnique({ 
      where: { id: senderId },
      select: { role: true },
    });

    if (!sender) {
      return res.status(404).json({ error: 'Sender not found' });
    }

    // Only CREATOR and PRODUCTION can send DMs
    if (sender.role !== 'CREATOR' && sender.role !== 'PRODUCTION') {
      return res.status(403).json({ 
        error: 'Viewers cannot send direct messages. Please use public comments.',
        code: 'DM_PERMISSION_DENIED'
      });
    }

    // Verify receiver exists
    const receiver = await prisma.user.findUnique({ 
      where: { id: receiverId },
      select: { id: true },
    });

    if (!receiver) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                avatarUrl: true,
                displayName: true,
              },
            },
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                avatarUrl: true,
                displayName: true,
              },
            },
          },
        },
      },
    });

    res.json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ 
      error: 'Failed to send message',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// PUT /api/messages/:id/read - Mark message as read
router.put('/:id/read', async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.headers['user-id'] as string; // TODO: Get from auth token

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const message = await prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
    });

    res.json(message);
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ 
      error: 'Failed to mark message as read',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;

