import { Router } from 'express';
import { db } from '../utils/database';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.middleware';
import { query } from 'express-validator';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// Get dashboard statistics
router.get('/dashboard', authenticate, authorize('ADMIN'), async (_req: AuthRequest, res, next): Promise<void> => {
  try {
    const users = db.findAll('users');
    const vehicles = db.findAll('vehicles');
    const bookings = db.findAll('bookings');
    const payments = db.findMany('payments', { status: 'COMPLETED' });

    const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);

    const recentBookings = bookings
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map(booking => {
        const user = db.findById('users', booking.userId);
        const vehicle = db.findById('vehicles', booking.vehicleId);
        const payment = db.findOne('payments', { bookingId: booking.id });

        return {
          ...booking,
          user: user ? {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
          } : null,
          vehicle: vehicle ? {
            id: vehicle.id,
            brand: vehicle.brand,
            model: vehicle.model,
            type: vehicle.type
          } : null,
          payment
        };
      });

    const vehiclesWithStats = vehicles.map(v => {
      const vehicleBookings = db.findMany('bookings', { vehicleId: v.id });
      const reviews = db.findMany('reviews', { vehicleId: v.id });
      const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      return {
        ...v,
        bookingCount: vehicleBookings.length,
        averageRating: avgRating
      };
    });

    const popularVehicles = vehiclesWithStats
      .sort((a, b) => b.bookingCount - a.bookingCount)
      .slice(0, 5);

    const stats = {
      totalUsers: users.length,
      totalVehicles: vehicles.length,
      totalBookings: bookings.length,
      totalRevenue,
      recentBookings,
      popularVehicles
    };

    res.json(stats);
  } catch (error: any) {
    next(error);
  }
});

// Get all users
router.get(
  '/users',
  authenticate,
  authorize('ADMIN'),
  validate([
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('role').optional().isIn(['CLIENT', 'OWNER', 'ADMIN'])
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const skip = (page - 1) * limit;

      let users = db.findAll('users');

      if (req.query.role) {
        users = users.filter(u => u.role === req.query.role);
      }

      const total = users.length;
      const paginatedUsers = users.slice(skip, skip + limit);

      const usersWithCounts = paginatedUsers.map(user => {
        const vehicles = db.findMany('vehicles', { ownerId: user.id });
        const bookings = db.findMany('bookings', { userId: user.id });
        const reviews = db.findMany('reviews', { userId: user.id });

        const { password, ...userWithoutPassword } = user;

        return {
          ...userWithoutPassword,
          _count: {
            vehicles: vehicles.length,
            bookings: bookings.length,
            reviews: reviews.length
          }
        };
      });

      res.json({
        users: usersWithCounts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error: any) {
      next(error);
    }
  }
);

// Update user status
router.patch('/users/:id/status', authenticate, authorize('ADMIN'), async (req: AuthRequest, res, next): Promise<void> => {
  try {
    const { isActive } = req.body;

    const user = db.update('users', req.params.id, { isActive });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error: any) {
    next(error);
  }
});

// Get all vehicles (admin view)
router.get(
  '/vehicles',
  authenticate,
  authorize('ADMIN'),
  validate([
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const skip = (page - 1) * limit;

      const vehicles = db.findAll('vehicles');
      const total = vehicles.length;
      const paginatedVehicles = vehicles.slice(skip, skip + limit);

      const vehiclesWithDetails = paginatedVehicles.map(vehicle => {
        const owner = db.findById('users', vehicle.ownerId);
        const bookings = db.findMany('bookings', { vehicleId: vehicle.id });
        const reviews = db.findMany('reviews', { vehicleId: vehicle.id });

        return {
          ...vehicle,
          owner: owner ? {
            id: owner.id,
            firstName: owner.firstName,
            lastName: owner.lastName,
            email: owner.email
          } : null,
          _count: {
            bookings: bookings.length,
            reviews: reviews.length
          }
        };
      });

      res.json({
        vehicles: vehiclesWithDetails,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error: any) {
      next(error);
    }
  }
);

// Update vehicle status
router.patch('/vehicles/:id/status', authenticate, authorize('ADMIN'), async (req: AuthRequest, res, next): Promise<void> => {
  try {
    const { status } = req.body;
    const vehicle = db.update('vehicles', req.params.id, { status });

    if (!vehicle) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }

    res.json(vehicle);
  } catch (error: any) {
    next(error);
  }
});

// Delete vehicle
router.delete('/vehicles/:id', authenticate, authorize('ADMIN'), async (req: AuthRequest, res, next): Promise<void> => {
  try {
    const deleted = db.delete('vehicles', req.params.id);

    if (!deleted) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }

    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error: any) {
    next(error);
  }
});

// Get all bookings
router.get(
  '/bookings',
  authenticate,
  authorize('ADMIN'),
  validate([
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status').optional().isIn(['PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED'])
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const skip = (page - 1) * limit;

      let bookings = db.findAll('bookings');

      if (req.query.status) {
        bookings = bookings.filter(b => b.status === req.query.status);
      }

      const total = bookings.length;
      const paginatedBookings = bookings.slice(skip, skip + limit);

      const bookingsWithDetails = paginatedBookings.map(booking => {
        const user = db.findById('users', booking.userId);
        const vehicle = db.findById('vehicles', booking.vehicleId);
        const payment = db.findOne('payments', { bookingId: booking.id });

        return {
          ...booking,
          user: user ? {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
          } : null,
          vehicle: vehicle ? {
            id: vehicle.id,
            brand: vehicle.brand,
            model: vehicle.model,
            licensePlate: vehicle.licensePlate
          } : null,
          payment
        };
      });

      res.json({
        bookings: bookingsWithDetails,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error: any) {
      next(error);
    }
  }
);

// Get revenue statistics
router.get('/revenue', authenticate, authorize('ADMIN'), async (_req: AuthRequest, res, next): Promise<void> => {
  try {
    const payments = db.findMany('payments', { status: 'COMPLETED' });

    const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const totalTransactions = payments.length;

    res.json({
      totalRevenue,
      totalTransactions
    });
  } catch (error: any) {
    next(error);
  }
});

export default router;
