export interface PermissionResponse {
  permission_id: string;
  permission_name: string;
  permission_description: string | null;
}

export interface RoleResponse {
  role_id: string;
  role_name: string;
  role_description: string | null;
}

export interface RoleWithPermissionsResponse extends RoleResponse {
  permissions: PermissionResponse[];
}

export interface UserWithRolesResponse {
  user_id: string;
  user_email: string;
  full_name: string | null;
  is_active: boolean;
  roles: RoleResponse[];
}

export interface AssignRoles {
  role_ids: string[];
}

export interface AssignPermissions {
  permission_ids: string[];
}
