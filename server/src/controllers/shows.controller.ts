import { Request, Response, NextFunction } from 'express';
import { showsService } from '../services/shows.service';
import { sendSuccess } from '../utils/response';
import { createShowSchema, updateShowSchema } from '../utils/validators';
import { AppError } from '../middleware/errorHandler';

export class ShowsController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { creatorId, tags, limit, offset } = req.query;
      const shows = await showsService.getAll({
        creatorId: creatorId as string,
        tags: tags ? (Array.isArray(tags) ? tags as string[] : [tags as string]) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        offset: offset ? parseInt(offset as string, 10) : undefined,
      });
      return sendSuccess(res, shows);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const show = await showsService.getById(id);
      return sendSuccess(res, show);
    } catch (error) {
      next(error);
    }
  }

  async getRelated(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { limit } = req.query;
      const shows = await showsService.getRelated(id, limit ? parseInt(limit as string, 10) : 6);
      return sendSuccess(res, shows);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createShowSchema.parse(req.body);
      const show = await showsService.create(validated);
      return sendSuccess(res, show, 'Show created successfully', 201);
    } catch (error) {
      if (error instanceof Error) {
        return next(new AppError(error.message, 400));
      }
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validated = updateShowSchema.parse(req.body);
      const show = await showsService.update(id, validated);
      return sendSuccess(res, show, 'Show updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async like(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const show = await showsService.like(id);
      return sendSuccess(res, show, 'Show liked');
    } catch (error) {
      next(error);
    }
  }
}

export const showsController = new ShowsController();


