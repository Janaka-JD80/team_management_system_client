import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { MemberStatus } from '@/types/analytics';
import { Badge } from '@/components/ui/badge';

interface MemberStatusListProps {
  statusData: MemberStatus[] | undefined;
}

export function MemberStatusList({ statusData }: MemberStatusListProps) {
  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('approved')) return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
    if (s.includes('correction') || s.includes('rejected')) return 'bg-amber-500/10 text-amber-600 border-amber-200';
    if (s.includes('draft') || s.includes('pending')) return 'bg-blue-500/10 text-blue-600 border-blue-200';
    if (s.includes('missing') || s.includes('late')) return 'bg-destructive/10 text-destructive border-destructive/20';
    return 'bg-gray-100 text-gray-600';
  };

  return (
    <Card className="shadow-sm h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Team Status</CardTitle>
        <CardDescription>Current reporting status for team members.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pr-2 max-h-[300px]">
        {!statusData || statusData.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8">
            No team status available.
          </div>
        ) : (
          <div className="space-y-4">
            {statusData.map((member, idx) => (
              <div key={`${member.user_id}-${idx}`} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xs">
                    {member.full_name?.substring(0, 2).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium">{member.full_name || 'Unknown User'}</span>
                </div>
                <Badge variant="outline" className={`font-normal ${getStatusColor(member.status)}`}>
                  {member.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
