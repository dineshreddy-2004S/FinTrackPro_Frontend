import axios from 'axios';

// Dynamically determine the base URL based on environment
const getBaseURL = () => {
  // 1. When testing locally in the browser, always route to local backend server
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1')
  ) {
    return 'http://localhost:5000/api';
  }

  // 2. Read Vite environment variable if provided
  let envUrl = import.meta.env.VITE_API_BASE_URL;

  // 3. Fallback to production Render deployment
  if (!envUrl) {
    return 'https://fintrackpro-backend-trtl.onrender.com/api';
  }

  // Ensure trailing slashes are removed and '/api' prefix is included
  envUrl = envUrl.trim().replace(/\/+$/, '');
  return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30-second timeout to handle cold starts on free hosting tiers
});

// Request Interceptor: Attach JWT Bearer Token to all authorized requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle unauthenticated responses (401) and session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      const currentPath = window.location.pathname;
      if (currentPath !== '/' && currentPath !== '/auth') {
        window.location.href = '/auth?mode=login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;