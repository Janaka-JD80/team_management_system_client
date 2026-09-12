import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import type { DateRange } from 'react-day-picker';
import type { ProjectResponse } from '@/types/projects';

interface DashboardFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  projectIdFilter: string;
  setProjectIdFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  date: DateRange | undefined;
  setDate: (val: DateRange | undefined) => void;
  projectsData: ProjectResponse[];
  setPage: (page: number) => void;
}

export function DashboardFilters({
  searchQuery,
  setSearchQuery,
  projectIdFilter,
  setProjectIdFilter,
  statusFilter,
  setStatusFilter,
  date,
  setDate,
  projectsData,
  setPage,
}: DashboardFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
      <div className="space-y-2">
        <Label>Search Team Member</Label>
        <Input 
          placeholder="Name or email..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
      </div>
      
      <div className="space-y-2">
        <Label>Project / Category</Label>
        <Select value={projectIdFilter} onValueChange={(v) => { setProjectIdFilter(v); setPage(1); }}>
          <SelectTrigger>
            <SelectValue placeholder="All Projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projectsData.map(p => (
              <SelectItem key={p.project_id} value={p.project_id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Status</Label>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger>
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="needs_correction">Needs Correction</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 col-span-1 md:col-span-2">
        <Label>Date Range</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
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
      </div>
    </div>
  );
}
