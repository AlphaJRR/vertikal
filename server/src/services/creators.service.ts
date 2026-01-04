import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export class CreatorsService {
  async getAll() {
    return prisma.creator.findMany({
      include: {
        shows: {
          take: 5,
          orderBy: { publishedAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: string) {
    const creator = await prisma.creator.findUnique({
      where: { id },
      include: {
        shows: {
          orderBy: { publishedAt: 'desc' },
        },
      },
    });

    if (!creator) {
      throw new AppError('Creator not found', 404);
    }

    return creator;
  }

  async getByHandle(handle: string) {
    const creator = await prisma.creator.findUnique({
      where: { handle },
      include: {
        shows: {
          orderBy: { publishedAt: 'desc' },
        },
      },
    });

    if (!creator) {
      throw new AppError('Creator not found', 404);
    }

    return creator;
  }

  async getByUserId(userId: string) {
    const creator = await prisma.creator.findUnique({
      where: { userId },
      include: {
        shows: {
          orderBy: { publishedAt: 'desc' },
        },
      },
    });

    if (!creator) {
      throw new AppError('Creator not found', 404);
    }

    return creator;
  }

  async update(id: string, data: Partial<{
    name: string;
    handle: string;
    avatar: string;
    bio: string;
    company: string;
    role: string;
    stats: any;
  }>) {
    return prisma.creator.update({
      where: { id },
      data,
    });
  }
}

export const creatorsService = new CreatorsService();


