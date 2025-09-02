import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true, // This is important for cookie-based auth
});

export default api;
