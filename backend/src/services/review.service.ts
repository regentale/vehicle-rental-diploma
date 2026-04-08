import { db } from '../utils/database';

export class ReviewService {
  async createReview(userId: string, data: {
    vehicleId: string;
    bookingId: string;
    rating: number;
    comment?: string;
  }) {
    // Check if booking exists and belongs to user
    const booking = db.findById('bookings', data.bookingId);

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new Error('Unauthorized');
    }

    if (booking.status !== 'COMPLETED') {
      throw new Error('Can only review completed bookings');
    }

    const existingReview = db.findOne('reviews', { bookingId: data.bookingId });
    if (existingReview) {
      throw new Error('Review already exists for this booking');
    }

    const review = db.create('reviews', {
      userId,
      vehicleId: data.vehicleId,
      bookingId: data.bookingId,
      rating: data.rating,
      comment: data.comment,
    });

    const user = db.findById('users', userId);

    return {
      ...review,
      user: user
        ? {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
          }
        : null,
    };
  }

  async getVehicleReviews(vehicleId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const allReviews = db.findMany('reviews', { vehicleId });

    const total = allReviews.length;
    const reviews = allReviews.slice(skip, skip + limit);

    // Add user info
    const reviewsWithUsers = reviews.map((review) => {
      const user = db.findById('users', review.userId);
      return {
        ...review,
        user: user
          ? {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              avatar: user.avatar,
            }
          : null,
      };
    });

    const avgRating =
      allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0;

    return {
      reviews: reviewsWithUsers,
      averageRating: avgRating,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateReview(id: string, userId: string, data: {
    rating?: number;
    comment?: string;
  }) {
    const review = db.findById('reviews', id);

    if (!review) {
      throw new Error('Review not found');
    }

    if (review.userId !== userId) {
      throw new Error('Unauthorized');
    }

    const updated = db.update('reviews', id, data);
    const user = db.findById('users', userId);

    return {
      ...updated,
      user: user
        ? {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
          }
        : null,
    };
  }

  async deleteReview(id: string, userId: string) {
    const review = db.findById('reviews', id);

    if (!review) {
      throw new Error('Review not found');
    }

    if (review.userId !== userId) {
      throw new Error('Unauthorized');
    }

    db.delete('reviews', id);
    return { message: 'Review deleted successfully' };
  }
}
