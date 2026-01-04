import { Request, Response, NextFunction } from 'express';
import { analyticsService } from '../services/analytics.service';
import { sendSuccess } from '../utils/response';
import { createAnalyticsSchema } from '../utils/validators';
import { AppError } from '../middleware/errorHandler';

export class AnalyticsController {
  async track(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createAnalyticsSchema.parse(req.body);
      const analytics = await analyticsService.track(validated);
      return sendSuccess(res, analytics, 'Analytics tracked', 201);
    } catch (error) {
      if (error instanceof Error) {
        return next(new AppError(error.message, 400));
      }
      next(error);
    }
  }

  async getByShowId(req: Request, res: Response, next: NextFunction) {
    try {
      const { showId } = req.params;
      const { eventType } = req.query;
      const analytics = await analyticsService.getByShowId(showId, eventType as string);
      return sendSuccess(res, analytics);
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { showId } = req.params;
      const stats = await analyticsService.getStats(showId);
      return sendSuccess(res, stats);
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();


