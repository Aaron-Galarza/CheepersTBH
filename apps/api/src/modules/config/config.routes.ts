import { Router } from 'express';
import { ConfigController } from './config.controller';
import { protect, isAdmin } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/status', ConfigController.getStatus);

router.patch('/emergency', protect, isAdmin, ConfigController.toggleEmergency);
router.put('/emergency-message', protect, isAdmin, ConfigController.updateEmergencyMessage);
router.put('/schedule', protect, isAdmin, ConfigController.updateSchedule);
router.put('/banner', protect, isAdmin, ConfigController.updateBanner);

export default router;
