import { Router } from 'express';
import { ConfigController } from './config.controller';
import { validateRequest } from '../../middlewares/validate.middleware';
import { ConfigUpdateSchema } from './config.schema';

const router = Router();

router.get('/', ConfigController.getConfig);
router.patch('/', validateRequest(ConfigUpdateSchema), ConfigController.updateConfig);

export default router;
