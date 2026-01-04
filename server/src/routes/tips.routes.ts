import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { tipsController } from '../controllers/tips.controller';

const router = Router();

router.get('/creator/:creatorId', tipsController.getByCreatorId.bind(tipsController));
router.get('/show/:showId', tipsController.getByShowId.bind(tipsController));
router.get('/creator/:creatorId/total', tipsController.getTotalByCreator.bind(tipsController));
router.post('/', authenticate, tipsController.create.bind(tipsController));

export default router;


