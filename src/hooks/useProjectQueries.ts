import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '@/api/projects';

export function useAllProjects() {
  return useQuery({
    queryKey: ['all-projects'],
    queryFn: () => projectsApi.getAllProjects(),
  });
}
