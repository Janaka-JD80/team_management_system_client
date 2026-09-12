import { http } from '@/lib/http';
import type { ProjectResponse } from '@/types/projects';

export const projectsApi = {
  getAllProjects: async () => {
    const response = await http.get<ProjectResponse[]>('/projects/', { params: { limit: 1000 } });
    return response.data;
  },
};
