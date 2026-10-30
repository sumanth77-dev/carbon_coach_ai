import axios from 'axios';

/**
 * Pre-configured Axios instance for Carbon Coach API communication.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('carbon_coach_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('carbon_coach_token');
    }
    return Promise.reject(error);
  }
);

export default api;
