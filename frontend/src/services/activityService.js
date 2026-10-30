import api from './api';

/**
 * Activity History API Service
 */
export const activityService = {
  /**
   * Fetch paginated and filtered activity records
   * @param {Object} params - Query filters (category, dateRange, search, sortBy, page, limit)
   */
  async getActivities(params = {}) {
    try {
      const response = await api.get('/activities', { params });
      return response.data;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch activity records from server.';
      throw new Error(msg);
    }
  },

  /**
   * Fetch single activity by ID
   * @param {string} id - Activity ID
   */
  async getActivityById(id) {
    try {
      const response = await api.get(`/activities/${id}`);
      return response.data.activity;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Failed to load activity details.';
      throw new Error(msg);
    }
  },
};
