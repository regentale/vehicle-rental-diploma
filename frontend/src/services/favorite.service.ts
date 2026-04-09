import api from './api';

export const favoriteService = {
  async getFavorites() {
    const response = await api.get('/users/favorites');
    return response.data;
  },

  async addFavorite(vehicleId: string) {
    const response = await api.post(`/users/favorites/${vehicleId}`);
    return response.data;
  },

  async removeFavorite(vehicleId: string) {
    const response = await api.delete(`/users/favorites/${vehicleId}`);
    return response.data;
  },
};
