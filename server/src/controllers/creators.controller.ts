import { Request, Response, NextFunction } from 'express';
import { creatorsService } from '../services/creators.service';
import { sendSuccess, sendError } from '../utils/response';
import { AppError } from '../middleware/errorHandler';

export class CreatorsController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const creators = await creatorsService.getAll();
      return sendSuccess(res, creators);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const creator = await creatorsService.getById(id);
      return sendSuccess(res, creator);
    } catch (error) {
      next(error);
    }
  }

  async getByHandle(req: Request, res: Response, next: NextFunction) {
    try {
      const { handle } = req.params;
      const creator = await creatorsService.getByHandle(handle);
      return sendSuccess(res, creator);
    } catch (error) {
      next(error);
    }
  }
}

export const creatorsController = new CreatorsController();


