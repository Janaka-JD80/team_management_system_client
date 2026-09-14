import { useState, useMemo, useEffect } from 'react';
import { useAllReports, useManagerReview } from '@/hooks/useReportQueries';
import { useAllProjects } from '@/hooks/useProjectQueries';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DateRange } from 'react-day-picker';
import type { ReportResponse } from '@/types/reports';
import { DashboardFilters } from '@/components/reports/DashboardFilters';
import { ReportsTable } from '@/components/reports/ReportsTable';
import { ReviewDialog } from '@/components/reports/ReviewDialog';
import { TeamSummaryTab } from '@/components/reports/TeamSummaryTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ManagerDashboard() {
  // Filters state
  const [page, setPage] = useState(1);
  const limit = 10;
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce logic for search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Backend filters
  const [projectIdFilter, setProjectIdFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date()
  });

  const { data: projectsData = [] } = useAllProjects();
  
  const { data: reports = [], isLoading } = useAllReports({
    skip: (page - 1) * limit,
    limit: limit,
    search: debouncedSearch || undefined,
    project_id: projectIdFilter !== 'all' ? projectIdFilter : undefined,
    start_date: date?.from ? format(date.from, 'yyyy-MM-dd') : undefined,
    end_date: date?.to ? format(date.to, 'yyyy-MM-dd') : undefined,
  });

  const managerReview = useManagerReview();
  
  const [selectedReport, setSelectedReport] = useState<ReportResponse | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<'Approved' | 'Needs Correction'>('Approved');
  const [reviewComment, setReviewComment] = useState('');

  // Frontend status filter
  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      if (statusFilter !== 'all' && r.status.status_name.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }
      return true;
    });
  }, [reports, statusFilter]);

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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Team Reports</h2>
        <p className="text-muted-foreground mt-1">Review and analyze reports submitted by your team.</p>
      </div>

      <Tabs defaultValue="submissions" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="submissions">All Submissions</TabsTrigger>
          <TabsTrigger value="summary">Weekly Team Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="submissions" className="space-y-8 mt-0">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Filters & Search</CardTitle>
            </CardHeader>
            <CardContent>
              <DashboardFilters 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                projectIdFilter={projectIdFilter}
                setProjectIdFilter={setProjectIdFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                date={date}
                setDate={setDate}
                projectsData={projectsData}
                setPage={setPage}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <ReportsTable 
                isLoading={isLoading}
                filteredReports={filteredReports}
                projectsData={projectsData}
                page={page}
                setPage={setPage}
                limit={limit}
                reportsLength={reports.length}
                onOpenReview={handleOpenReview}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="mt-0">
          <TeamSummaryTab />
        </TabsContent>
      </Tabs>

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
