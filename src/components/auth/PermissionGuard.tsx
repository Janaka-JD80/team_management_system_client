import React from 'react';
import { useAuthStore } from '@/store/authStore';

interface PermissionGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  allowedPermissions?: string[];
  requireBoth?: boolean;
  fallback?: React.ReactNode;
}

export function PermissionGuard({
  children,
  allowedRoles,
  allowedPermissions,
  requireBoth = false,
  fallback = null,
}: PermissionGuardProps) {
  const { user } = useAuthStore();

  if (!user) return <>{fallback}</>;

  const hasRole = allowedRoles && allowedRoles.length > 0 
    ? allowedRoles.some((role) => user.roles.includes(role))
    : true; 

  const hasPermission = allowedPermissions && allowedPermissions.length > 0
    ? allowedPermissions.some((perm) => user.permissions.includes(perm))
    : true; 

  let isAllowed = false;

  if (allowedRoles && allowedPermissions) {
    isAllowed = requireBoth ? (hasRole && hasPermission) : (hasRole || hasPermission);
  } else if (allowedRoles) {
    isAllowed = hasRole;
  } else if (allowedPermissions) {
    isAllowed = hasPermission;
  } else {
    isAllowed = true;
  }

  return isAllowed ? <>{children}</> : <>{fallback}</>;
}
