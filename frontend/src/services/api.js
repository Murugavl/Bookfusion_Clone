import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if exists
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized - could redirect to login
      console.error('Unauthorized access');
    } else if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    } else if (!error.response) {
      console.error('Network error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Book service methods
export const bookService = {
  getAll: () => api.get(API_ENDPOINTS.BOOKS.ALL),
  getById: (id) => api.get(API_ENDPOINTS.BOOKS.BY_ID(id)),
  upload: (formData, onUploadProgress) => 
    api.post(API_ENDPOINTS.BOOKS.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onUploadProgress ? (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        );
        onUploadProgress(percentCompleted);
      } : undefined,
    }),
  update: (id, data) => api.patch(API_ENDPOINTS.BOOKS.UPDATE(id), data),
  delete: (id) => api.delete(API_ENDPOINTS.BOOKS.DELETE(id)),
  updateProgress: (id, data) => api.post(API_ENDPOINTS.BOOKS.PROGRESS(id), data),
  addNote: (id, data) => api.post(API_ENDPOINTS.BOOKS.NOTES(id), data),
  addHighlight: (id, data) => api.post(API_ENDPOINTS.BOOKS.HIGHLIGHTS(id), data),
};

export default api;

