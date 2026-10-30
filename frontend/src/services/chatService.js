import api from './api';

const SESSION_KEY = 'carbon_coach_chat_session_id';
const MESSAGES_PREFIX = 'carbon_coach_chat_messages_';

/**
 * Chat API Service for Google ADK / Gemini Assistant
 */
export const chatService = {
  /**
   * Get active session ID or generate a new one
   */
  getSessionId() {
    let sessionId = sessionStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      sessionStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
  },

  /**
   * Reset session and return newly generated session ID
   */
  resetSessionId() {
    const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    sessionStorage.setItem(SESSION_KEY, newSessionId);
    return newSessionId;
  },

  /**
   * Retrieve conversation messages persisted for session
   */
  getStoredMessages(sessionId) {
    try {
      const stored = sessionStorage.getItem(`${MESSAGES_PREFIX}${sessionId}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  /**
   * Store conversation messages in session storage
   */
  saveStoredMessages(sessionId, messages) {
    try {
      sessionStorage.setItem(`${MESSAGES_PREFIX}${sessionId}`, JSON.stringify(messages));
    } catch (e) {
      console.warn('[ChatService] Failed to cache session messages:', e);
    }
  },

  /**
   * Send user message to AI Assistant endpoint
   * @param {string} message - User query
   * @param {string} sessionId - Active session ID
   */
  async sendMessage(message, sessionId) {
    if (!message || !message.trim()) {
      throw new Error('Message cannot be empty.');
    }

    try {
      const response = await api.post('/chat', {
        message: message.trim(),
        session_id: sessionId || this.getSessionId(),
      });

      if (response.data && response.data.response) {
        return response.data;
      }
      throw new Error('Unexpected response structure from AI Assistant service.');
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Unable to reach AI Assistant. Please check connection.';
      throw new Error(msg);
    }
  },
};
