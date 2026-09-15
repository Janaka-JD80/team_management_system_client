import { useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useDashboardSummary, useDashboardCharts } from '@/hooks/useAnalyticsQueries';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import { Activity } from 'lucide-react';

import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { TasksTrendChart } from '@/components/dashboard/TasksTrendChart';
import { TimeDistributionChart } from '@/components/dashboard/TimeDistributionChart';
import { WorkloadChart } from '@/components/dashboard/WorkloadChart';
import { MemberStatusList } from '@/components/dashboard/MemberStatusList';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Dashboard() {
  const { user } = useAuthStore();

  // Compute dates for the current week
  const today = new Date();
  const weekStartStr = format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const endDateStr = format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd'); // Trend up to end of week

  const { data: summary, isLoading: isLoadingSummary } = useDashboardSummary(weekStartStr);
  const { data: charts, isLoading: isLoadingCharts } = useDashboardCharts(endDateStr);

  const isLoading = isLoadingSummary || isLoadingCharts;

  // Transform pie chart data
  const pieData = useMemo(() => {
    if (!charts?.time_by_task_type) return [];
    return Object.entries(charts.time_by_task_type)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0);
  }, [charts]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header Section */}
      <div className="flex flex-col gap-2 border-b pb-6">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Manager Dashboard</h2>
        <p className="text-muted-foreground text-lg">
          Welcome back, <span className="text-foreground font-medium">{user?.full_name || user?.user_email}</span>. Here's what's happening this week.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex items-center gap-2 text-muted-foreground">
            <Activity className="w-5 h-5 animate-spin" /> Loading analytics...
          </div>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-12">
          
          {/* Top Level KPIs - Bento Grid Row 1 */}
          <SummaryCards summary={summary} />

          {/* Charts Row - Bento Grid Row 2 */}
          <TasksTrendChart trendData={charts?.tasks_completed_trend} />
          <TimeDistributionChart pieData={pieData} pieColors={PIE_COLORS} />

          {/* Workload and Member Status - Bento Grid Row 3 */}
          <WorkloadChart workloadData={charts?.workload_by_project} />
          
          <div className="md:col-span-4 h-full">
            <MemberStatusList statusData={charts?.status_by_member} />
          </div>

          {/* Activity Feed - Bento Grid Row 4 */}
          <div className="md:col-span-12">
            <ActivityFeed activities={charts?.recent_activity} />
          </div>

        </div>
      )}
    </div>
  );
}
