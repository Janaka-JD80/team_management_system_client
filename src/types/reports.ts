export interface TaskCompleted {
  task_name: string;
  priority: string;
  planned_percent: number;
  actual_percent: number;
  status: string;
  time_planned_hours: number;
  time_spent_hours: number;
  output_produced?: string | null;
}

export interface TaskPlanned {
  task_name: string;
  priority: string;
  time_planned_hours: number;
}

export interface Blocker {
  description: string;
  is_key_issue: boolean;
}

export interface Achievement {
  description: string;
  is_key_achievement: boolean;
}

export interface ReportStatusResponse {
  status_id: string;
  status_name: string;
  description?: string | null;
}

export interface ReportResponse {
  report_id: string;
  user_id: string;
  user_name?: string | null;
  project_id?: string | null;
  project_name?: string | null;
  week_start_date: string; // date string YYYY-MM-DD
  week_end_date: string;
  current_status_id: string;
  current_version_num: number;
  status: ReportStatusResponse;
}

export interface ReportVersionResponse {
  version_id: string;
  report_id: string;
  version_num: number;
  status: ReportStatusResponse;
  manager_comment?: string | null;
  tasks_completed: TaskCompleted[];
  tasks_planned: TaskPlanned[];
  blockers: Blocker[];
  achievements: Achievement[];
  hours_worked_by_type: Record<string, number>;
  optional_notes?: string | null;
  created_at: string;
}

export interface ReportWithLatestVersionResponse extends ReportResponse {
  latest_version: ReportVersionResponse;
  past_versions?: ReportVersionResponse[];
}

export interface ReportCreate {
  project_id?: string | null;
  week_start_date: string;
  week_end_date: string;
  tasks_completed: TaskCompleted[];
  tasks_planned: TaskPlanned[];
  blockers: Blocker[];
  achievements: Achievement[];
  hours_worked_by_type?: Record<string, number>;
  optional_notes?: string | null;
}

export interface ReportUpdate extends Partial<ReportCreate> {}
