import axios from 'axios';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_VERSION || '/api/v1' ,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (can be used for other headers if needed)
http.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
