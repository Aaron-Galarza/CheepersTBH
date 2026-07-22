import { Router } from 'express';
import usersRoutes from '../modules/users/users.routes';
import productsRoutes from '../modules/products/products.routes';
import categoriesRoutes from '../modules/categories/categories.routes';
import additionalsRoutes from '../modules/additionals/additionals.routes';
import ordersRoutes from '../modules/orders/orders.routes';
import couponsRoutes from '../modules/coupons/coupons.routes';
import configRoutes from '../modules/config/config.routes';
import { protect, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.use('/users', usersRoutes);

// Protected routes (require auth)
router.use('/products', protect, productsRoutes);
router.use('/categories', protect, categoriesRoutes);
router.use('/additionals', protect, additionalsRoutes);
router.use('/orders', protect, ordersRoutes);
router.use('/coupons', protect, couponsRoutes);
router.use('/config', protect, isAdmin, configRoutes);

export default router;
