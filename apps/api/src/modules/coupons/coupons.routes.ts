import { Router } from 'express';
import { CouponsController } from './coupons.controller';
import { protect, isAdmin } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { CouponCreateSchema, CouponUpdateSchema } from './coupons.schema';

const router = Router();

router.post('/validate', CouponsController.validate);

router.get('/', protect, isAdmin, CouponsController.getAll);
router.get('/:id', protect, isAdmin, CouponsController.getById);
router.post('/', protect, isAdmin, validateRequest(CouponCreateSchema), CouponsController.create);
router.patch('/:id', protect, isAdmin, validateRequest(CouponUpdateSchema), CouponsController.modify);
router.patch('/:id/toggle', protect, isAdmin, CouponsController.toggleActive);
router.delete('/:id', protect, isAdmin, CouponsController.deleteById);

export default router;
