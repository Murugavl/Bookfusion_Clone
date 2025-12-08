// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

export const API_ENDPOINTS = {
  BOOKS: {
    ALL: `${API_BASE_URL}/api/books/all`,
    BY_ID: (id) => `${API_BASE_URL}/api/books/${id}`,
    UPLOAD: `${API_BASE_URL}/api/books/upload`,
    UPDATE: (id) => `${API_BASE_URL}/api/books/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/books/${id}`,
    PROGRESS: (id) => `${API_BASE_URL}/api/books/${id}/progress`,
    NOTES: (id) => `${API_BASE_URL}/api/books/${id}/notes`,
    HIGHLIGHTS: (id) => `${API_BASE_URL}/api/books/${id}/highlights`,
  }
};

export default API_BASE_URL;


