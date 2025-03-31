
import { Bell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Notification } from "../NotificationCenter";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  formatTimeAgo: (timestamp: string) => string;
  onClick: () => void;
}

const NotificationItem = ({ notification, onMarkAsRead, formatTimeAgo, onClick }: NotificationItemProps) => {
  // Get appropriate style based on notification type
  const getColorClassForType = (type: string): string => {
    switch (type) {
      case "referral":
        return "text-amber-500";
      case "reply":
        return "text-blue-500";
      case "course_duplicated":
        return "text-green-500";
      case "cta_clicked":
        return "text-purple-500";
      case "admin_announcement":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const colorClass = getColorClassForType(notification.type);
  const IconComponent = notification.icon;

  return (
    <li 
      key={notification.id}
      className={`p-4 hover:bg-muted/50 ${!notification.read ? 'bg-muted/20' : ''} cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-1">
          <IconComponent className={`h-5 w-5 ${colorClass}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium">{notification.title}</p>
            {!notification.read && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 -mt-1 -mr-1"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the li's onClick
                  onMarkAsRead(notification.id);
                }}
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
