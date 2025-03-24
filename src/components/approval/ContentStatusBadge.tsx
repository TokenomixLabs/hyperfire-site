
import { Badge } from "@/components/ui/badge";
import { FileText, Film } from "lucide-react";

interface ContentStatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected';
  type: string;
}

const ContentStatusBadge = ({ status, type }: ContentStatusBadgeProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'livestream':
        return <Film className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex items-center gap-1 mt-1 md:mt-0">
      <Badge variant="outline" className="flex items-center gap-1">
        {getTypeIcon(type)}
        <span className="capitalize">{type}</span>
      </Badge>
      
      <Badge 
        variant={
          status === 'approved' ? 'secondary' :
          status === 'rejected' ? 'destructive' : 'outline'
        }
      >
        {status === 'pending' ? 'Pending' : 
         status === 'approved' ? 'Approved' : 'Rejected'}
      </Badge>
    </div>
  );
};

export default ContentStatusBadge;
