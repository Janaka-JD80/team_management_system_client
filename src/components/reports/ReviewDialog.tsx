import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface ReviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  action: 'Approved' | 'Needs Correction';
  comment: string;
  setComment: (val: string) => void;
  onSubmit: () => void;
  isPending: boolean;
}

export function ReviewDialog({
  isOpen,
  onOpenChange,
  action,
  comment,
  setComment,
  onSubmit,
  isPending
}: ReviewDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{action === 'Approved' ? 'Approve Report' : 'Request Changes'}</DialogTitle>
          <DialogDescription>
            {action === 'Approved' 
              ? 'Are you sure you want to approve this report? You can optionally leave a comment.' 
              : 'Provide feedback on what needs to be changed before the report can be approved.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Leave a comment (optional for approval, required for changes)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={onSubmit} 
            variant={action === 'Approved' ? 'default' : 'destructive'}
            disabled={isPending || (action === 'Needs Correction' && !comment.trim())}
          >
            {isPending ? 'Submitting...' : action === 'Approved' ? 'Approve' : 'Request Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
