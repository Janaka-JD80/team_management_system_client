import { useParams, useNavigate } from 'react-router-dom';
import { useReport } from '@/hooks/useReportQueries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: report, isLoading } = useReport(id);

  if (isLoading) {
    return <div className="p-8">Loading report details...</div>;
  }

  if (!report || !report.latest_version) {
    return <div className="p-8">Report not found.</div>;
  }

  const v = report.latest_version;

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex items-center gap-4 sticky top-16 z-40 bg-background/80 backdrop-blur-md py-4 border-b border-border -mx-4 px-4 sm:-mx-0 sm:px-0">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Report Details
            </h2>
            <Badge variant={
              report.status.status_name === 'Approved' ? 'default' : 
              report.status.status_name === 'Needs Correction' ? 'destructive' : 
              'secondary'
            }>
              {report.status.status_name}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Submitted by {report.user_name || `User ${report.user_id}`} for week {report.week_start_date} to {report.week_end_date}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tasks Completed</CardTitle>
        </CardHeader>
        <CardContent>
          {v.tasks_completed.length === 0 ? (
            <p className="text-muted-foreground">No tasks completed.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task Name</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plan Hrs</TableHead>
                  <TableHead>Spent Hrs</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {v.tasks_completed.map((task, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{task.task_name}</TableCell>
                    <TableCell>{task.priority}</TableCell>
                    <TableCell>{task.status}</TableCell>
                    <TableCell>{task.time_planned_hours}</TableCell>
                    <TableCell>{task.time_spent_hours}</TableCell>
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
        </CardHeader>
        <CardContent>
          {v.tasks_planned.length === 0 ? (
            <p className="text-muted-foreground">No tasks planned.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task Name</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Plan Hrs</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {v.tasks_planned.map((task, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{task.task_name}</TableCell>
                    <TableCell>{task.priority}</TableCell>
                    <TableCell>{task.time_planned_hours}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Blockers & Challenges</CardTitle>
          </CardHeader>
          <CardContent>
            {v.blockers.length === 0 ? (
              <p className="text-muted-foreground">None reported.</p>
            ) : (
              <ul className="list-disc pl-5 space-y-2">
                {v.blockers.map((b, i) => (
                  <li key={i}>{b.description}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            {v.achievements.length === 0 ? (
              <p className="text-muted-foreground">None reported.</p>
            ) : (
              <ul className="list-disc pl-5 space-y-2">
                {v.achievements.map((a, i) => (
                  <li key={i}>{a.description}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
