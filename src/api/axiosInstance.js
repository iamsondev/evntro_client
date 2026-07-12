import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
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
