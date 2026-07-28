import { Router } from 'express';
import { OrdersController } from './orders.controller';
import { protect, isAdmin } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { CreateOrderSchema } from './orders.schema';

const router = Router();

router.get('/admin/all', protect, isAdmin, OrdersController.getAllOrders);
router.get('/admin/status/:status', protect, isAdmin, OrdersController.getOrdersByStatus);
router.put('/admin/:id/status', protect, isAdmin, OrdersController.updateOrderStatus);
router.put('/admin/:id/delivery-cost', protect, isAdmin, OrdersController.updateDeliveryCost);

router.post('/', validateRequest(CreateOrderSchema), OrdersController.createOrder);
router.get('/:id', OrdersController.getOrder);

export default router;
