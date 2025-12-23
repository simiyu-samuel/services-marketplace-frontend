import axios from 'axios';
import { showError } from '../utils/toast'; // Import showError for error handling

// Set defaults for all axios instances to ensure credentials and CSRF tokens are handled correctly.
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

const BACKEND_URL = 'https://api.themabinti.com';

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    'Accept': 'application/json',
  },
});

// Interceptor to add the auth token from localStorage to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to fetch CSRF token before making state-changing requests
api.interceptors.request.use(async config => {
  if (config.method !== 'get') {
    await fetchCsrfToken();
  }
  return config;
});

// Interceptor to handle 401 Unauthorized and 403 Forbidden responses globally
api.interceptors.response.use(
  response => response,
  error => {
if (error.response) {
      const { status, config } = error.response;
      if (status === 401 || status === 403) {
        // Don't logout for service operations (both regular and admin routes)
        const isServiceOperation = config.url?.startsWith('/services') || 
                                  config.url?.includes('/services/') ||
                                  config.url?.startsWith('/admin/services') ||
                                  config.url?.includes('/admin/services/');
        
        if (!isServiceOperation) {
          localStorage.removeItem('authToken'); // Clear token
          showError('Session expired. Please log in again.'); // Display toast
          window.location.href = '/login'; // Navigate to login page
        }
      }
    }
    return Promise.reject(error);
  }
);

// Recursive function to prepend backend URL to image paths
const processImagePaths = (data: unknown): unknown => {
    if (Array.isArray(data)) {
        return data.map(item => processImagePaths(item as unknown));
    }
    if (typeof data === 'object' && data !== null) {
        const newData = { ...data }; 
        for (const key in newData) {
            if (Object.prototype.hasOwnProperty.call(newData, key)) {
                if ((key === 'profile_image' || key === 'featured_image_url' || key === 'featured_image') && newData[key] && typeof newData[key] === 'string' && !newData[key].startsWith('http')) {
                    newData[key] = `${BACKEND_URL}${newData[key]}`;
                } else if (key === 'media_files' && Array.isArray(newData[key])) {
                    newData[key] = newData[key].map(file => {
                        if (typeof file === 'string' && !file.startsWith('http')) {
                            return `${BACKEND_URL}${file}`;
                        }
                        return file;
                    });
                } else if (typeof newData[key] === 'object') {
                    newData[key] = processImagePaths(newData[key]);
                }
            }
        }
        return newData;
    }
    return data;
};

// Interceptor to process all successful responses
api.interceptors.response.use(response => {
    if (response.data) {
        response.data = processImagePaths(response.data);
    }
    return response;
});

// We need to fetch a CSRF cookie from Sanctum before making state-changing requests
export const fetchCsrfToken = () => {
    return axios.get(`${BACKEND_URL}/sanctum/csrf-cookie`);
};

export default api;
