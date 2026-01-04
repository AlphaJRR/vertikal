import { Router } from 'express';
import { showsController } from '../controllers/shows.controller';

const router = Router();

router.get('/', showsController.getAll.bind(showsController));
router.get('/:id', showsController.getById.bind(showsController));
router.get('/:id/related', showsController.getRelated.bind(showsController));
router.post('/', showsController.create.bind(showsController));
router.patch('/:id', showsController.update.bind(showsController));
router.post('/:id/like', showsController.like.bind(showsController));

export default router;


