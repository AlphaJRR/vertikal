import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { commentsService } from '../services/comments.service';
import { sendSuccess } from '../utils/response';
import { createCommentSchema } from '../utils/validators';
import { AppError } from '../middleware/errorHandler';

export class CommentsController {
  async getByShowId(req: Request, res: Response, next: NextFunction) {
    try {
      const { showId } = req.params;
      const { limit, offset } = req.query;
      const comments = await commentsService.getByShowId(
        showId,
        limit ? parseInt(limit as string, 10) : 50,
        offset ? parseInt(offset as string, 10) : 0
      );
      return sendSuccess(res, comments);
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        throw new AppError('Authentication required', 401);
      }

      const validated = createCommentSchema.parse(req.body);
      const comment = await commentsService.create(validated.showId, req.userId, validated.text);
      return sendSuccess(res, comment, 'Comment created successfully', 201);
    } catch (error) {
      if (error instanceof Error) {
        return next(new AppError(error.message, 400));
      }
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        throw new AppError('Authentication required', 401);
      }

      const { id } = req.params;
      await commentsService.delete(id, req.userId);
      return sendSuccess(res, null, 'Comment deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async like(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const comment = await commentsService.like(id);
      return sendSuccess(res, comment, 'Comment liked');
    } catch (error) {
      next(error);
    }
  }
}

export const commentsController = new CommentsController();


