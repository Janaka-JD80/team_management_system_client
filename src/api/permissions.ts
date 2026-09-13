import { http } from '@/lib/http';
import type { PermissionResponse } from '@/types/settings';

export const permissionsApi = {
  getAllPermissions: async () => {
    const response = await http.get<PermissionResponse[]>('/permissions/', { params: { limit: 1000 } });
    return response.data;
  }
};
