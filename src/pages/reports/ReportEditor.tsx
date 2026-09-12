import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useReport, useCreateDraft, useUpdateReport, useSubmitReport } from '@/hooks/useReportQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { TaskCompletedTable, emptyTaskCompleted } from '@/components/reports/TaskCompletedTable';
import { TaskPlannedList, emptyTaskPlanned } from '@/components/reports/TaskPlannedList';
import { BlockersAchievementsForm } from '@/components/reports/BlockersAchievementsForm';
import type { ReportCreate } from '@/types/reports';
import { ChevronLeft, Save, Send } from 'lucide-react';

export default function ReportEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id && id !== 'new';
  
  const { data: existingReport, isLoading } = useReport(isEditing ? id : undefined);
  const createDraft = useCreateDraft();
  const updateReport = useUpdateReport();
  const submitReport = useSubmitReport();

  const [formData, setFormData] = useState<ReportCreate>({
    week_start_date: '',
    week_end_date: '',
    tasks_completed: [{ ...emptyTaskCompleted }],
    tasks_planned: [{ ...emptyTaskPlanned }],
    blockers: [],
    achievements: [],
  });

  useEffect(() => {
    if (existingReport && existingReport.latest_version) {
      const v = existingReport.latest_version;
      setFormData({
        week_start_date: existingReport.week_start_date,
        week_end_date: existingReport.week_end_date,
        project_id: existingReport.project_id,
        tasks_completed: v.tasks_completed.length ? v.tasks_completed : [{ ...emptyTaskCompleted }],
        tasks_planned: v.tasks_planned.length ? v.tasks_planned : [{ ...emptyTaskPlanned }],
        blockers: v.blockers.length ? v.blockers : [],
        achievements: v.achievements.length ? v.achievements : [],
        hours_worked_by_type: v.hours_worked_by_type,
        optional_notes: v.optional_notes,
      });
    }
  }, [existingReport]);

  const handleSaveDraft = async () => {
    try {
      if (isEditing) {
        await updateReport.mutateAsync({ reportId: id!, data: formData });
      } else {
        const result = await createDraft.mutateAsync(formData);
        navigate(`/reports/${result.report_id}/edit`);
      }
    } catch (error) {
      console.error('Failed to save draft', error);
    }
  };

  const handleSubmit = async () => {
    try {
      let reportId = id;
      if (isEditing) {
        await updateReport.mutateAsync({ reportId: id!, data: formData });
      } else {
        const result = await createDraft.mutateAsync(formData);
        reportId = result.report_id;
      }
      await submitReport.mutateAsync(reportId!);
      navigate('/reports');
    } catch (error) {
      console.error('Failed to submit report', error);
    }
  };

  if (isEditing && isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        <div className="animate-pulse flex items-center gap-2">
          <div className="w-4 h-4 bg-primary rounded-full animate-bounce" />
          <div className="w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
    );
  }

  const isSaving = createDraft.isPending || updateReport.isPending || submitReport.isPending;

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-16 z-40 bg-background/80 backdrop-blur-md py-4 -mx-4 px-4 sm:-mx-0 sm:px-0 border-b sm:border-b-0 border-border">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/reports')} className="mr-2">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {isEditing ? 'Edit Report' : 'New Weekly Report'}
            </h2>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving} className="bg-white">
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            <Send className="w-4 h-4 mr-2" />
            Submit
          </Button>
        </div>
      </div>

      {/* Date Range Selection */}
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Week Start Date</Label>
              <Input 
                type="date" 
                value={formData.week_start_date} 
                onChange={(e) => setFormData({ ...formData, week_start_date: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <Label>Week End Date</Label>
              <Input 
                type="date" 
                value={formData.week_end_date} 
                onChange={(e) => setFormData({ ...formData, week_end_date: e.target.value })} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Extracted Components */}
      <TaskCompletedTable 
        tasks={formData.tasks_completed} 
        onChange={(tasks) => setFormData({ ...formData, tasks_completed: tasks })} 
      />

      <TaskPlannedList 
        tasks={formData.tasks_planned} 
        onChange={(tasks) => setFormData({ ...formData, tasks_planned: tasks })} 
      />

      <BlockersAchievementsForm 
        blockers={formData.blockers} 
        achievements={formData.achievements} 
        onChangeBlockers={(b) => setFormData({ ...formData, blockers: b })} 
        onChangeAchievements={(a) => setFormData({ ...formData, achievements: a })} 
      />
      
    </div>
  );
}
