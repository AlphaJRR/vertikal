import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export class CommentsService {
  async getByShowId(showId: string, limit: number = 50, offset: number = 0) {
    return prisma.comment.findMany({
      where: { showId },
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
      take: limit,
      skip: offset,
    });
  }

  async create(showId: string, userId: string, text: string) {
    // Verify show exists
    const show = await prisma.show.findUnique({
      where: { id: showId },
    });

    if (!show) {
      throw new AppError('Show not found', 404);
    }

    return prisma.comment.create({
      data: {
        showId,
        userId,
        text,
      },
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
    });
  }

  async delete(id: string, userId: string) {
    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    if (comment.userId !== userId) {
      throw new AppError('Unauthorized', 403);
    }

    return prisma.comment.delete({
      where: { id },
    });
  }

  async like(id: string) {
    return prisma.comment.update({
      where: { id },
      data: { likes: { increment: 1 } },
    });
  }
}

export const commentsService = new CommentsService();


