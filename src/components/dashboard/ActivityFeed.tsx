import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { ActivityFeedItem } from '@/types/analytics';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, Edit3, Send, AlertCircle } from 'lucide-react';

interface ActivityFeedProps {
  activities: ActivityFeedItem[] | undefined;
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActionIcon = (action: string) => {
    const a = action.toLowerCase();
    if (a.includes('submit')) return <Send className="w-4 h-4 text-blue-500" />;
    if (a.includes('approv')) return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (a.includes('correct')) return <AlertCircle className="w-4 h-4 text-amber-500" />;
    return <Edit3 className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <Card className="shadow-sm h-full flex flex-col md:col-span-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Recent Activity</CardTitle>
        <CardDescription>Latest actions on team reports.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pr-2 max-h-[300px]">
        {!activities || activities.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8">
            No recent activity.
          </div>
        ) : (
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {activities.map((item, idx) => (
              <div key={`${item.report_id}-${idx}`} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-50 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  {getActionIcon(item.action)}
                </div>
                
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-3 rounded border bg-card shadow-sm">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-slate-900 text-sm">{item.full_name}</div>
                    <time className="text-xs text-muted-foreground font-medium">
                      {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                    </time>
                  </div>
                  <div className="text-slate-500 text-xs">
                    {item.action}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
