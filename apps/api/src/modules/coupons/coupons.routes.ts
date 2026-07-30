import { Router } from 'express';
import { CouponsController } from './coupons.controller';
import { protect, isAdmin } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { CouponCreateSchema, CouponUpdateSchema } from './coupons.schema';

const router = Router();

// Público: validar cupón
router.post('/validate', CouponsController.validate);

// Admin
router.get('/admin', protect, isAdmin, CouponsController.getAll);
router.post('/admin', protect, isAdmin, validateRequest(CouponCreateSchema), CouponsController.create);
router.put('/admin/:id', protect, isAdmin, validateRequest(CouponUpdateSchema), CouponsController.update);
router.patch('/admin/:id/toggle', protect, isAdmin, CouponsController.toggleActive);
router.delete('/admin/:id', protect, isAdmin, CouponsController.delete);

export default router;
