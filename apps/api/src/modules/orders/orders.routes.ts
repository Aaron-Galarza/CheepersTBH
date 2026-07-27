import { Router } from 'express';
import { OrdersController } from './orders.controller';
import { validateRequest } from '../../middlewares/validate.middleware';
import { OrderCreateSchema, OrderUpdateSchema } from './orders.schema';

const router = Router();

router.get('/', OrdersController.getAll);
router.get('/:id', OrdersController.getById);
router.post('/', validateRequest(OrderCreateSchema), OrdersController.create);
router.patch('/:id', validateRequest(OrderUpdateSchema), OrdersController.update);
router.delete('/:id', OrdersController.delete);

export default router;
