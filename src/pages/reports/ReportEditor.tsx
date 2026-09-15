import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useReport, useCreateDraft, useUpdateReport, useSubmitReport } from '@/hooks/useReportQueries';
import { useAllProjects } from '@/hooks/useProjectQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TaskCompletedTable, emptyTaskCompleted } from '@/components/reports/TaskCompletedTable';
import { TaskPlannedList, emptyTaskPlanned } from '@/components/reports/TaskPlannedList';
import { BlockersAchievementsForm } from '@/components/reports/BlockersAchievementsForm';
import type { ReportCreate } from '@/types/reports';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, startOfWeek, endOfWeek, parse } from 'date-fns';
import { cn } from '@/lib/utils';
import { ChevronLeft, Save, Send, Briefcase, Clock, FileText, CalendarIcon } from 'lucide-react';
export default function ReportEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id && id !== 'new';
  
  const { data: existingReport, isLoading } = useReport(isEditing ? id : undefined);
  const { data: projectsData = [] } = useAllProjects();
  
  const createDraft = useCreateDraft();
  const updateReport = useUpdateReport();
  const submitReport = useSubmitReport();

  const [formData, setFormData] = useState<ReportCreate>({
    week_start_date: format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'),
    week_end_date: format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'),
    project_id: null,
    tasks_completed: [{ ...emptyTaskCompleted }],
    tasks_planned: [{ ...emptyTaskPlanned }],
    blockers: [],
    achievements: [],
    hours_worked_by_type: {
      Development: 0,
      Testing: 0,
      Meetings: 0,
      Documentation: 0
    },
    optional_notes: ''
  });

  useEffect(() => {
    if (existingReport && existingReport.latest_version) {
      const v = existingReport.latest_version;
      setFormData({
        week_start_date: existingReport.week_start_date,
        week_end_date: existingReport.week_end_date,
        project_id: existingReport.project_id || null,
        tasks_completed: v.tasks_completed.length ? v.tasks_completed : [{ ...emptyTaskCompleted }],
        tasks_planned: v.tasks_planned.length ? v.tasks_planned : [{ ...emptyTaskPlanned }],
        blockers: v.blockers.length ? v.blockers : [],
        achievements: v.achievements.length ? v.achievements : [],
        hours_worked_by_type: v.hours_worked_by_type || { Development: 0, Testing: 0, Meetings: 0, Documentation: 0 },
        optional_notes: v.optional_notes || '',
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
        Loading...
      </div>
    );
  }

  const isSaving = createDraft.isPending || updateReport.isPending || submitReport.isPending;

  const updateHours = (type: string, value: string) => {
    setFormData({
      ...formData,
      hours_worked_by_type: {
        ...formData.hours_worked_by_type,
        [type]: Number(value)
      }
    });
  };

  const selectedDateRange = {
    from: formData.week_start_date ? parse(formData.week_start_date, 'yyyy-MM-dd', new Date()) : undefined,
    to: formData.week_end_date ? parse(formData.week_end_date, 'yyyy-MM-dd', new Date()) : undefined,
  };

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 -mx-4 px-4 sm:-mx-0 sm:px-0 border-b border-border">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/reports')} className="mr-2 shrink-0">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {isEditing ? 'Edit Report' : 'New Weekly Report'}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">Fill out your weekly progress and submit it for review.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving} className="bg-background">
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            <Send className="w-4 h-4 mr-2" />
            Submit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Dates & Project */}
        <div className="md:col-span-4 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5" /> Report Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Project / Category</Label>
                <Select 
                  value={formData.project_id || 'none'} 
                  onValueChange={(v) => setFormData({ ...formData, project_id: v === 'none' ? null : v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Project / General</SelectItem>
                    {projectsData.map(p => (
                      <SelectItem key={p.project_id} value={p.project_id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Week Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !selectedDateRange.from && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDateRange.from ? (
                        selectedDateRange.to ? (
                          <>
                            {format(selectedDateRange.from, "LLL dd, y")} -{" "}
                            {format(selectedDateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(selectedDateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      defaultMonth={selectedDateRange.from}
                      selected={selectedDateRange}
                      onSelect={(d) => {
                        setFormData({
                          ...formData,
                          week_start_date: d?.from ? format(d.from, 'yyyy-MM-dd') : '',
                          week_end_date: d?.to ? format(d.to, 'yyyy-MM-dd') : ''
                        });
                      }}
                      numberOfMonths={1}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5" /> Hours Breakdown
              </CardTitle>
              <CardDescription>Approximate hours spent per activity.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {['Development', 'Testing', 'Meetings', 'Documentation'].map((type) => (
                <div key={type} className="flex items-center justify-between">
                  <Label className="font-normal">{type}</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      min="0"
                      className="w-20 text-right"
                      value={formData.hours_worked_by_type?.[type] || 0}
                      onChange={(e) => updateHours(type, e.target.value)}
                    />
                    <span className="text-sm text-muted-foreground w-6">hrs</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Main Content */}
        <div className="md:col-span-8 space-y-6">
          <BlockersAchievementsForm 
            blockers={formData.blockers} 
            achievements={formData.achievements} 
            onChangeBlockers={(b) => setFormData({ ...formData, blockers: b })} 
            onChangeAchievements={(a) => setFormData({ ...formData, achievements: a })} 
          />

          <TaskCompletedTable 
            tasks={formData.tasks_completed} 
            onChange={(tasks) => setFormData({ ...formData, tasks_completed: tasks })} 
          />

          <TaskPlannedList 
            tasks={formData.tasks_planned} 
            onChange={(tasks) => setFormData({ ...formData, tasks_planned: tasks })} 
          />

          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" /> Optional Notes
              </CardTitle>
              <CardDescription>Any other context, links, or remarks for your manager.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Textarea 
                placeholder="Add any extra notes here..." 
                value={formData.optional_notes || ''}
                onChange={(e) => setFormData({ ...formData, optional_notes: e.target.value })}
                className="min-h-[120px]"
              />
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
