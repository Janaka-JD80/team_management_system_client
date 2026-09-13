import { http } from '@/lib/http';
import type { UserWithRolesResponse, AssignRoles } from '@/types/settings';

export const usersApi = {
  getAllUsers: async () => {
    const response = await http.get<UserWithRolesResponse[]>('/users/', { params: { limit: 1000 } });
    return response.data;
  },

  assignRoles: async (userId: string, data: AssignRoles) => {
    const response = await http.put<UserWithRolesResponse>(`/users/${userId}/roles`, data);
    return response.data;
  }
};
