import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import type { JwtPayload } from '@/types/auth';

interface AuthState {
  isAuthenticated: boolean;
  user: JwtPayload | null;
  setSession: (token: string) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      setSession: (token: string) => {
        try {
          const decoded = jwtDecode<JwtPayload>(token);
          set({
            isAuthenticated: true,
            user: decoded,
          });
        } catch (error) {
          console.error("Failed to decode token", error);
          set({
            isAuthenticated: false,
            user: null,
          });
        }
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
