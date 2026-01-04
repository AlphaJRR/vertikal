import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller';

const router = Router();

router.post('/track', analyticsController.track.bind(analyticsController));
router.get('/show/:showId', analyticsController.getByShowId.bind(analyticsController));
router.get('/show/:showId/stats', analyticsController.getStats.bind(analyticsController));

export default router;


