import { AuthService } from '../src/services/auth.service';
import { db } from '../src/utils/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../src/utils/database', () => ({
  db: {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  }
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const mockUserData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      (db.findOne as jest.Mock).mockReturnValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (db.create as jest.Mock).mockReturnValue({
        id: '1',
        ...mockUserData,
        password: 'hashedPassword',
      });
      (jwt.sign as jest.Mock).mockReturnValue('mockedToken');

      const result = await authService.register(mockUserData);

      expect(db.findOne).toHaveBeenCalledWith('users', { email: mockUserData.email });
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUserData.password, 10);
      expect(db.create).toHaveBeenCalled();
      expect(result).toHaveProperty('token', 'mockedToken');
      expect(result.user).not.toHaveProperty('password');
      expect(result.user.email).toBe(mockUserData.email);
    });

    it('should throw an error if the user already exists', async () => {
      (db.findOne as jest.Mock).mockReturnValue({ email: 'test@example.com' });

      await expect(
        authService.register({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        })
      ).rejects.toThrow('User with this email already exists');
    });
  });

  describe('login', () => {
    it('should successfully log a user in', async () => {
        (db.findOne as jest.Mock).mockReturnValue({
            id: '1',
            email: 'test@example.com',
            password: 'hashedPassword',
            isActive: true
        });
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (jwt.sign as jest.Mock).mockReturnValue('mockedToken');

        const result = await authService.login('test@example.com', 'password123');

        expect(result).toHaveProperty('token', 'mockedToken');
        expect(result.user).not.toHaveProperty('password');
    });

    it('should throw error on invalid password', async () => {
        (db.findOne as jest.Mock).mockReturnValue({
            id: '1',
            email: 'test@example.com',
            password: 'hashedPassword',
            isActive: true
        });
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        await expect(authService.login('test@example.com', 'wrongpassword'))
            .rejects.toThrow('Invalid credentials');
    });
  });
});
