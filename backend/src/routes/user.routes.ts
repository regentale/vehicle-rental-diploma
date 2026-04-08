import { Router } from 'express';
import { db } from '../utils/database';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Get user favorites
router.get('/favorites', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const favorites = db.findMany('favorites', { userId: req.user!.id });

    const favoritesWithVehicles = favorites.map(fav => {
      const vehicle = db.findById('vehicles', fav.vehicleId);
      if (!vehicle) return null;

      const owner = db.findById('users', vehicle.ownerId);
      const reviews = db.findMany('reviews', { vehicleId: vehicle.id });

      const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      return {
        ...fav,
        vehicle: {
          ...vehicle,
          owner: owner ? {
            id: owner.id,
            firstName: owner.firstName,
            lastName: owner.lastName
          } : null,
          averageRating: Math.round(avgRating * 10) / 10
        }
      };
    }).filter(f => f !== null);

    res.json(favoritesWithVehicles);
  } catch (error: any) {
    next(error);
  }
});

// Add to favorites
router.post('/favorites/:vehicleId', authenticate, async (req: AuthRequest, res, next): Promise<void> => {
  try {
    const existing = db.findOne('favorites', {
      userId: req.user!.id,
      vehicleId: req.params.vehicleId
    });

    if (existing) {
      res.status(400).json({ error: 'Already in favorites' });
      return;
    }

    const favorite = db.create('favorites', {
      userId: req.user!.id,
      vehicleId: req.params.vehicleId
    });

    const vehicle = db.findById('vehicles', req.params.vehicleId);

    res.status(201).json({
      ...favorite,
      vehicle
    });
  } catch (error: any) {
    next(error);
  }
});

// Remove from favorites
router.delete('/favorites/:vehicleId', authenticate, async (req: AuthRequest, res, next): Promise<void> => {
  try {
    const deletedCount = db.deleteMany('favorites', {
      userId: req.user!.id,
      vehicleId: req.params.vehicleId
    });

    if (deletedCount === 0) {
      res.status(404).json({ error: 'Favorite not found' });
      return;
    }

    res.json({ message: 'Removed from favorites' });
  } catch (error: any) {
    next(error);
  }
});

// Get user notifications
router.get('/notifications', authenticate, async (req: AuthRequest, res, next): Promise<void> => {
  try {
    const notifications = db.findMany('notifications', { userId: req.user!.id })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 50);

    res.json(notifications);
  } catch (error: any) {
    next(error);
  }
});

// Mark notification as read
router.patch('/notifications/:id/read', authenticate, async (req: AuthRequest, res, next): Promise<void> => {
  try {
    const notification = db.findById('notifications', req.params.id);

    if (!notification || notification.userId !== req.user!.id) {
      res.status(404).json({ error: 'Notification not found' });
      return;
    }

    db.update('notifications', req.params.id, { isRead: true });

    res.json({ message: 'Notification marked as read' });
  } catch (error: any) {
    next(error);
  }
});

// Mark all notifications as read
router.patch('/notifications/read-all', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const notifications = db.findMany('notifications', {
      userId: req.user!.id,
      isRead: false
    });

    notifications.forEach(notification => {
      db.update('notifications', notification.id, { isRead: true });
    });

    res.json({ message: 'All notifications marked as read' });
  } catch (error: any) {
    next(error);
  }
});

export default router;
