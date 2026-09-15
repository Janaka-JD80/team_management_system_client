import type { TaskCompleted } from '@/types/reports';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';

interface TaskCompletedTableProps {
  tasks: TaskCompleted[];
  onChange: (tasks: TaskCompleted[]) => void;
}

export const emptyTaskCompleted: TaskCompleted = {
  task_name: '',
  priority: 'Medium',
  planned_percent: 100,
  actual_percent: 0,
  status: 'In Progress',
  time_planned_hours: 0,
  time_spent_hours: 0,
  output_produced: ''
};

export function TaskCompletedTable({ tasks, onChange }: TaskCompletedTableProps) {
  const addTask = () => {
    onChange([...tasks, { ...emptyTaskCompleted }]);
  };

  const removeTask = (index: number) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    onChange(newTasks);
  };

  const updateTask = (index: number, field: keyof TaskCompleted, value: any) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], [field]: value };
    onChange(newTasks);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
        <div>
          <CardTitle className="text-xl font-semibold">Tasks Completed</CardTitle>
          <CardDescription>Detail the work you finished this week.</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={addTask} className="h-8">
          <Plus className="w-4 h-4 mr-1" /> Add Task
        </Button>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {tasks.map((task, i) => (
          <div key={i} className="p-5 border rounded-xl grid gap-5 grid-cols-1 md:grid-cols-12 bg-muted/20 relative group">
            {tasks.length > 1 && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute -right-3 -top-3 h-8 w-8 rounded-full bg-background border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive hover:text-white"
                onClick={() => removeTask(i)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            
            <div className="md:col-span-12 lg:col-span-4 space-y-2">
              <Label>Task Name</Label>
              <Input 
                value={task.task_name} 
                onChange={(e) => updateTask(i, 'task_name', e.target.value)} 
                placeholder="What did you work on?"
                className="bg-background"
              />
            </div>

            <div className="md:col-span-12 lg:col-span-4 space-y-2">
              <Label>Output / Deliverable</Label>
              <Input 
                value={task.output_produced || ''} 
                onChange={(e) => updateTask(i, 'output_produced', e.target.value)} 
                placeholder="E.g., PR link, document URL, specific result"
                className="bg-background"
              />
            </div>

            <div className="md:col-span-6 lg:col-span-2 space-y-2">
              <Label>Priority</Label>
              <Select value={task.priority} onValueChange={(val) => updateTask(i, 'priority', val)}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-6 lg:col-span-2 space-y-2">
              <Label>Status</Label>
              <Select value={task.status} onValueChange={(val) => updateTask(i, 'status', val)}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Done">Done</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-6 lg:col-span-2 space-y-2">
              <Label>Planned Hrs</Label>
              <Input 
                type="number" 
                value={task.time_planned_hours} 
                onChange={(e) => updateTask(i, 'time_planned_hours', Number(e.target.value))} 
                className="bg-background"
              />
            </div>
            <div className="md:col-span-6 lg:col-span-2 space-y-2">
              <Label>Spent Hrs</Label>
              <Input 
                type="number" 
                value={task.time_spent_hours} 
                onChange={(e) => updateTask(i, 'time_spent_hours', Number(e.target.value))} 
                className="bg-background"
              />
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-10 text-muted-foreground border border-dashed rounded-lg bg-muted/10">
            No completed tasks recorded. Click "Add Task" to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
