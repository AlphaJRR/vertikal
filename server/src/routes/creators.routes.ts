import { Router } from 'express';
import { creatorsController } from '../controllers/creators.controller';

const router = Router();

router.get('/', creatorsController.getAll.bind(creatorsController));
router.get('/:id', creatorsController.getById.bind(creatorsController));
router.get('/handle/:handle', creatorsController.getByHandle.bind(creatorsController));

export default router;


