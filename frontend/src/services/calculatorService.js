import api from './api';

/**
 * Calculator API Service
 * Handles calculation and session history persistence via Express & Python ADK microservice.
 */
export const calculatorService = {
  /**
   * Submit activity batch to backend for calculation with certified emission factors
   * @param {Array} activities - List of activity objects across Transportation, Electricity, Food, Waste
   * @returns {Promise<Object>} Calculation results including totals, breakdown, and detailed items
   */
  async calculateFootprint(activities) {
    if (!activities || !Array.isArray(activities) || activities.length === 0) {
      throw new Error('At least one activity is required to calculate carbon footprint.');
    }

    try {
      const response = await api.post('/footprints/calculate', { activities });
      if (response.data && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data?.message || 'Invalid calculation response structure.');
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to connect to the carbon calculation service. Please verify your connection.';
      throw new Error(message);
    }
  },

  /**
   * Persist calculated activities to the user's footprint history
   * @param {Array} activities - List of calculated activity items
   * @returns {Promise<Object>} Persistence status and confirmation
   */
  async saveActivitiesToHistory(activities) {
    if (!activities || !Array.isArray(activities) || activities.length === 0) {
      throw new Error('No activities available to save.');
    }

    try {
      const response = await api.post('/footprints/save-batch', { activities });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to save activities to history.';
      throw new Error(message);
    }
  },
};
