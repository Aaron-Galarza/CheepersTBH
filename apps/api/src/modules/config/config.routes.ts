import { Router } from 'express';
import { ConfigController } from './config.controller';
import { protect, isAdmin } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { ConfigUpdateSchema } from './config.schema';

const router = Router();

router.get('/status', ConfigController.getStatus);

router.put('/update', protect, isAdmin, validateRequest(ConfigUpdateSchema), ConfigController.update);
router.put('/emergency', protect, isAdmin, ConfigController.toggleEmergency);
router.put('/schedule', protect, isAdmin, ConfigController.updateSchedule);
router.put('/banner', protect, isAdmin, ConfigController.updateBanner);

export default router;
