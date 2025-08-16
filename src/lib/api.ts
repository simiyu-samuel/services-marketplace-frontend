import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Using the local backend URL from the guide
  headers: {
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for Laravel Sanctum to handle cookies
});

// Interceptor to add the auth token from localStorage to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// We need to fetch a CSRF cookie from Sanctum before making state-changing requests
export const fetchCsrfToken = () => {
    // This endpoint is the standard for Sanctum SPA authentication
    return axios.get('http://localhost:8000/sanctum/csrf-cookie');
};

export default api;