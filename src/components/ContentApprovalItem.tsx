
import ContentApprovalItemActions from "./approval/ContentApprovalItemActions";
import ContentApprovalMetadata from "./approval/ContentApprovalMetadata";
import ContentStatusBadge from "./approval/ContentStatusBadge";

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
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-card">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-48 h-28 md:h-auto relative">
          <img 
            src={item.thumbnail} 
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2">
            <Badge 
              variant={
                item.status === 'approved' ? 'secondary' :
                item.status === 'rejected' ? 'destructive' : 'outline'
              }
            >
              {item.status === 'pending' ? 'Pending' : 
              item.status === 'approved' ? 'Approved' : 'Rejected'}
            </Badge>
          </div>
        </div>
        
        <div className="flex-1 p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <ContentStatusBadge status={item.status} type={item.type} />
          </div>
          
          <ContentApprovalMetadata 
            author={item.author}
            submittedDate={item.submittedDate}
            scheduledDate={item.scheduledDate}
            approvedDate={item.approvedDate}
            rejectedDate={item.rejectedDate}
            status={item.status}
            rejectionReason={item.rejectionReason}
          />
        </div>
        
        {showActions && item.status === 'pending' && (
          <ContentApprovalItemActions 
            itemId={item.id}
            title={item.title}
            onApprove={onApprove}
            onReject={onReject}
          />
        )}
      </div>
    </div>
  );
};

export default ContentApprovalItem;
