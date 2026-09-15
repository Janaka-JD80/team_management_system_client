import type { Blocker, Achievement } from '@/types/reports';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trash2, Plus, Star } from 'lucide-react';

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

  // --- Blockers ---
  const addBlocker = () => onChangeBlockers([...blockers, { description: '', is_key_issue: false }]);
  const removeBlocker = (index: number) => {
    const newItems = [...blockers];
    newItems.splice(index, 1);
    onChangeBlockers(newItems);
  };
  const updateBlocker = (index: number, field: keyof Blocker, value: any) => {
    let newItems = [...blockers];
    
    // Ensure only one key issue can be selected at a time
    if (field === 'is_key_issue' && value === true) {
      newItems = newItems.map(item => ({ ...item, is_key_issue: false }));
    }
    
    newItems[index] = { ...newItems[index], [field]: value };
    onChangeBlockers(newItems);
  };

  // --- Achievements ---
  const addAchievement = () => onChangeAchievements([...achievements, { description: '', is_key_achievement: false }]);
  const removeAchievement = (index: number) => {
    const newItems = [...achievements];
    newItems.splice(index, 1);
    onChangeAchievements(newItems);
  };
  const updateAchievement = (index: number, field: keyof Achievement, value: any) => {
    let newItems = [...achievements];
    
    // Ensure only one key achievement can be selected at a time
    if (field === 'is_key_achievement' && value === true) {
      newItems = newItems.map(item => ({ ...item, is_key_achievement: false }));
    }
    
    newItems[index] = { ...newItems[index], [field]: value };
    onChangeAchievements(newItems);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      
      {/* Blockers */}
      <Card className="shadow-sm border-destructive/20">
        <CardHeader className="pb-3 border-b border-destructive/10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-destructive font-semibold">Blockers & Challenges</CardTitle>
              <CardDescription>What slowed you down?</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={addBlocker} className="h-8 border-destructive/30 text-destructive hover:bg-destructive hover:text-white">
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-3">
          {blockers.map((item, i) => (
            <div key={i} className="flex items-start gap-2 group">
              <button
                type="button"
                title="Mark as Key Issue"
                onClick={() => updateBlocker(i, 'is_key_issue', !item.is_key_issue)}
                className={`mt-2 shrink-0 transition-colors ${item.is_key_issue ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'}`}
              >
                <Star className="w-5 h-5" fill={item.is_key_issue ? 'currentColor' : 'none'} />
              </button>
              
              <Input
                value={item.description}
                onChange={(e) => updateBlocker(i, 'description', e.target.value)}
                placeholder="Describe the blocker..."
                className="flex-1"
              />
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removeBlocker(i)}
                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {blockers.length === 0 && (
            <p className="text-sm text-muted-foreground italic text-center py-4">No blockers added.</p>
          )}
        </CardContent>
      </Card>
      
      {/* Achievements */}
      <Card className="shadow-sm border-primary/20">
        <CardHeader className="pb-3 border-b border-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-primary font-semibold">Achievements</CardTitle>
              <CardDescription>What were your big wins?</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={addAchievement} className="h-8 border-primary/30 text-primary hover:bg-primary hover:text-white">
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-3">
          {achievements.map((item, i) => (
            <div key={i} className="flex items-start gap-2 group">
              <button
                type="button"
                title="Mark as Key Achievement"
                onClick={() => updateAchievement(i, 'is_key_achievement', !item.is_key_achievement)}
                className={`mt-2 shrink-0 transition-colors ${item.is_key_achievement ? 'text-amber-500' : 'text-muted-foreground hover:text-amber-500'}`}
              >
                <Star className="w-5 h-5" fill={item.is_key_achievement ? 'currentColor' : 'none'} />
              </button>
              
              <Input
                value={item.description}
                onChange={(e) => updateAchievement(i, 'description', e.target.value)}
                placeholder="Describe the achievement..."
                className="flex-1"
              />
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removeAchievement(i)}
                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {achievements.length === 0 && (
            <p className="text-sm text-muted-foreground italic text-center py-4">No achievements added.</p>
          )}
        </CardContent>
      </Card>
      
    </div>
  );
}
