import { http } from '@/lib/http';
import type { ProjectResponse } from '@/types/projects';

export interface ProjectCreate {
  name: string;
  description?: string;
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
}

export const projectsApi = {
  getAllProjects: async () => {
    const response = await http.get<ProjectResponse[]>('/projects/', { params: { limit: 1000 } });
    return response.data;
  },

  createProject: async (data: ProjectCreate) => {
    const response = await http.post<ProjectResponse>('/projects/', data);
    return response.data;
  },

  updateProject: async (projectId: string, data: ProjectUpdate) => {
    const response = await http.put<ProjectResponse>(`/projects/${projectId}`, data);
    return response.data;
  },

  deleteProject: async (projectId: string) => {
    await http.delete(`/projects/${projectId}`);
  }
};
