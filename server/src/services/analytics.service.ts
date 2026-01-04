import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export class AnalyticsService {
  async track(data: {
    showId: string;
    eventType: 'play' | 'pause' | 'complete' | 'scrub' | 'quartile';
    data?: any;
  }) {
    // Verify show exists
    const show = await prisma.show.findUnique({
      where: { id: data.showId },
    });

    if (!show) {
      throw new AppError('Show not found', 404);
    }

    return prisma.analytics.create({
      data: {
        showId: data.showId,
        eventType: data.eventType,
        data: data.data || {},
      },
    });
  }

  async getByShowId(showId: string, eventType?: string) {
    const where: any = { showId };
    if (eventType) {
      where.eventType = eventType;
    }

    return prisma.analytics.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 1000,
    });
  }

  async getStats(showId: string) {
    const [plays, pauses, completes, scrubs, quartiles] = await Promise.all([
      prisma.analytics.count({ where: { showId, eventType: 'play' } }),
      prisma.analytics.count({ where: { showId, eventType: 'pause' } }),
      prisma.analytics.count({ where: { showId, eventType: 'complete' } }),
      prisma.analytics.count({ where: { showId, eventType: 'scrub' } }),
      prisma.analytics.count({ where: { showId, eventType: 'quartile' } }),
    ]);

    return {
      plays,
      pauses,
      completes,
      scrubs,
      quartiles,
    };
  }
}

export const analyticsService = new AnalyticsService();


