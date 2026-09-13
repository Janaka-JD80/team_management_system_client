import { useState } from 'react';
import { useReportSummary } from '@/hooks/useReportQueries';
import { format, startOfWeek, subWeeks } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, User, AlertCircle, Trophy, CheckSquare, ListTodo, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { TaskCompleted, TaskPlanned, Blocker, Achievement } from '@/types/reports';

export function TeamSummaryTab() {
  const [currentWeek, setCurrentWeek] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [section, setSection] = useState('blockers');

  const weekStartStr = format(currentWeek, 'yyyy-MM-dd');
  const weekEndStr = format(new Date(currentWeek.getTime() + 6 * 24 * 60 * 60 * 1000), 'MMM d, yyyy');

  const { data: summaryData, isLoading } = useReportSummary(weekStartStr, section);

  const handlePrevWeek = () => setCurrentWeek(prev => subWeeks(prev, 1));
  const handleNextWeek = () => setCurrentWeek(prev => new Date(prev.getTime() + 7 * 24 * 60 * 60 * 1000));

  const renderDataContent = (dataArray: any[]) => {
    if (!dataArray || dataArray.length === 0) {
      return <p className="text-sm text-muted-foreground italic">No data reported.</p>;
    }

    if (section === 'blockers') {
      return (
        <ul className="space-y-2">
          {(dataArray as Blocker[]).map((b, i) => (
            <li key={i} className="text-sm flex gap-2">
              <AlertCircle className={`w-4 h-4 mt-0.5 shrink-0 ${b.is_key_issue ? 'text-destructive' : 'text-amber-500'}`} />
              <span>{b.description}</span>
            </li>
          ))}
        </ul>
      );
    }
    
    if (section === 'achievements') {
      return (
        <ul className="space-y-2">
          {(dataArray as Achievement[]).map((a, i) => (
            <li key={i} className="text-sm flex gap-2">
              <Trophy className={`w-4 h-4 mt-0.5 shrink-0 ${a.is_key_achievement ? 'text-emerald-500' : 'text-blue-500'}`} />
              <span>{a.description}</span>
            </li>
          ))}
        </ul>
      );
    }

    if (section === 'tasks_completed') {
      return (
        <div className="space-y-3">
          {(dataArray as TaskCompleted[]).map((t, i) => (
            <div key={i} className="border-b last:border-0 pb-2 last:pb-0">
              <div className="flex justify-between items-start gap-2">
                <span className="text-sm font-medium">{t.task_name}</span>
                <Badge variant={t.status === 'Completed' ? 'success' : 'secondary'} className="text-[10px] shrink-0">
                  {t.status}
                </Badge>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span>{t.time_spent_hours}h spent</span>
                <span>{t.actual_percent}% done</span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (section === 'tasks_planned') {
      return (
        <ul className="space-y-2">
          {(dataArray as TaskPlanned[]).map((t, i) => (
            <li key={i} className="text-sm flex items-start gap-2">
              <ListTodo className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
              <div>
                <span className="font-medium block">{t.task_name}</span>
                <span className="text-xs text-muted-foreground">{t.time_planned_hours}h planned</span>
              </div>
            </li>
          ))}
        </ul>
      );
    }

    return <p className="text-sm text-muted-foreground">Unknown section data.</p>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg border">
        
        {/* Week Selector */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={handlePrevWeek}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2 px-4 py-2 bg-background border rounded-md min-w-[200px] justify-center">
            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {format(currentWeek, 'MMM d')} - {weekEndStr}
            </span>
          </div>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Section Selector */}
        <Select value={section} onValueChange={setSection}>
          <SelectTrigger className="w-[200px] bg-background">
            <SelectValue placeholder="Select section..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="blockers">Blockers & Issues</SelectItem>
            <SelectItem value="achievements">Key Achievements</SelectItem>
            <SelectItem value="tasks_completed">Tasks Completed</SelectItem>
            <SelectItem value="tasks_planned">Tasks Planned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="h-48 flex items-center justify-center text-muted-foreground animate-pulse">
          Loading team summary...
        </div>
      ) : !summaryData || summaryData.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-muted-foreground border border-dashed rounded-lg">
          No reports found for this week.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {summaryData.map((userSummary) => (
            <Card key={userSummary.user_id} className="shadow-sm flex flex-col h-full max-h-[400px]">
              <CardHeader className="py-3 px-4 border-b bg-muted/20">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
                    <User className="w-3 h-3" />
                  </div>
                  {userSummary.full_name || 'Unknown User'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex-1 overflow-y-auto">
                {renderDataContent(userSummary.data)}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
