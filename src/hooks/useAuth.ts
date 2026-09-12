import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import type { UserLogin, UserCreate } from '@/types/auth';

export function useLogin() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (credentials: UserLogin) => authApi.login(credentials),
    onSuccess: (data) => {
      setSession(data.user);
      navigate('/');
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (userData: UserCreate) => authApi.register(userData),
    onSuccess: (data) => {
      setSession(data.user);
      navigate('/');
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const clearSession = useAuthStore((state) => state.clearSession);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearSession();
      navigate('/login');
    },
    onError: () => {
      clearSession();
      navigate('/login');
    }
  });
}
