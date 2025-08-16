import axios from 'axios';

// Set defaults for all axios instances to ensure credentials and CSRF tokens are handled correctly.
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

const BACKEND_URL = 'http://localhost:8000';

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

// Recursive function to prepend backend URL to image paths
const processImagePaths = (data: any): any => {
    if (Array.isArray(data)) {
        return data.map(item => processImagePaths(item));
    }
    if (typeof data === 'object' && data !== null) {
        const newData = { ...data }; 
        for (const key in newData) {
            if (Object.prototype.hasOwnProperty.call(newData, key)) {
                if ((key === 'profile_image' || key === 'featured_image_url') && newData[key] && typeof newData[key] === 'string' && !newData[key].startsWith('http')) {
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