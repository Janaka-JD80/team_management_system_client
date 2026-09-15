import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyReports } from '@/hooks/useReportQueries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, ChevronLeft, ChevronRight, FileText, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { DateRange } from 'react-day-picker';
import type { ReportResponse } from '@/types/reports';

export default function ReportHistory() {
  const navigate = useNavigate();
  
  const [page, setPage] = useState(1);
  const limit = 10;
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date()
  });

  const { data: reports = [], isLoading, isError } = useMyReports({
    skip: (page - 1) * limit,
    limit: limit,
    start_date: date?.from ? format(date.from, 'yyyy-MM-dd') : undefined,
    end_date: date?.to ? format(date.to, 'yyyy-MM-dd') : undefined,
  });

  const getStatusVariant = (statusName: string) => {
    switch (statusName.toLowerCase()) {
      case 'approved': return 'success';
      case 'needs_correction':
      case 'needs correction': return 'destructive';
      case 'submitted': return 'default';
      default: return 'secondary'; // Draft
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Reports</h2>
          <p className="text-muted-foreground mt-1">
            View your report history and create new weekly reports.
          </p>
        </div>
        <Button onClick={() => navigate('/reports/new')} className="shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          Create Report
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Filter by Date Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full max-w-sm justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={(d) => { setDate(d); setPage(1); }}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
            {date?.from && (
              <Button variant="ghost" onClick={() => { setDate(undefined); setPage(1); }}>
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground">Loading reports...</div>
          ) : isError ? (
            <div className="p-12 text-center text-destructive">Failed to load reports.</div>
          ) : !reports || reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">No reports found</h3>
              <p className="mt-2 text-muted-foreground max-w-sm">
                You haven't created any weekly reports for this date range. Click the button above to get started.
              </p>
            </div>
          ) : (
            <>
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
                    <TableRow 
                      key={report.report_id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        const statusStr = report.status.status_name.toLowerCase();
                        if (['draft', 'needs correction', 'needs_correction'].includes(statusStr)) {
                          navigate(`/reports/${report.report_id}/edit`);
                        } else {
                          navigate(`/reports/${report.report_id}/view`);
                        }
                      }}
                    >
                      <TableCell className="font-medium">
                        {report.week_start_date} to {report.week_end_date}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(report.status.status_name) as any}>
                          {report.status.status_name.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>v{report.current_version_num}</TableCell>
                      <TableCell className="text-right">
                        {['draft', 'needs correction', 'needs_correction'].includes(report.status.status_name.toLowerCase()) ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e: any) => { e.stopPropagation(); navigate(`/reports/${report.report_id}/edit`); }}
                          >
                            Edit
                          </Button>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={(e: any) => { e.stopPropagation(); navigate(`/reports/${report.report_id}/view`); }}
                          >
                            View
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-end space-x-2 p-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <div className="text-sm text-muted-foreground">Page {page}</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={reports.length < limit}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
