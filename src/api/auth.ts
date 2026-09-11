import { http } from '@/lib/http';
import type { UserLogin, UserCreate, TokenResponse } from '@/types/auth';

export const authApi = {
  login: async (credentials: UserLogin) => {
    const response = await http.post<TokenResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: UserCreate) => {
    const response = await http.post<TokenResponse>('/auth/signup', userData);
    return response.data;
  },

  logout: async () => {
    const response = await http.post('/auth/logout');
    return response.data;
  }
};
