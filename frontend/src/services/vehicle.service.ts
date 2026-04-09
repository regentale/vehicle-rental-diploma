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
    const params: Record<string, any> = {
      page: filters?.page ?? 1,
      limit: filters?.limit ?? 12,
    };

    if (filters?.type) params.type = filters.type;
    if (filters?.location) params.location = filters.location;
    if (filters?.transmission) params.transmission = filters.transmission;
    if (filters?.fuelType) params.fuelType = filters.fuelType;
    if (filters?.search) params.search = filters.search;
    if (filters?.minPrice !== undefined && filters?.minPrice !== '') params.minPrice = Number(filters.minPrice);
    if (filters?.maxPrice !== undefined && filters?.maxPrice !== '') params.maxPrice = Number(filters.maxPrice);
    if (filters?.seats !== undefined && filters?.seats !== '') params.seats = Number(filters.seats);

    const response = await api.get('/vehicles', { params });
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
