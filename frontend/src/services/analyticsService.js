import api from './api';

/**
 * Analytics API Service
 */
export const analyticsService = {
  /**
   * Fetch overview metrics, comparisons, and AI findings
   * @param {string} period - e.g. 'today', '7days', '30days', 'this_month'
   */
  async getSummary(period = '7days') {
    try {
      const response = await api.get('/analytics/summary', { params: { period } });
      return response.data.data;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch analytics summary.';
      throw new Error(msg);
    }
  },

  /**
   * Fetch time-series trends data
   * @param {string} period - Selected timeframe
   * @param {string} interval - e.g. 'daily', 'weekly', 'monthly'
   */
  async getTrends(period = '7days', interval = 'daily') {
    try {
      const response = await api.get('/analytics/trends', { params: { period, interval } });
      return response.data.data;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch emission trends.';
      throw new Error(msg);
    }
  },

  /**
   * Fetch category breakdown and target comparison metrics
   * @param {string} period - Selected timeframe
   */
  async getCategories(period = '7days') {
    try {
      const response = await api.get('/analytics/categories', { params: { period } });
      return response.data.data;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch category analytics.';
      throw new Error(msg);
    }
  },
};
