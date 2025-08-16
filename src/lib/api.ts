import axios from 'axios';

// Set defaults for all axios instances to ensure credentials and CSRF tokens are handled correctly.
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Using the local backend URL from the guide
  headers: {
    'Accept': 'application/json',
  },
  // withCredentials is now handled by the global default
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