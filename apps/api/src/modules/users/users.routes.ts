import { Router } from 'express';
import { UsersController } from './users.controller';
import { validateRequest } from '../../middlewares/validate.middleware';
import { UserLoginSchema } from './users.schema';

const router = Router();

router.post('/login', validateRequest(UserLoginSchema), UsersController.login);

export default router;
