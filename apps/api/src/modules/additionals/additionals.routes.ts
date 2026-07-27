import { Router } from 'express';
import { AdicionalController } from './additionals.controller';
import { validateRequest } from '../../middlewares/validate.middleware';
import { AdicionalCreateSchema, AdicionalUpdateSchema } from './additionals.schema';

const router = Router();

router.get('/', AdicionalController.getAll);
router.get('/active', AdicionalController.getActive);
router.get('/:id', AdicionalController.getById);
router.post('/', validateRequest(AdicionalCreateSchema), AdicionalController.create);
router.patch('/:id', validateRequest(AdicionalUpdateSchema), AdicionalController.update);
router.patch('/:id/toggle', AdicionalController.toggleActive);
router.delete('/:id', AdicionalController.delete);

export default router;
