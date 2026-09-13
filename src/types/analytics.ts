export interface DashboardSummaryResponse {
  total_submitted: number;
  needs_correction: number;
  open_blockers: number;
  compliance_rate?: Record<string, number>;
}

export interface LineChartDataPoint {
  date: string;
  value: number;
}

export interface MemberStatus {
  user_id: string;
  full_name: string;
  status: string;
}

export interface ActivityFeedItem {
  report_id: string;
  full_name: string;
  action: string;
  timestamp: string;
}

export interface DashboardChartsResponse {
  time_by_task_type: Record<string, number>;
  tasks_completed_trend: LineChartDataPoint[];
  status_by_member: MemberStatus[];
  workload_by_project: Record<string, number>;
  recent_activity: ActivityFeedItem[];
}

export interface TeamMemberStatsResponse {
  user_id: string;
  full_name: string;
  total_reports: number;
  total_tasks_completed: number;
  avg_tasks_per_week: number;
  total_hours_logged: number;
  tasks_completed_trend: LineChartDataPoint[];
  time_by_task_type: Record<string, number>;
}
