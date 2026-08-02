import { User } from './users.model';
import jwt from 'jsonwebtoken';
import { AppError } from '../../utils/appError';
import { DEFAULT_JWT_SECRET } from '../../constants';

export class UserService {
  static async login(email: string, password: string) {
    const user = await User.findOne({ email }).select('+passwordHash');

    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || DEFAULT_JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
