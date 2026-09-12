import React from 'react';
import type { Blocker, Achievement } from '@/types/reports';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

interface BlockersAchievementsFormProps {
  blockers: Blocker[];
  achievements: Achievement[];
  onChangeBlockers: (blockers: Blocker[]) => void;
  onChangeAchievements: (achievements: Achievement[]) => void;
}

export function BlockersAchievementsForm({ 
  blockers, 
  achievements, 
  onChangeBlockers, 
  onChangeAchievements 
}: BlockersAchievementsFormProps) {

  const blockerDesc = blockers.length > 0 ? blockers[0].description : '';
  const achievementDesc = achievements.length > 0 ? achievements[0].description : '';

  const handleBlockerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChangeBlockers([{ description: e.target.value, is_key_issue: true }]);
  };

  const handleAchievementChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChangeAchievements([{ description: e.target.value, is_key_achievement: true }]);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="shadow-sm border-destructive/20">
        <CardContent className="pt-6 space-y-2">
          <Label className="text-destructive font-semibold">Main Blocker</Label>
          <Textarea 
            placeholder="What was your main blocker this week? Are there any dependencies holding you up?" 
            value={blockerDesc} 
            onChange={handleBlockerChange} 
            className="min-h-[120px] resize-none"
          />
        </CardContent>
      </Card>
      
      <Card className="shadow-sm border-primary/20">
        <CardContent className="pt-6 space-y-2">
          <Label className="text-primary font-semibold">Key Achievement</Label>
          <Textarea 
            placeholder="What was your key achievement or biggest win this week?" 
            value={achievementDesc} 
            onChange={handleAchievementChange} 
            className="min-h-[120px] resize-none"
          />
        </CardContent>
      </Card>
    </div>
  );
}
