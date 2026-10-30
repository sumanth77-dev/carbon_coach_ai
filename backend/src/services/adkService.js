/**
 * Service to communicate with the Python Google ADK AI Agent service via HTTP APIs.
 * Communicates with the FastAPI backend running in carbon_coach_ai.
 */

const ADK_SERVICE_URL = process.env.ADK_AGENT_SERVICE_URL || 'http://localhost:8080';

export const adkService = {
  /**
   * Health check on Python AI agent service
   */
  async checkHealth() {
    try {
      const response = await fetch(`${ADK_SERVICE_URL}/health`, {
        signal: AbortSignal.timeout(3000),
      });
      if (!response.ok) return { healthy: false };
      const data = await response.json();
      return { healthy: true, data };
    } catch {
      return { healthy: false };
    }
  },

  /**
   * Send user prompt to the Python Google ADK multi-agent service
   * @param {string} message - Natural language activity, question or command
   * @param {string} userId - User identifier
   * @param {string} sessionId - Conversation session identifier
   */
  async queryAgent(message, userId = 'default_user', sessionId = 'session_default') {
    const response = await fetch(`${ADK_SERVICE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        user_id: userId,
        session_id: sessionId,
      }),
      signal: AbortSignal.timeout(45000), // ADK multi-agent with Gemini may take a few seconds
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Python Google ADK Agent returned error (${response.status}): ${errorText}`);
    }

    return await response.json();
  },

  /**
   * Forward activities to Python deterministic calculation service
   * @param {Array} activities - List of user activities across sectors
   */
  async calculateFootprint(activities) {
    const response = await fetch(`${ADK_SERVICE_URL}/api/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ activities }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Python calculation service error (${response.status}): ${errorText}`);
    }

    return await response.json();
  },

  /**
   * Log a verified activity record directly to the Python SQLite database
   * @param {Object} act - Activity object
   */
  async logActivity(act) {
    const response = await fetch(`${ADK_SERVICE_URL}/api/activities/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: act.category,
        activity_type: act.activity_type || act.activityName || 'activity',
        quantity: parseFloat(act.quantity) || 1.0,
        unit: act.unit || 'units',
        kg_co2e: parseFloat(act.kg_co2e || act.emissions || 0.0),
        user_id: act.user_id || 'default_user',
        emission_factor: act.emission_factor || act.emissionFactor || '',
        formula: act.formula || '',
        source: act.source || act.factorSource || 'UK DEFRA 2024 / IPCC',
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Python SQLite logging error (${response.status}): ${errorText}`);
    }

    return await response.json();
  },

  /**
   * Retrieve activity history from SQLite
   */
  async getActivities(userId = 'default_user', limit = 100) {
    const url = new URL(`${ADK_SERVICE_URL}/api/activities/history`);
    url.searchParams.set('user_id', userId);
    url.searchParams.set('limit', limit);

    const response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      throw new Error(`Python SQLite activity history query failed (${response.status})`);
    }

    return await response.json();
  },

  /**
   * Retrieve daily summary from SQLite
   */
  async getDailySummary(userId = 'default_user', date = null) {
    const url = new URL(`${ADK_SERVICE_URL}/api/summary/daily`);
    url.searchParams.set('user_id', userId);
    if (date) url.searchParams.set('date', date);

    const response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      throw new Error(`Python SQLite daily summary query failed (${response.status})`);
    }

    return await response.json();
  },

  /**
   * Retrieve weekly summary (past 7 days) from SQLite
   */
  async getWeeklySummary(userId = 'default_user') {
    const url = new URL(`${ADK_SERVICE_URL}/api/summary/weekly`);
    url.searchParams.set('user_id', userId);

    const response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      throw new Error(`Python SQLite weekly summary query failed (${response.status})`);
    }

    return await response.json();
  },

  /**
   * Retrieve monthly summary (past 30 days) from SQLite
   */
  async getMonthlySummary(userId = 'default_user') {
    const url = new URL(`${ADK_SERVICE_URL}/api/summary/monthly`);
    url.searchParams.set('user_id', userId);

    const response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      throw new Error(`Python SQLite monthly summary query failed (${response.status})`);
    }

    return await response.json();
  },

  /**
   * Retrieve category breakdown percentages from SQLite
   */
  async getCategorySummary(userId = 'default_user', days = 30) {
    const url = new URL(`${ADK_SERVICE_URL}/api/summary/categories`);
    url.searchParams.set('user_id', userId);
    url.searchParams.set('days', days);

    const response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      throw new Error(`Python SQLite category summary query failed (${response.status})`);
    }

    return await response.json();
  },

  /**
   * Retrieve personalized recommendations from Python agent engine
   */
  async getRecommendations(userId = 'default_user') {
    const url = new URL(`${ADK_SERVICE_URL}/api/recommendations`);
    url.searchParams.set('user_id', userId);

    const response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      throw new Error(`Python recommendations query failed (${response.status})`);
    }

    return await response.json();
  },

  /**
   * Retrieve a relevant reduction tip for a specific activity
   */
  async getReductionTipForActivity(activity) {
    try {
      const response = await fetch(`${ADK_SERVICE_URL}/api/recommendations/for-activity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: activity.category || 'transportation',
          activity_type: activity.activity_type || activity.activity || activity.activityName || 'activity',
          quantity: parseFloat(activity.quantity) || 1.0,
          unit: activity.unit || 'units',
          kg_co2e: parseFloat(activity.kg_co2e || activity.emissions || 0.0),
        }),
        signal: AbortSignal.timeout(6000),
      });

      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  },
};
