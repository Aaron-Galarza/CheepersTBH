import { Router } from 'express';
import { ProductsController } from './products.controller';
import { protect, isAdmin } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { ProductCreateSchema, ProductUpdateSchema } from './products.schema';

const router = Router();

router.get('/', ProductsController.getPublic);

router.get('/admin/all', protect, isAdmin, ProductsController.getAll);
router.get('/admin/:id', protect, isAdmin, ProductsController.getById);
router.post('/admin', protect, isAdmin, validateRequest(ProductCreateSchema), ProductsController.create);
router.put('/admin/:id', protect, isAdmin, validateRequest(ProductUpdateSchema), ProductsController.update);
router.put('/admin/:id/toggleActive', protect, isAdmin, ProductsController.toggleActive);
router.delete('/admin/:id', protect, isAdmin, ProductsController.delete);

export default router;
