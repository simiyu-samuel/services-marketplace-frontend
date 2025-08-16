import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // The backend API is proxied under /api
  headers: {
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for Laravel Sanctum
});

// Interceptor to add the auth token from localStorage to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// We also need to fetch a CSRF cookie from Sanctum
export const fetchCsrfToken = () => {
    // This endpoint is often /sanctum/csrf-cookie in Laravel
    // We'll assume it's configured to be accessible
    return axios.get('/sanctum/csrf-cookie', {
        baseURL: '/', // Use the root domain for this specific call
    });
};

export default api;