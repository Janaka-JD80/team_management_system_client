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
