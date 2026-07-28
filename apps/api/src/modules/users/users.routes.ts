import { Router } from 'express';
import { UsersController } from './users.controller';
import { validateRequest } from '../../middlewares/validate.middleware';
import { UserLoginSchema, UserCreateSchema } from './users.schema';

const router = Router();

router.post('/login', validateRequest(UserLoginSchema), UsersController.login);
router.post('/register', validateRequest(UserCreateSchema), UsersController.register);

export default router;
