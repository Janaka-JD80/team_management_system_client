import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Clock } from 'lucide-react';

interface TimeDistributionChartProps {
  pieData: { name: string; value: number }[];
  pieColors: string[];
}

export function TimeDistributionChart({ pieData, pieColors }: TimeDistributionChartProps) {
  return (
    <Card className="md:col-span-4 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" /> Time Distribution
        </CardTitle>
        <CardDescription>Hours logged across task categories.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value: any) => [`${value} hrs`, 'Time Spent']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <Clock className="w-12 h-12 mb-4 opacity-20" />
              <p>No time data available.</p>
            </div>
          )}
        </div>
        
        {pieData.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {pieData.map((entry, idx) => (
              <div key={entry.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pieColors[idx % pieColors.length] }} />
                <span className="text-muted-foreground truncate">{entry.name}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
