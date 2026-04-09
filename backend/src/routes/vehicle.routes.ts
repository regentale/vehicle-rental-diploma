import { Router } from 'express';
import { body, query } from 'express-validator';
import { VehicleService } from '../services/vehicle.service';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();
const vehicleService = new VehicleService();

// Get all vehicles (public)
router.get(
  '/',
  validate([
    query('type').optional({ checkFalsy: true }).isIn(['CAR', 'MOTORCYCLE', 'BICYCLE', 'SCOOTER', 'TRUCK', 'VAN']),
    query('minPrice').optional({ checkFalsy: true }).isFloat({ min: 0 }),
    query('maxPrice').optional({ checkFalsy: true }).isFloat({ min: 0 }),
    query('seats').optional({ checkFalsy: true }).isInt({ min: 1 }),
    query('page').optional({ checkFalsy: true }).isInt({ min: 1 }),
    query('limit').optional({ checkFalsy: true }).isInt({ min: 1, max: 50 })
  ]),
  async (req, res, next) => {
    try {
      const filters = {
        type: req.query.type as any,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        location: req.query.location as string,
        seats: req.query.seats ? Number(req.query.seats) : undefined,
        transmission: req.query.transmission as string,
        fuelType: req.query.fuelType as string,
        search: req.query.search as string,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 12
      };

      const result = await vehicleService.getVehicles(filters);
      res.json(result);
    } catch (error: any) {
      next(error);
    }
  }
);

// Get vehicle by ID (public)
router.get('/:id', async (req, res, next) => {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    res.json(vehicle);
  } catch (error: any) {
    next(error);
  }
});

// Create vehicle (owner/admin only)
router.post(
  '/',
  authenticate,
  authorize('OWNER', 'ADMIN'),
  validate([
    body('type').isIn(['CAR', 'MOTORCYCLE', 'BICYCLE', 'SCOOTER', 'TRUCK', 'VAN']),
    body('brand').trim().notEmpty(),
    body('model').trim().notEmpty(),
    body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }),
    body('color').trim().notEmpty(),
    body('licensePlate').trim().notEmpty(),
    body('seats').isInt({ min: 1 }),
    body('transmission').isIn(['MANUAL', 'AUTOMATIC']),
    body('fuelType').isIn(['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID']),
    body('pricePerDay').isFloat({ min: 0 }),
    body('description').trim().notEmpty(),
    body('location').trim().notEmpty()
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      const vehicle = await vehicleService.createVehicle(req.user!.id, req.body);
      res.status(201).json(vehicle);
    } catch (error: any) {
      next(error);
    }
  }
);

// Update vehicle
router.put(
  '/:id',
  authenticate,
  authorize('OWNER', 'ADMIN'),
  validate([
    body('type').optional().isIn(['CAR', 'MOTORCYCLE', 'BICYCLE', 'SCOOTER', 'TRUCK', 'VAN']),
    body('brand').optional().trim().notEmpty(),
    body('model').optional().trim().notEmpty(),
    body('year').optional().isInt({ min: 1900, max: new Date().getFullYear() + 1 }),
    body('color').optional().trim().notEmpty(),
    body('licensePlate').optional().trim().notEmpty(),
    body('seats').optional().isInt({ min: 1 }),
    body('transmission').optional().isIn(['MANUAL', 'AUTOMATIC']),
    body('fuelType').optional().isIn(['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID']),
    body('pricePerDay').optional().isFloat({ min: 0 }),
    body('description').optional().trim().notEmpty(),
    body('location').optional().trim().notEmpty()
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      const vehicle = await vehicleService.updateVehicle(
        req.params.id,
        req.user!.id,
        req.body
      );
      res.json(vehicle);
    } catch (error: any) {
      next(error);
    }
  }
);

// Delete vehicle
router.delete(
  '/:id',
  authenticate,
  authorize('OWNER', 'ADMIN'),
  async (req: AuthRequest, res, next) => {
    try {
      const result = await vehicleService.deleteVehicle(req.params.id, req.user!.id);
      res.json(result);
    } catch (error: any) {
      next(error);
    }
  }
);

// Check availability
router.post(
  '/:id/check-availability',
  validate([
    body('startDate').isISO8601(),
    body('endDate').isISO8601()
  ]),
  async (req, res, next) => {
    try {
      const { startDate, endDate } = req.body;
      const isAvailable = await vehicleService.checkAvailability(
        req.params.id,
        new Date(startDate),
        new Date(endDate)
      );
      res.json({ available: isAvailable });
    } catch (error: any) {
      next(error);
    }
  }
);

export default router;
