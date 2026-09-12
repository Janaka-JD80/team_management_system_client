import { Card, CardContent } from '@/components/ui/card';
import { Activity, AlertCircle, FileText } from 'lucide-react';
import type { DashboardSummaryResponse } from '@/types/analytics';

interface SummaryCardsProps {
  summary: DashboardSummaryResponse | undefined;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
      <Card className="shadow-sm border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Total Submitted (This Week)</p>
              <p className="text-3xl font-bold tracking-tight">{summary?.total_submitted || 0}</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-full text-blue-500">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Needs Correction</p>
              <p className="text-3xl font-bold tracking-tight">{summary?.needs_correction || 0}</p>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-full text-amber-500">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-l-4 border-l-destructive hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Open Key Blockers</p>
              <p className="text-3xl font-bold tracking-tight">{summary?.open_blockers || 0}</p>
            </div>
            <div className="p-3 bg-destructive/10 rounded-full text-destructive">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
