import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReport, useManagerReview } from '@/hooks/useReportQueries';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronLeft, CheckCircle, XCircle, Clock, AlertTriangle, Trophy, FileText, CheckCircle2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ReviewDialog } from '@/components/reports/ReviewDialog';

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: report, isLoading } = useReport(id);
  const { user } = useAuthStore();
  const managerReview = useManagerReview();

  const isManager = user?.roles?.includes('manager');

  const [activeVersionId, setActiveVersionId] = useState<string>('latest');
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<'Approved' | 'Needs Correction'>('Approved');
  const [reviewComment, setReviewComment] = useState('');

  if (isLoading) {
    return <div className="p-8 flex justify-center text-muted-foreground">Loading report details...</div>;
  }

  if (!report || !report.latest_version) {
    return <div className="p-8 flex justify-center text-muted-foreground">Report not found.</div>;
  }

  const versions = [report.latest_version, ...(report.past_versions || [])].sort((a, b) => b.version_num - a.version_num);
  const activeV = activeVersionId === 'latest' 
    ? report.latest_version 
    : (versions.find(v => v.version_id === activeVersionId) || report.latest_version);

  const isLatest = activeV.version_id === report.latest_version.version_id;

  const handleOpenReview = (action: 'Approved' | 'Needs Correction') => {
    setReviewAction(action);
    setReviewComment('');
    setIsReviewDialogOpen(true);
  };

  const submitReview = async () => {
    if (!report) return;
    try {
      await managerReview.mutateAsync({
        reportId: report.report_id,
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

  const getStatusBadgeVariant = (statusName: string) => {
    switch (statusName.toLowerCase()) {
      case 'approved': return 'success';
      case 'needs_correction':
      case 'needs correction': return 'destructive';
      case 'submitted': return 'default';
      case 'draft': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-b border-border -mx-4 px-4 sm:-mx-0 sm:px-0">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="shrink-0">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Report Details
              </h2>
              <Badge variant={getStatusBadgeVariant(report.status.status_name) as any} className="text-sm">
                {report.status.status_name.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1 text-sm flex items-center gap-2 flex-wrap">
              <span className="font-medium text-foreground">{report.user_name || `User ${report.user_id}`}</span> 
              <span>•</span>
              <span>{report.project_name || 'No Project'}</span>
              <span>•</span>
              <span>Week: {report.week_start_date} to {report.week_end_date}</span>
            </p>
          </div>
        </div>

        {isManager && report.status.status_name.toLowerCase() === 'submitted' && (
          <div className="flex items-center gap-3">
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleOpenReview('Approved')}
            >
              <CheckCircle className="w-4 h-4 mr-2" /> Approve
            </Button>
            <Button 
              variant="destructive"
              onClick={() => handleOpenReview('Needs Correction')}
            >
              <XCircle className="w-4 h-4 mr-2" /> Request Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Sidebar / Versions */}
        {versions.length > 1 && (
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5" /> Version History
            </h3>
            <div className="flex flex-col gap-2">
              {versions.map((v) => (
                <button
                  key={v.version_id}
                  onClick={() => setActiveVersionId(v.version_id === report.latest_version.version_id ? 'latest' : v.version_id)}
                  className={`text-left px-4 py-3 rounded-lg border transition-all ${
                    (activeVersionId === 'latest' && v.version_id === report.latest_version.version_id) || activeVersionId === v.version_id
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="font-medium flex items-center justify-between">
                    <span>Version {v.version_num}</span>
                    {v.version_id === report.latest_version.version_id && (
                      <Badge variant="secondary" className="text-xs">Latest</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(v.created_at).toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={versions.length > 1 ? "md:col-span-9 space-y-8" : "md:col-span-12 space-y-8"}>
          
          {!isLatest && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 p-4 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold">Viewing Past Version</h4>
                <p className="text-sm mt-1">You are viewing Version {activeV.version_num}. This is not the latest submission.</p>
              </div>
            </div>
          )}

          {activeV.manager_comment && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-primary">
                  <FileText className="w-5 h-5" /> Manager Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm">{activeV.manager_comment}</p>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeV.hours_worked_by_type && Object.entries(activeV.hours_worked_by_type).map(([type, hours]) => (
              <Card key={type}>
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-muted-foreground">{type}</p>
                  <h4 className="text-2xl font-bold mt-2">{hours as number} <span className="text-sm font-normal text-muted-foreground">hrs</span></h4>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Achievements & Blockers */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-green-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Trophy className="w-5 h-5" /> Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeV.achievements.length === 0 ? (
                  <p className="text-muted-foreground text-sm">None reported.</p>
                ) : (
                  <ul className="space-y-3">
                    {activeV.achievements.map((a, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className={`w-5 h-5 mt-0.5 shrink-0 ${a.is_key_achievement ? 'text-amber-500' : 'text-green-500/50'}`} />
                        <span>{a.description}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card className="border-destructive/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Blockers & Challenges
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeV.blockers.length === 0 ? (
                  <p className="text-muted-foreground text-sm">None reported.</p>
                ) : (
                  <ul className="space-y-3">
                    {activeV.blockers.map((b, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <XCircle className={`w-5 h-5 mt-0.5 shrink-0 ${b.is_key_issue ? 'text-destructive' : 'text-destructive/50'}`} />
                        <span>{b.description}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tasks Completed</CardTitle>
              <CardDescription>Work finished during this week</CardDescription>
            </CardHeader>
            <CardContent>
              {activeV.tasks_completed.length === 0 ? (
                <p className="text-muted-foreground text-sm">No tasks completed.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Task Name</TableHead>
                      <TableHead>Output Produced</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Planned (hrs)</TableHead>
                      <TableHead className="text-right">Spent (hrs)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeV.tasks_completed.map((task, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">
                          {task.task_name}
                          {task.priority === 'High' && <Badge variant="destructive" className="ml-2 text-[10px] px-1 py-0 h-4">High</Badge>}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {task.output_produced || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{task.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{task.time_planned_hours}</TableCell>
                        <TableCell className="text-right font-medium">{task.time_spent_hours}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tasks Planned for Next Week</CardTitle>
              <CardDescription>Upcoming work schedule</CardDescription>
            </CardHeader>
            <CardContent>
              {activeV.tasks_planned.length === 0 ? (
                <p className="text-muted-foreground text-sm">No tasks planned.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60%]">Task Name</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead className="text-right">Planned (hrs)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeV.tasks_planned.map((task, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{task.task_name}</TableCell>
                        <TableCell>
                          <Badge variant={task.priority === 'High' ? 'destructive' : 'secondary'}>
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">{task.time_planned_hours}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {activeV.optional_notes && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">{activeV.optional_notes}</p>
              </CardContent>
            </Card>
          )}

        </div>
      </div>

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
