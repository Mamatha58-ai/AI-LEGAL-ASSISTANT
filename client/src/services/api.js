import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL
});

// Interceptor to attach JWT token and active Language
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lexai_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const lang = localStorage.getItem('lexai_language') || 'en';
  config.headers['x-language'] = lang;
  config.headers['Accept-Language'] = lang;

  // For FormData payloads, do not set application/json or hardcoded Content-Type so browser sets boundary
  if (config.data instanceof FormData) {
    if (config.headers) {
      delete config.headers['Content-Type'];
    }
  } else if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
}, (error) => Promise.reject(error));

export default api;
