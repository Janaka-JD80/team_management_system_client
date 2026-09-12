export interface ProjectResponse {
  project_id: string;
  name: string;
  description?: string | null;
  is_active?: boolean;
}
