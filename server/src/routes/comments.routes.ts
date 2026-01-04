import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { commentsController } from '../controllers/comments.controller';

const router = Router();

router.get('/show/:showId', commentsController.getByShowId.bind(commentsController));
router.post('/', authenticate, commentsController.create.bind(commentsController));
router.delete('/:id', authenticate, commentsController.delete.bind(commentsController));
router.post('/:id/like', commentsController.like.bind(commentsController));

export default router;


