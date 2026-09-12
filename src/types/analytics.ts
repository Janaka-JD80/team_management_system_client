export interface DashboardSummaryResponse {
  total_submitted: number;
  needs_correction: number;
  open_blockers: number;
}

export interface LineChartDataPoint {
  date: string;
  value: number;
}

export interface DashboardChartsResponse {
  time_by_task_type: Record<string, number>;
  tasks_completed_trend: LineChartDataPoint[];
}
