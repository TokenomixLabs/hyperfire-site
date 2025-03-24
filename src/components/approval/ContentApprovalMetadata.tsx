
import { Calendar, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { format } from "date-fns";

interface ContentApprovalMetadataProps {
  author: string;
  submittedDate: string;
  scheduledDate?: string;
  approvedDate?: string;
  rejectedDate?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

const ContentApprovalMetadata = ({
  author,
  submittedDate,
  scheduledDate,
  approvedDate,
  rejectedDate,
  status,
  rejectionReason
}: ContentApprovalMetadataProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="text-sm text-muted-foreground">
        By <span className="font-medium">{author}</span>
      </div>
      
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>Submitted: {formatDate(submittedDate)}</span>
        </div>
        
        {scheduledDate && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>Scheduled: {formatDate(scheduledDate)}</span>
          </div>
        )}
        
        {approvedDate && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Approved: {formatDate(approvedDate)}</span>
          </div>
        )}
        
        {rejectedDate && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <XCircle className="h-3.5 w-3.5" />
            <span>Rejected: {formatDate(rejectedDate)}</span>
          </div>
        )}
      </div>
      
      {status === 'rejected' && rejectionReason && (
        <div className="mt-3 p-2 bg-muted/50 rounded-md text-sm">
          <div className="flex items-start gap-1">
            <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground">{rejectionReason}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentApprovalMetadata;
