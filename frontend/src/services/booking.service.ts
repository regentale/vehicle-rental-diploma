import api from './api';

export interface BookingData {
  vehicleId: string;
  startDate: Date;
  endDate: Date;
  pickupLocation: string;
  dropoffLocation?: string;
  notes?: string;
}

export const bookingService = {
  async createBooking(data: BookingData) {
    const response = await api.post('/bookings', {
      ...data,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString(),
    });
    return response.data;
  },

  async getBookings(filters?: { status?: string; page?: number; limit?: number }) {
    const response = await api.get('/bookings', { params: filters });
    return response.data;
  },

  async getBookingById(id: string) {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  async updateBookingStatus(id: string, status: string) {
    const response = await api.patch(`/bookings/${id}/status`, { status });
    return response.data;
  },

  async cancelBooking(id: string) {
    const response = await api.post(`/bookings/${id}/cancel`);
    return response.data;
  },
};
