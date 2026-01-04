import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { tipsService } from '../services/tips.service';
import { sendSuccess } from '../utils/response';
import { createTipSchema } from '../utils/validators';
import { AppError } from '../middleware/errorHandler';

export class TipsController {
  async getByCreatorId(req: Request, res: Response, next: NextFunction) {
    try {
      const { creatorId } = req.params;
      const { limit, offset } = req.query;
      const tips = await tipsService.getByCreatorId(
        creatorId,
        limit ? parseInt(limit as string, 10) : 50,
        offset ? parseInt(offset as string, 10) : 0
      );
      return sendSuccess(res, tips);
    } catch (error) {
      next(error);
    }
  }

  async getByShowId(req: Request, res: Response, next: NextFunction) {
    try {
      const { showId } = req.params;
      const tips = await tipsService.getByShowId(showId);
      return sendSuccess(res, tips);
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        throw new AppError('Authentication required', 401);
      }

      const validated = createTipSchema.parse(req.body);
      const tip = await tipsService.create({
        ...validated,
        userId: req.userId,
      });
      return sendSuccess(res, tip, 'Tip created successfully', 201);
    } catch (error) {
      if (error instanceof Error) {
        return next(new AppError(error.message, 400));
      }
      next(error);
    }
  }

  async getTotalByCreator(req: Request, res: Response, next: NextFunction) {
    try {
      const { creatorId } = req.params;
      const stats = await tipsService.getTotalByCreator(creatorId);
      return sendSuccess(res, stats);
    } catch (error) {
      next(error);
    }
  }
}

export const tipsController = new TipsController();


