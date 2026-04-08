import { Router } from 'express';
import { body } from 'express-validator';
import { AuthService } from '../services/auth.service';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();
const authService = new AuthService();

// Register
router.post(
  '/register',
  validate([
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
    body('phone').optional().isMobilePhone('any')
  ]),
  async (req, res, next) => {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      next(error);
    }
  }
);

// Login
router.post(
  '/login',
  validate([
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ]),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json(result);
    } catch (error: any) {
      next(error);
    }
  }
);

// Get profile
router.get('/profile', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const profile = await authService.getProfile(req.user!.id);
    res.json(profile);
  } catch (error: any) {
    next(error);
  }
});

// Update profile
router.put(
  '/profile',
  authenticate,
  validate([
    body('firstName').optional().trim().notEmpty(),
    body('lastName').optional().trim().notEmpty(),
    body('phone').optional().isMobilePhone('any')
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      const user = await authService.updateProfile(req.user!.id, req.body);
      res.json(user);
    } catch (error: any) {
      next(error);
    }
  }
);

// Change password
router.post(
  '/change-password',
  authenticate,
  validate([
    body('oldPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 })
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const result = await authService.changePassword(req.user!.id, oldPassword, newPassword);
      res.json(result);
    } catch (error: any) {
      next(error);
    }
  }
);

export default router;
