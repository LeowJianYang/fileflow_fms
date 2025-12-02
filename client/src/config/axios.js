import axios from 'axios';

// Set default axios configuration
axios.defaults.withCredentials = true;

// Add request interceptor for debugging
axios.interceptors.request.use(
  (config) => {
   
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axios.interceptors.response.use(
  (response) => {
   
    return response;
  },
  (error) => {
   
    if (error.response?.status === 401) {
      console.warn('Unauthorized - Token may be missing or invalid');
    }
    return Promise.reject(error);
  }
);

export default axios;
