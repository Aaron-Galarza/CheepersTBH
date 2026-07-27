import { Router } from 'express';
import { CategoriaController } from './categories.controller';
import { validateRequest } from '../../middlewares/validate.middleware';
import { CategoriaCreateSchema, CategoriaUpdateSchema } from './categories.schema';

const router = Router();

router.get('/', CategoriaController.getAll);
router.get('/active', CategoriaController.getActive);
router.get('/:id', CategoriaController.getById);
router.post('/', validateRequest(CategoriaCreateSchema), CategoriaController.create);
router.patch('/:id', validateRequest(CategoriaUpdateSchema), CategoriaController.update);
router.patch('/:id/toggle', CategoriaController.toggleActive);
router.delete('/:id', CategoriaController.delete);

export default router;
