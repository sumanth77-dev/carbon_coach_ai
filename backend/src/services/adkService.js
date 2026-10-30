/**
 * Service to communicate with the external Python Google ADK AI Agent service via HTTP APIs.
 * Note: The actual Python AI Agent runs as a separate microservice.
 */

const ADK_SERVICE_URL = process.env.ADK_AGENT_SERVICE_URL || 'http://localhost:8000';

export const adkService = {
  /**
   * Send user prompt and footprint context to the Python Google ADK service
   * @param {string} prompt - Chat message or query
   * @param {Object} context - User context and carbon telemetry
   */
  async queryAgent(prompt, context = {}) {
    const response = await fetch(`${ADK_SERVICE_URL}/api/v1/agent/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, context }),
    });

    if (!response.ok) {
      throw new Error(`Google ADK Agent service responded with status ${response.status}`);
    }

    return await response.json();
  },

  /**
   * Forward footprint activities to Python calculation service for certified GHG calculations
   * @param {Array} activities - List of user activities with categories, modes, quantities
   */
  async calculateFootprint(activities) {
    const response = await fetch(`${ADK_SERVICE_URL}/api/v1/agent/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ activities }),
    });

    if (!response.ok) {
      throw new Error(`Google ADK Calculation service responded with status ${response.status}`);
    }

    return await response.json();
  },

  /**
   * Request automated reduction recommendations from the Google ADK service
   * @param {string} userId - User ID
   * @param {Object} profile - User carbon profile and history
   */
  async getRecommendations(userId, profile) {
    const response = await fetch(`${ADK_SERVICE_URL}/api/v1/agent/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, profile }),
    });

    if (!response.ok) {
      throw new Error(`Google ADK Agent service responded with status ${response.status}`);
    }

    return await response.json();
  },
};
