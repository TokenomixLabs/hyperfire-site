
import { useState } from "react";
import { CheckCircle, XCircle, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface ContentApprovalItemActionsProps {
  itemId: string;
  title: string;
  onApprove?: (id: string) => void;
  onReject?: (id: string, reason: string) => void;
}

const ContentApprovalItemActions = ({
  itemId,
  title,
  onApprove,
  onReject
}: ContentApprovalItemActionsProps) => {
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const handleRejectSubmit = () => {
    if (onReject && rejectionReason.trim()) {
      onReject(itemId, rejectionReason);
      setRejectDialogOpen(false);
    }
  };

  return (
    <>
      <div className="flex md:flex-col justify-around p-4 gap-2 border-t md:border-t-0 md:border-l">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => onApprove && onApprove(itemId)}
              >
                <CheckCircle className="h-5 w-5 text-green-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Approve</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => setRejectDialogOpen(true)}
              >
                <XCircle className="h-5 w-5 text-red-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reject</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="h-10 w-10 rounded-full"
              >
                <Eye className="h-5 w-5 text-blue-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Preview</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="h-10 w-10 rounded-full"
              >
                <Edit className="h-5 w-5 text-amber-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Content</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting "{title}". This feedback will be sent to the author.
            </DialogDescription>
          </DialogHeader>
          
          <Textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter rejection reason..."
            className="min-h-[100px]"
          />
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleRejectSubmit}
              disabled={!rejectionReason.trim()}
            >
              Reject Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContentApprovalItemActions;
