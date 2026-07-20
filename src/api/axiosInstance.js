import axios from 'axios';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // Try to check if we are running in the browser and not on localhost
  if (typeof window !== 'undefined' && 
      !window.location.hostname.includes('localhost') && 
      !window.location.hostname.includes('127.0.0.1')) {
    return 'https://envtro-server.onrender.com/api/v1';
  }
  return 'http://localhost:5000/api/v1';
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});



// Response interceptor for handling global errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standard error response handling
    if (error.response && error.response.status === 401) {
      // Handle token expiration/unauthorized access if necessary
      // localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
