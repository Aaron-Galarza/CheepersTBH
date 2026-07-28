import { Router } from 'express';
import { BannersController } from './banners.controller';
import { protect, isAdmin } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { BannerCreateSchema, BannerUpdateSchema } from './banners.schema';

const router = Router();

router.get('/', BannersController.getPublic);

router.get('/admin/all', protect, isAdmin, BannersController.getAll);
router.post('/admin', protect, isAdmin, validateRequest(BannerCreateSchema), BannersController.create);
router.put('/admin/:id', protect, isAdmin, validateRequest(BannerUpdateSchema), BannersController.update);
router.put('/admin/:id/toggleActive', protect, isAdmin, BannersController.toggleActive);
router.delete('/admin/:id', protect, isAdmin, BannersController.delete);

export default router;
