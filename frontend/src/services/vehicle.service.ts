import api from './api';

export interface VehicleFilters {
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  seats?: number;
  transmission?: string;
  fuelType?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const vehicleService = {
  async getVehicles(filters?: VehicleFilters) {
    const response = await api.get('/vehicles', { params: filters });
    return response.data;
  },

  async getVehicleById(id: string) {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
  },

  async createVehicle(data: any) {
    const response = await api.post('/vehicles', data);
    return response.data;
  },

  async updateVehicle(id: string, data: any) {
    const response = await api.put(`/vehicles/${id}`, data);
    return response.data;
  },

  async deleteVehicle(id: string) {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  },

  async checkAvailability(id: string, startDate: Date, endDate: Date) {
    const response = await api.post(`/vehicles/${id}/check-availability`, {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
    return response.data;
  },
};
