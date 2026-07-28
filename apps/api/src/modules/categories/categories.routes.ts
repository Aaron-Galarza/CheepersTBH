import { Router } from 'express';
import { CategoriesController } from './categories.controller';
import { protect, isAdmin } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { CategoriaCreateSchema, CategoriaUpdateSchema } from './categories.schema';

const router = Router();

router.get('/', CategoriesController.getPublic);

router.get('/admin/all', protect, isAdmin, CategoriesController.getAll);
router.post('/admin', protect, isAdmin, validateRequest(CategoriaCreateSchema), CategoriesController.create);
router.put('/admin/:id', protect, isAdmin, validateRequest(CategoriaUpdateSchema), CategoriesController.update);
router.put('/admin/:id/toggleActive', protect, isAdmin, CategoriesController.toggleActive);
router.delete('/admin/:id', protect, isAdmin, CategoriesController.delete);

export default router;
