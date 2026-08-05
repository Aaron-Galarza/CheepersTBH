import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { protect, isAdmin } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/admin', protect, isAdmin, AnalyticsController.getStats);

export default router;
