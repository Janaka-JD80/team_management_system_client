import { http } from '@/lib/http';
import type { RoleResponse, RoleWithPermissionsResponse, AssignPermissions } from '@/types/settings';

export const rolesApi = {
  getAllRoles: async () => {
    const response = await http.get<RoleResponse[]>('/roles/', { params: { limit: 1000 } });
    return response.data;
  },

  createRole: async (role_name: string, role_description?: string) => {
    const response = await http.post<RoleResponse>('/roles/', { role_name, role_description });
    return response.data;
  },

  getRole: async (roleId: string) => {
    const response = await http.get<RoleWithPermissionsResponse>(`/roles/${roleId}`);
    return response.data;
  },

  deleteRole: async (roleId: string) => {
    await http.delete(`/roles/${roleId}`);
  },

  assignPermissions: async (roleId: string, data: AssignPermissions) => {
    const response = await http.put<RoleWithPermissionsResponse>(`/roles/${roleId}/permissions`, data);
    return response.data;
  }
};
