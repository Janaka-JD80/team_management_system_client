import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import type { ReactNode } from 'react';

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user } = useAuthStore();
  
  if (!user?.roles.includes('admin')) {
    if (user?.roles.includes('manager')) {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/reports" replace />;
  }

  return <>{children}</>;
}
