import { User } from './users.model';
import jwt from 'jsonwebtoken';

export class UserService {
  static async login(email: string, password: string) {
    const user = await User.findOne({ email }).select('+passwordHash');

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
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

  static async createUser(email: string, password: string) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }

    const user = new User({
      email,
      passwordHash: password,
      role: 'admin',
    });

    await user.save();

    return {
      _id: user._id,
      email: user.email,
      role: user.role,
    };
  }
}
