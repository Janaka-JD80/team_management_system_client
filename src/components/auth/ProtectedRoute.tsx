import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
}

export function ProtectedRoute({ children, requiredRoles, requiredPermissions }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const hasRole = requiredRoles.some(role => user.roles.includes(role));
    if (!hasRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasPermission = requiredPermissions.some(perm => user.permissions.includes(perm));
    if (!hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
}
