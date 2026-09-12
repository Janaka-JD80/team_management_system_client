import { useNavigate } from 'react-router-dom';
import { useMyReports } from '@/hooks/useReportQueries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ReportResponse } from '@/types/reports';

export default function ReportHistory() {
  const navigate = useNavigate();
  const { data: reports, isLoading, isError } = useMyReports();

  const getStatusVariant = (statusName: string) => {
    switch (statusName.toLowerCase()) {
      case 'approved': return 'success';
      case 'needs correction': return 'destructive';
      case 'submitted': return 'default';
      default: return 'secondary'; // Draft
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Reports</h2>
          <p className="text-muted-foreground">
            View your report history and create new weekly reports.
          </p>
        </div>
        <Button onClick={() => navigate('/reports/new')}>
          Create Report
        </Button>
      </div>

      <div className="rounded-md border bg-card text-card-foreground shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading reports...</div>
        ) : isError ? (
          <div className="p-8 text-center text-destructive">Failed to load reports.</div>
        ) : !reports || reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <h3 className="mt-4 text-lg font-semibold">No reports yet</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              You haven't created any weekly reports. Click the button above to get started.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Week</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Version</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report: ReportResponse) => (
                <TableRow key={report.report_id}>
                  <TableCell className="font-medium">
                    {report.week_start_date} to {report.week_end_date}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(report.status.status_name)}>
                      {report.status.status_name}
                    </Badge>
                  </TableCell>
                  <TableCell>v{report.current_version_num}</TableCell>
                  <TableCell className="text-right">
                    {['Draft', 'Needs Correction'].includes(report.status.status_name) ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/reports/${report.report_id}/edit`)}
                      >
                        Edit
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/reports/${report.report_id}`)}
                      >
                        View
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
