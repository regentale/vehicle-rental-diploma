import { db } from '../utils/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthService {
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: string;
  }) {
    const existingUser = db.findOne('users', { email: data.email });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = db.create('users', {
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: data.role || 'CLIENT',
      avatar: null,
      isVerified: false,
      isActive: true,
    });

    const { password: _, ...userWithoutPassword } = user;
    const token = this.generateToken(user.id);

    return { user: userWithoutPassword, token };
  }

  async login(email: string, password: string) {
    const user = db.findOne('users', { email });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user.id);
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async getProfile(userId: string) {
    const user = db.findById('users', userId);

    if (!user) {
      throw new Error('User not found');
    }

    const vehicles = db.findMany('vehicles', { ownerId: userId });
    const bookings = db.findMany('bookings', { userId });
    const reviews = db.findMany('reviews', { userId });

    const { password: _, ...userWithoutPassword } = user;

    return {
      ...userWithoutPassword,
      _count: {
        vehicles: vehicles.length,
        bookings: bookings.length,
        reviews: reviews.length,
      },
    };
  }

  async updateProfile(userId: string, data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
  }) {
    const user = db.update('users', userId, data);

    if (!user) {
      throw new Error('User not found');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = db.findById('users', userId);

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    db.update('users', userId, { password: hashedPassword });

    return { message: 'Password changed successfully' };
  }

  private generateToken(userId: string): string {
    const secret = process.env.JWT_SECRET || 'default-secret-key';
    return jwt.sign({ userId }, secret, { expiresIn: '7d' });
  }
}
