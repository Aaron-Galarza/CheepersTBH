import { Router } from 'express';
import { CouponController } from './coupons.controller';
import { validateRequest } from '../../middlewares/validate.middleware';
import { CouponCreateSchema, CouponUpdateSchema } from './coupons.schema';

const router = Router();

router.get('/', CouponController.getAll);
router.get('/active', CouponController.getActive);
router.get('/:id', CouponController.getById);
router.post('/', validateRequest(CouponCreateSchema), CouponController.create);
router.patch('/:id', validateRequest(CouponUpdateSchema), CouponController.update);
router.patch('/:id/toggle', CouponController.toggleActive);
router.delete('/:id', CouponController.delete);

export default router;
