import { Router } from 'express';
import { body, query } from 'express-validator';
import { BookingService } from '../services/booking.service';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();
const bookingService = new BookingService();

// Create booking
router.post(
  '/',
  authenticate,
  validate([
    body('vehicleId').isUUID(),
    body('startDate').isISO8601(),
    body('endDate').isISO8601(),
    body('pickupLocation').trim().notEmpty()
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      const booking = await bookingService.createBooking(req.user!.id, {
        ...req.body,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate)
      });
      res.status(201).json(booking);
    } catch (error: any) {
      next(error);
    }
  }
);

// Get user bookings
router.get(
  '/',
  authenticate,
  validate([
    query('status').optional().isIn(['PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 })
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      const filters = {
        status: req.query.status as any,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10
      };

      const result = await bookingService.getBookings(req.user!.id, filters);
      res.json(result);
    } catch (error: any) {
      next(error);
    }
  }
);

// Get booking by ID
router.get('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id, req.user!.id);
    res.json(booking);
  } catch (error: any) {
    next(error);
  }
});

// Update booking status
router.patch(
  '/:id/status',
  authenticate,
  validate([
    body('status').isIn(['PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED'])
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      const booking = await bookingService.updateBookingStatus(
        req.params.id,
        req.body.status,
        req.user!.id
      );
      res.json(booking);
    } catch (error: any) {
      next(error);
    }
  }
);

// Cancel booking
router.post('/:id/cancel', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const booking = await bookingService.cancelBooking(req.params.id, req.user!.id);
    res.json(booking);
  } catch (error: any) {
    next(error);
  }
});

export default router;
