import { db } from '../utils/database';

export class VehicleService {
  async createVehicle(ownerId: string, data: any) {
    const vehicle = db.create('vehicles', {
      ownerId,
      type: data.type,
      brand: data.brand,
      model: data.model,
      year: data.year,
      color: data.color,
      licensePlate: data.licensePlate,
      seats: data.seats,
      transmission: data.transmission,
      fuelType: data.fuelType,
      pricePerDay: data.pricePerDay,
      pricePerHour: data.pricePerHour,
      description: data.description,
      features: data.features || [],
      images: data.images || [],
      location: data.location,
      latitude: data.latitude,
      longitude: data.longitude,
      status: 'AVAILABLE',
      mileage: data.mileage,
      isInsured: data.isInsured ?? true,
      insuranceExpiry: data.insuranceExpiry,
    });

    const owner = db.findById('users', ownerId);
    return {
      ...vehicle,
      owner: owner ? {
        id: owner.id,
        firstName: owner.firstName,
        lastName: owner.lastName,
        avatar: owner.avatar,
      } : null,
    };
  }

  async getVehicles(filters: any) {
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const skip = (page - 1) * limit;

    let vehicles = db.findMany('vehicles', { status: 'AVAILABLE' });

    // Apply filters
    if (filters.type) {
      vehicles = vehicles.filter((v) => v.type === filters.type);
    }
    if (filters.minPrice) {
      vehicles = vehicles.filter((v) => Number(v.pricePerDay) >= filters.minPrice);
    }
    if (filters.maxPrice) {
      vehicles = vehicles.filter((v) => Number(v.pricePerDay) <= filters.maxPrice);
    }
    if (filters.location) {
      vehicles = vehicles.filter((v) =>
        v.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.seats) {
      vehicles = vehicles.filter((v) => v.seats >= filters.seats);
    }
    if (filters.transmission) {
      vehicles = vehicles.filter((v) => v.transmission === filters.transmission);
    }
    if (filters.fuelType) {
      vehicles = vehicles.filter((v) => v.fuelType === filters.fuelType);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      vehicles = vehicles.filter(
        (v) =>
          v.brand.toLowerCase().includes(search) ||
          v.model.toLowerCase().includes(search) ||
          v.description.toLowerCase().includes(search)
      );
    }

    const total = vehicles.length;
    const paginatedVehicles = vehicles.slice(skip, skip + limit);

    // Add owner and rating info
    const vehiclesWithDetails = paginatedVehicles.map((vehicle) => {
      const owner = db.findById('users', vehicle.ownerId);
      const reviews = db.findMany('reviews', { vehicleId: vehicle.id });
      const bookings = db.findMany('bookings', { vehicleId: vehicle.id });

      const avgRating =
        reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0;

      return {
        ...vehicle,
        owner: owner
          ? {
              id: owner.id,
              firstName: owner.firstName,
              lastName: owner.lastName,
              avatar: owner.avatar,
            }
          : null,
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
        _count: {
          reviews: reviews.length,
          bookings: bookings.length,
        },
      };
    });

    return {
      vehicles: vehiclesWithDetails,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getVehicleById(id: string) {
    const vehicle = db.findById('vehicles', id);

    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    const owner = db.findById('users', vehicle.ownerId);
    const reviews = db.findMany('reviews', { vehicleId: id });
    const unavailableDates = db.findMany('unavailableDates', { vehicleId: id });
    const bookings = db.findMany('bookings', { vehicleId: id });

    // Add user info to reviews
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
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return {
      ...vehicle,
      owner: owner
        ? {
            id: owner.id,
            firstName: owner.firstName,
            lastName: owner.lastName,
            avatar: owner.avatar,
            phone: owner.phone,
            createdAt: owner.createdAt,
          }
        : null,
      reviews: reviewsWithUsers,
      unavailableDates: unavailableDates.filter(
        (d) => new Date(d.endDate) >= new Date()
      ),
      averageRating: Math.round(avgRating * 10) / 10,
      _count: {
        bookings: bookings.length,
        reviews: reviews.length,
      },
    };
  }

  async updateVehicle(id: string, ownerId: string, data: any) {
    const vehicle = db.findById('vehicles', id);

    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    if (vehicle.ownerId !== ownerId) {
      throw new Error('Unauthorized');
    }

    const updated = db.update('vehicles', id, data);
    const owner = db.findById('users', ownerId);

    return {
      ...updated,
      owner: owner
        ? {
            id: owner.id,
            firstName: owner.firstName,
            lastName: owner.lastName,
            avatar: owner.avatar,
          }
        : null,
    };
  }

  async deleteVehicle(id: string, ownerId: string) {
    const vehicle = db.findById('vehicles', id);

    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    if (vehicle.ownerId !== ownerId) {
      throw new Error('Unauthorized');
    }

    db.delete('vehicles', id);
    return { message: 'Vehicle deleted successfully' };
  }

  async checkAvailability(vehicleId: string, startDate: Date, endDate: Date) {
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

    const unavailableDates = db.findMany('unavailableDates', { vehicleId });

    const conflictingDates = unavailableDates.filter((date) => {
      const dateStart = new Date(date.startDate);
      const dateEnd = new Date(date.endDate);

      return (
        (dateStart <= startDate && dateEnd >= startDate) ||
        (dateStart <= endDate && dateEnd >= endDate)
      );
    });

    return conflictingBookings.length === 0 && conflictingDates.length === 0;
  }
}
