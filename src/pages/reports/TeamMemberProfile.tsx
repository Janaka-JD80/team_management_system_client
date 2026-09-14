import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTeamMemberStats } from '@/hooks/useAnalyticsQueries';
import { useAllReports, useManagerReview } from '@/hooks/useReportQueries';
import { useAllProjects } from '@/hooks/useProjectQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, FileText, CheckSquare, TrendingUp, Clock } from 'lucide-react';
import { TasksTrendChart } from '@/components/dashboard/TasksTrendChart';
import { TimeDistributionChart } from '@/components/dashboard/TimeDistributionChart';
import { ReportsTable } from '@/components/reports/ReportsTable';
import { ReviewDialog } from '@/components/reports/ReviewDialog';
import type { ReportResponse } from '@/types/reports';

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function TeamMemberProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: stats, isLoading: isLoadingStats } = useTeamMemberStats(id);
  const { data: projectsData = [] } = useAllProjects();
  const { data: reports = [], isLoading: isLoadingReports } = useAllReports({
    user_id: id,
    skip: (page - 1) * limit,
    limit: limit,
  });

  const managerReview = useManagerReview();
  const [selectedReport, setSelectedReport] = useState<ReportResponse | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<'Approved' | 'Needs Correction'>('Approved');
  const [reviewComment, setReviewComment] = useState('');

  const pieData = useMemo(() => {
    if (!stats?.time_by_task_type) return [];
    return Object.entries(stats.time_by_task_type)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0);
  }, [stats]);

  const handleOpenReview = (e: React.MouseEvent, report: ReportResponse, action: 'Approved' | 'Needs Correction') => {
    e.stopPropagation(); 
    setSelectedReport(report);
    setReviewAction(action);
    setReviewComment('');
    setIsReviewDialogOpen(true);
  };

  const submitReview = async () => {
    if (!selectedReport) return;
    try {
      await managerReview.mutateAsync({
        reportId: selectedReport.report_id,
        data: {
          action: reviewAction,
          comment: reviewComment || null
        }
      });
      setIsReviewDialogOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoadingStats) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground animate-pulse">
        Loading profile...
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-muted-foreground text-lg">Team member not found.</p>
        <Button onClick={() => navigate('/team-reports')} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Team Reports
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/team-reports')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              {stats.full_name?.substring(0, 2).toUpperCase() || <User className="w-5 h-5" />}
            </div>
            {stats.full_name}
          </h2>
          <p className="text-muted-foreground mt-1">Individual Performance Profile</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                <p className="text-3xl font-bold tracking-tight">{stats.total_reports}</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-full text-blue-500">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-l-emerald-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Tasks Completed</p>
                <p className="text-3xl font-bold tracking-tight">{stats.total_tasks_completed}</p>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-500">
                <CheckSquare className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-l-amber-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Avg Tasks / Week</p>
                <p className="text-3xl font-bold tracking-tight">{stats.avg_tasks_per_week.toFixed(1)}</p>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-full text-amber-500">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Hours Logged</p>
                <p className="text-3xl font-bold tracking-tight">{stats.total_hours_logged}</p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-full text-purple-500">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-12">
        <TasksTrendChart trendData={stats.tasks_completed_trend} />
        <TimeDistributionChart pieData={pieData} pieColors={PIE_COLORS} />
      </div>

      {/* Report History */}
      <Card>
        <CardHeader>
          <CardTitle>Report History</CardTitle>
        </CardHeader>
        <CardContent>
          <ReportsTable 
            isLoading={isLoadingReports}
            filteredReports={reports}
            projectsData={projectsData}
            page={page}
            setPage={setPage}
            limit={limit}
            reportsLength={reports.length}
            onOpenReview={handleOpenReview}
          />
        </CardContent>
      </Card>

      <ReviewDialog 
        isOpen={isReviewDialogOpen}
        onOpenChange={setIsReviewDialogOpen}
        action={reviewAction}
        comment={reviewComment}
        setComment={setReviewComment}
        onSubmit={submitReview}
        isPending={managerReview.isPending}
      />
    </div>
  );
}
