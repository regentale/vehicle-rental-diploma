import { Router } from 'express';
import { body, query } from 'express-validator';
import { ReviewService } from '../services/review.service';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();
const reviewService = new ReviewService();

// Create review
router.post(
  '/',
  authenticate,
  validate([
    body('vehicleId').isUUID(),
    body('bookingId').isUUID(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').optional().trim()
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      const review = await reviewService.createReview(req.user!.id, req.body);
      res.status(201).json(review);
    } catch (error: any) {
      next(error);
    }
  }
);

// Get vehicle reviews
router.get(
  '/vehicle/:vehicleId',
  validate([
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 })
  ]),
  async (req, res, next) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;

      const result = await reviewService.getVehicleReviews(
        req.params.vehicleId,
        page,
        limit
      );
      res.json(result);
    } catch (error: any) {
      next(error);
    }
  }
);

// Update review
router.put(
  '/:id',
  authenticate,
  validate([
    body('rating').optional().isInt({ min: 1, max: 5 }),
    body('comment').optional().trim()
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      const review = await reviewService.updateReview(
        req.params.id,
        req.user!.id,
        req.body
      );
      res.json(review);
    } catch (error: any) {
      next(error);
    }
  }
);

// Delete review
router.delete('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const result = await reviewService.deleteReview(req.params.id, req.user!.id);
    res.json(result);
  } catch (error: any) {
    next(error);
  }
});

export default router;
