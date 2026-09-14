import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

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

http.interceptors.response.use(
  (response) => {
    if (response.data && response.data.status === false && response.data.message === 'Not authenticated') {
      useAuthStore.getState().clearSession();
      window.location.href = '/login';
      return response;
    }

    if (response.data && typeof response.data.status === 'boolean' && 'data' in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    if (error.response?.data?.status === false && error.response?.data?.message === 'Not authenticated') {
      useAuthStore.getState().clearSession();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
