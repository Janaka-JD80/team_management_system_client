import { useNavigate } from 'react-router-dom';
import { Eye, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import type { ReportResponse } from '@/types/reports';
import type { ProjectResponse } from '@/types/projects';

interface ReportsTableProps {
  isLoading: boolean;
  filteredReports: ReportResponse[];
  projectsData: ProjectResponse[];
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  limit: number;
  reportsLength: number;
  onOpenReview: (e: React.MouseEvent, report: ReportResponse, action: 'Approved' | 'Needs Correction') => void;
}

export function ReportsTable({
  isLoading,
  filteredReports,
  projectsData,
  page,
  setPage,
  limit,
  reportsLength,
  onOpenReview
}: ReportsTableProps) {
  const navigate = useNavigate();

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

  const getProjectName = (projectId?: string | null) => {
    if (!projectId) return 'N/A';
    const project = projectsData.find(p => p.project_id === projectId);
    return project ? project.name : 'Unknown';
  };

  if (isLoading) {
    return <div className="h-24 flex items-center justify-center text-muted-foreground">Loading team reports...</div>;
  }

  if (filteredReports.length === 0) {
    return <div className="h-24 flex items-center justify-center text-muted-foreground">No reports found matching filters.</div>;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Team Member</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Week Start</TableHead>
            <TableHead>Week End</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredReports.map((report) => (
            <TableRow 
              key={report.report_id} 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate(`/reports/${report.report_id}/view`)}
            >
              <TableCell className="font-medium">
                <span 
                  className="hover:underline cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/team/profile/${report.user_id}`);
                  }}
                >
                  {report.user_name || report.user_id}
                </span>
              </TableCell>
              <TableCell>{getProjectName(report.project_id)}</TableCell>
              <TableCell>{new Date(report.week_start_date).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(report.week_end_date).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(report.status.status_name) as any}>
                  {report.status.status_name.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={(e) => { e.stopPropagation(); navigate(`/reports/${report.report_id}/view`); }}
                  >
                    <Eye className="w-4 h-4 mr-1" /> View
                  </Button>
                  
                  {report.status.status_name.toLowerCase() === 'submitted' && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={(e) => onOpenReview(e, report, 'Approved')}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" /> Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => onOpenReview(e, report, 'Needs Correction')}
                      >
                        <XCircle className="w-4 h-4 mr-1" /> Request Changes
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="flex items-center justify-end space-x-2 py-4">
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
          disabled={reportsLength < limit}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
