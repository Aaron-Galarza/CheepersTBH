import { Router } from 'express';
import { ProductsController } from './products.controller';
import { validateRequest } from '../../middlewares/validate.middleware';
import { ProductCreateSchema, ProductUpdateSchema } from './products.schema';

const router = Router();

router.get('/', ProductsController.getAll);
router.get('/active', ProductsController.getActive);
router.get('/:id', ProductsController.getById);
router.post('/', validateRequest(ProductCreateSchema), ProductsController.create);
router.patch('/:id', validateRequest(ProductUpdateSchema), ProductsController.update);
router.patch('/:id/toggle', ProductsController.toggleActive);
router.delete('/:id', ProductsController.delete);

export default router;
