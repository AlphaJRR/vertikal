import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export class TipsService {
  async getByCreatorId(creatorId: string, limit: number = 50, offset: number = 0) {
    return prisma.tip.findMany({
      where: { creatorId },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            handle: true,
          },
        },
        show: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async getByShowId(showId: string) {
    return prisma.tip.findMany({
      where: { showId },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            handle: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    showId?: string;
    creatorId: string;
    userId: string;
    amount: number;
    message?: string;
  }) {
    // Verify creator exists
    const creator = await prisma.creator.findUnique({
      where: { id: data.creatorId },
    });

    if (!creator) {
      throw new AppError('Creator not found', 404);
    }

    // Verify show exists if provided
    if (data.showId) {
      const show = await prisma.show.findUnique({
        where: { id: data.showId },
      });

      if (!show) {
        throw new AppError('Show not found', 404);
      }
    }

    return prisma.tip.create({
      data: {
        showId: data.showId,
        creatorId: data.creatorId,
        userId: data.userId,
        amount: data.amount,
        message: data.message,
      },
      include: {
        creator: {
          select: {
            name: true,
            handle: true,
          },
        },
        show: {
          select: {
            title: true,
          },
        },
      },
    });
  }

  async getTotalByCreator(creatorId: string) {
    const result = await prisma.tip.aggregate({
      where: { creatorId },
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    });

    return {
      total: result._sum.amount || 0,
      count: result._count.id,
    };
  }
}

export const tipsService = new TipsService();


