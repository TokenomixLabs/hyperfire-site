
import { useState } from "react";
import { format } from "date-fns";
import { FileText, Film, Calendar, MessageSquare, CheckCircle, XCircle, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ContentApprovalItemProps {
  item: {
    id: string;
    title: string;
    type: string;
    author: string;
    submittedDate: string;
    scheduledDate?: string;
    approvedDate?: string;
    rejectedDate?: string;
    status: 'pending' | 'approved' | 'rejected';
    rejectionReason?: string;
    thumbnail: string;
  };
  showActions?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string, reason: string) => void;
}

const ContentApprovalItem = ({ 
  item,
  showActions = true,
  onApprove,
  onReject
}: ContentApprovalItemProps) => {
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <FileText className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'livestream':
        return <Film className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const handleRejectSubmit = () => {
    if (onReject && rejectionReason.trim()) {
      onReject(item.id, rejectionReason);
      setRejectDialogOpen(false);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-card">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-48 h-28 md:h-auto relative">
          <img 
            src={item.thumbnail} 
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <Badge 
            variant={
              item.status === 'approved' ? 'success' :
              item.status === 'rejected' ? 'destructive' : 'outline'
            }
            className="absolute top-2 left-2"
          >
            {item.status === 'pending' ? 'Pending' : 
             item.status === 'approved' ? 'Approved' : 'Rejected'}
          </Badge>
        </div>
        
        <div className="flex-1 p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <div className="flex items-center gap-1 mt-1 md:mt-0">
              <Badge variant="outline" className="flex items-center gap-1">
                {getTypeIcon(item.type)}
                <span className="capitalize">{item.type}</span>
              </Badge>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="text-sm text-muted-foreground">
              By <span className="font-medium">{item.author}</span>
            </div>
            
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>Submitted: {formatDate(item.submittedDate)}</span>
              </div>
              
              {item.scheduledDate && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Scheduled: {formatDate(item.scheduledDate)}</span>
                </div>
              )}
              
              {item.approvedDate && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Approved: {formatDate(item.approvedDate)}</span>
                </div>
              )}
              
              {item.rejectedDate && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <XCircle className="h-3.5 w-3.5" />
                  <span>Rejected: {formatDate(item.rejectedDate)}</span>
                </div>
              )}
            </div>
          </div>
          
          {item.status === 'rejected' && item.rejectionReason && (
            <div className="mt-3 p-2 bg-muted/50 rounded-md text-sm">
              <div className="flex items-start gap-1">
                <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">{item.rejectionReason}</p>
              </div>
            </div>
          )}
        </div>
        
        {showActions && item.status === 'pending' && (
          <div className="flex md:flex-col justify-around p-4 gap-2 border-t md:border-t-0 md:border-l">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={() => onApprove && onApprove(item.id)}
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
        )}
      </div>
      
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Content</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting "{item.title}". This feedback will be sent to the author.
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
    </div>
  );
};

export default ContentApprovalItem;
