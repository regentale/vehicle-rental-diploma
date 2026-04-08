import { db } from '../utils/database';

export class BookingService {
  async createBooking(userId: string, data: {
    vehicleId: string;
    startDate: Date;
    endDate: Date;
    pickupLocation: string;
    dropoffLocation?: string;
    notes?: string;
  }) {
    const vehicle = db.findById('vehicles', data.vehicleId);

    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    if (vehicle.status !== 'AVAILABLE') {
      throw new Error('Vehicle is not available');
    }

    // Check availability
    const isAvailable = await this.checkAvailability(
      data.vehicleId,
      data.startDate,
      data.endDate
    );

    if (!isAvailable) {
      throw new Error('Vehicle is not available for selected dates');
    }

    const totalDays = Math.ceil(
      (data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const totalPrice = Number(vehicle.pricePerDay) * totalDays;

    const booking = db.create('bookings', {
      userId,
      vehicleId: data.vehicleId,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString(),
      totalDays,
      pricePerDay: vehicle.pricePerDay,
      totalPrice,
      pickupLocation: data.pickupLocation,
      dropoffLocation: data.dropoffLocation,
      notes: data.notes,
      status: 'PENDING',
    });

    // Create payment record
    db.create('payments', {
      bookingId: booking.id,
      amount: totalPrice,
      currency: 'USD',
      status: 'PENDING',
    });

    // Get related data
    const user = db.findById('users', userId);
    const owner = db.findById('users', vehicle.ownerId);

    return {
      ...booking,
      vehicle: {
        ...vehicle,
        owner: owner
          ? {
              id: owner.id,
              firstName: owner.firstName,
              lastName: owner.lastName,
              email: owner.email,
              phone: owner.phone,
            }
          : null,
      },
      user: user
        ? {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
          }
        : null,
    };
  }

  async getBookings(userId: string, filters?: any) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    let bookings = db.findMany('bookings', { userId });

    if (filters?.status) {
      bookings = bookings.filter((b) => b.status === filters.status);
    }

    const total = bookings.length;
    const paginatedBookings = bookings.slice(skip, skip + limit);

    // Add related data
    const bookingsWithDetails = paginatedBookings.map((booking) => {
      const vehicle = db.findById('vehicles', booking.vehicleId);
      const payment = db.findOne('payments', { bookingId: booking.id });
      const owner = vehicle ? db.findById('users', vehicle.ownerId) : null;

      return {
        ...booking,
        vehicle: vehicle
          ? {
              ...vehicle,
              owner: owner
                ? {
                    id: owner.id,
                    firstName: owner.firstName,
                    lastName: owner.lastName,
                    phone: owner.phone,
                  }
                : null,
            }
          : null,
        payment,
      };
    });

    return {
      bookings: bookingsWithDetails,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getBookingById(id: string, userId: string) {
    const booking = db.findById('bookings', id);

    if (!booking) {
      throw new Error('Booking not found');
    }

    const vehicle = db.findById('vehicles', booking.vehicleId);

    if (booking.userId !== userId && vehicle?.ownerId !== userId) {
      throw new Error('Unauthorized');
    }

    const user = db.findById('users', booking.userId);
    const owner = vehicle ? db.findById('users', vehicle.ownerId) : null;
    const payment = db.findOne('payments', { bookingId: id });
    const review = db.findOne('reviews', { bookingId: id });

    return {
      ...booking,
      vehicle: vehicle
        ? {
            ...vehicle,
            owner: owner
              ? {
                  id: owner.id,
                  firstName: owner.firstName,
                  lastName: owner.lastName,
                  email: owner.email,
                  phone: owner.phone,
                  avatar: owner.avatar,
                }
              : null,
          }
        : null,
      user: user
        ? {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar,
          }
        : null,
      payment,
      review,
    };
  }

  async updateBookingStatus(id: string, status: string, userId: string) {
    const booking = db.findById('bookings', id);

    if (!booking) {
      throw new Error('Booking not found');
    }

    const vehicle = db.findById('vehicles', booking.vehicleId);

    if (booking.userId !== userId && vehicle?.ownerId !== userId) {
      throw new Error('Unauthorized');
    }

    const updated = db.update('bookings', id, { status });

    // Update vehicle status if needed
    if (status === 'ACTIVE') {
      db.update('vehicles', booking.vehicleId, { status: 'RENTED' });
    } else if (status === 'COMPLETED' || status === 'CANCELLED') {
      db.update('vehicles', booking.vehicleId, { status: 'AVAILABLE' });
    }

    const user = db.findById('users', booking.userId);

    return {
      ...updated,
      vehicle,
      user: user
        ? {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          }
        : null,
    };
  }

  async cancelBooking(id: string, userId: string) {
    const booking = db.findById('bookings', id);

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new Error('Unauthorized');
    }

    if (booking.status === 'COMPLETED') {
      throw new Error('Cannot cancel completed booking');
    }

    const updated = db.update('bookings', id, { status: 'CANCELLED' });

    // Update payment status if exists
    const payment = db.findOne('payments', { bookingId: id });
    if (payment && payment.status === 'COMPLETED') {
      db.update('payments', payment.id, {
        status: 'REFUNDED',
        refundedAt: new Date().toISOString(),
      });
    }

    return updated;
  }

  private async checkAvailability(vehicleId: string, startDate: Date, endDate: Date) {
    const bookings = db.findMany('bookings', { vehicleId });

    const conflictingBookings = bookings.filter((booking) => {
      if (!['PENDING', 'CONFIRMED', 'ACTIVE'].includes(booking.status)) {
        return false;
      }

      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);

      return (
        (bookingStart <= startDate && bookingEnd >= startDate) ||
        (bookingStart <= endDate && bookingEnd >= endDate) ||
        (bookingStart >= startDate && bookingEnd <= endDate)
      );
    });

    return conflictingBookings.length === 0;
  }
}
