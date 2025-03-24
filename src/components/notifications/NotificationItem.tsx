
import { Bell, Check, X, Clock, Calendar, FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NotificationItemProps {
  notification: {
    id: string;
    type: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    icon: React.ComponentType<any>;
    action: string;
  };
  onMarkAsRead: (id: string) => void;
  formatTimeAgo: (timestamp: string) => string;
}

const NotificationItem = ({ notification, onMarkAsRead, formatTimeAgo }: NotificationItemProps) => {
  const getIconForType = (notification: NotificationItemProps["notification"]) => {
    const IconComponent = notification.icon;
    const colorClass = notification.type.includes('approval_request') 
      ? 'text-amber-500' 
      : notification.type.includes('approval_granted') 
        ? 'text-green-500' 
        : notification.type.includes('scheduled') 
          ? 'text-blue-500' 
          : 'text-gray-500';
    
    return <IconComponent className={`h-5 w-5 ${colorClass}`} />;
  };

  return (
    <li 
      key={notification.id}
      className={`p-4 hover:bg-muted/50 ${!notification.read ? 'bg-muted/20' : ''}`}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-1">
          {getIconForType(notification)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium">{notification.title}</p>
            {!notification.read && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 -mt-1 -mr-1"
                onClick={() => onMarkAsRead(notification.id)}
              >
                <X className="h-3.5 w-3.5" />
                <span className="sr-only">Mark as read</span>
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {notification.message}
          </p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] text-muted-foreground">
              {formatTimeAgo(notification.timestamp)}
            </span>
            {!notification.read && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                New
              </Badge>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default NotificationItem;
