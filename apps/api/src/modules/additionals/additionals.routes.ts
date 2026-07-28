import { Router } from 'express';
import { AdditionalsController } from './additionals.controller';
import { protect, isAdmin } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { AdicionalCreateSchema, AdicionalUpdateSchema } from './additionals.schema';

const router = Router();

router.get('/', AdditionalsController.getPublic);

router.get('/admin/all', protect, isAdmin, AdditionalsController.getAll);
router.post('/admin', protect, isAdmin, validateRequest(AdicionalCreateSchema), AdditionalsController.create);
router.put('/admin/:id', protect, isAdmin, validateRequest(AdicionalUpdateSchema), AdditionalsController.update);
router.patch('/admin/:id/toggle', protect, isAdmin, AdditionalsController.toggleActive);
router.delete('/admin/:id', protect, isAdmin, AdditionalsController.delete);

export default router;
