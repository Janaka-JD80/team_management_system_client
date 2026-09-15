import type { TaskPlanned } from '@/types/reports';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';

interface TaskPlannedListProps {
  tasks: TaskPlanned[];
  onChange: (tasks: TaskPlanned[]) => void;
}

export const emptyTaskPlanned: TaskPlanned = {
  task_name: '',
  priority: 'Medium',
  time_planned_hours: 0
};

export function TaskPlannedList({ tasks, onChange }: TaskPlannedListProps) {
  const addTask = () => {
    onChange([...tasks, { ...emptyTaskPlanned }]);
  };

  const removeTask = (index: number) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    onChange(newTasks);
  };

  const updateTask = (index: number, field: keyof TaskPlanned, value: any) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], [field]: value };
    onChange(newTasks);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold">Tasks Planned</CardTitle>
        <Button variant="outline" size="sm" onClick={addTask} className="h-8">
          <Plus className="w-4 h-4 mr-1" /> Add Planned Task
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.map((task, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end p-4 sm:p-0 border sm:border-0 rounded-lg sm:rounded-none relative group">
            <div className="flex-1 w-full space-y-2">
              <Label className="sm:hidden">Task Name</Label>
              <Input 
                value={task.task_name} 
                onChange={(e) => updateTask(i, 'task_name', e.target.value)} 
                placeholder="What do you plan to work on next week?"
              />
            </div>
            <div className="w-full sm:w-40 space-y-2">
              <Label className="sm:hidden">Priority</Label>
              <Select value={task.priority} onValueChange={(val) => updateTask(i, 'priority', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-32 space-y-2">
              <Label className="sm:hidden">Planned Hrs</Label>
              <Input 
                type="number" 
                value={task.time_planned_hours} 
                onChange={(e) => updateTask(i, 'time_planned_hours', Number(e.target.value))} 
                placeholder="Hrs"
              />
            </div>
            
            {tasks.length > 1 && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-2 top-2 sm:static h-10 w-10 text-muted-foreground hover:text-destructive"
                onClick={() => removeTask(i)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-6 text-muted-foreground border border-dashed rounded-lg">
            No planned tasks recorded. Click "Add Planned Task" to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
