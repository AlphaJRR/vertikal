import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export class ShowsService {
  async getAll(filters?: {
    creatorId?: string;
    tags?: string[];
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};

    if (filters?.creatorId) {
      where.creatorId = filters.creatorId;
    }

    if (filters?.tags && filters.tags.length > 0) {
      where.tags = {
        hasSome: filters.tags,
      };
    }

    return prisma.show.findMany({
      where,
      include: {
        creator: true,
        _count: {
          select: {
            comments: true,
            tips: true,
          },
        },
      },
      orderBy: { publishedAt: 'desc' },
      take: filters?.limit || 50,
      skip: filters?.offset || 0,
    });
  }

  async getById(id: string) {
    const show = await prisma.show.findUnique({
      where: { id },
      include: {
        creator: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                displayName: true,
                handle: true,
                profilePicture: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
        _count: {
          select: {
            comments: true,
            tips: true,
          },
        },
      },
    });

    if (!show) {
      throw new AppError('Show not found', 404);
    }

    // Increment views
    await prisma.show.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return show;
  }

  async getRelated(showId: string, limit: number = 6) {
    const show = await prisma.show.findUnique({
      where: { id: showId },
      select: { tags: true },
    });

    if (!show) {
      throw new AppError('Show not found', 404);
    }

    return prisma.show.findMany({
      where: {
        id: { not: showId },
        tags: {
          hasSome: show.tags,
        },
      },
      include: {
        creator: {
          select: {
            name: true,
            handle: true,
          },
        },
      },
      take: limit,
      orderBy: { views: 'desc' },
    });
  }

  async create(data: {
    title: string;
    series?: string;
    creatorId: string;
    thumbnail: string;
    videoUrl?: string;
    description?: string;
    tags?: string[];
    duration?: number;
    episode?: number;
    season?: number;
    publishedAt?: Date;
  }) {
    // Get creator info
    const creator = await prisma.creator.findUnique({
      where: { id: data.creatorId },
    });

    if (!creator) {
      throw new AppError('Creator not found', 404);
    }

    return prisma.show.create({
      data: {
        ...data,
        creatorHandle: creator.handle,
        creatorAvatar: creator.avatar || undefined,
        publishedAt: data.publishedAt || new Date(),
      },
      include: {
        creator: true,
      },
    });
  }

  async update(id: string, data: Partial<{
    title: string;
    series: string;
    thumbnail: string;
    videoUrl: string;
    description: string;
    tags: string[];
    duration: number;
    episode: number;
    season: number;
  }>) {
    return prisma.show.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.show.delete({
      where: { id },
    });
  }

  async like(id: string) {
    return prisma.show.update({
      where: { id },
      data: { likes: { increment: 1 } },
    });
  }
}

export const showsService = new ShowsService();


