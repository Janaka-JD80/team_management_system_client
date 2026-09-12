import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { JwtPayload } from '@/types/auth';

interface AuthState {
  isAuthenticated: boolean;
  user: JwtPayload | null;
  setSession: (user: JwtPayload) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      setSession: (user: JwtPayload) => {
        set({
          isAuthenticated: true,
          user: user,
        });
      },

      clearSession: () => {
        set({
          isAuthenticated: false,
          user: null,
        });
      },
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
    }
  )
);
