import { Request, Response } from 'express';
import { UserService } from './users.service';
import { asyncHandler } from '../../utils/asyncHandler';

export class UsersController {
  static login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await UserService.login(email, password);
    res.json({
      success: true,
      data: result,
    });
  });

  static register = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await UserService.createUser(email, password);
    res.status(201).json({
      success: true,
      data: user,
    });
  });
}
