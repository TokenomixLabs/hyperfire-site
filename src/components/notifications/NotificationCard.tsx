
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { Notification } from '../NotificationCenter';

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  formatTimeStamp: (timestamp: string) => string;
}

const NotificationCard = ({ notification, onMarkAsRead, formatTimeStamp }: NotificationCardProps) => {
  const navigate = useNavigate();
  const IconComponent = notification.icon;
  
  const getColorClassForType = (type: string): string => {
    switch (type) {
      case "referral":
        return "text-amber-500 bg-amber-50 dark:bg-amber-900/20";
      case "reply":
        return "text-blue-500 bg-blue-50 dark:bg-blue-900/20";
      case "course_duplicated":
        return "text-green-500 bg-green-50 dark:bg-green-900/20";
      case "cta_clicked":
        return "text-purple-500 bg-purple-50 dark:bg-purple-900/20";
      case "admin_announcement":
        return "text-red-500 bg-red-50 dark:bg-red-900/20";
      default:
        return "text-gray-500 bg-gray-50 dark:bg-gray-900/20";
    }
  };
  
  const colorClass = getColorClassForType(notification.type);
  
  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    navigate(notification.action);
  };

  return (
    <Card 
      className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
        !notification.read ? 'border-l-4 border-l-primary' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className={`p-2 rounded-full ${colorClass}`}>
            <IconComponent className="h-5 w-5" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{notification.title}</h3>
                {!notification.read && <Badge variant="secondary" className="text-xs">New</Badge>}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatTimeStamp(notification.timestamp)}
              </span>
              
              {!notification.read && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id);
                  }}
                >
                  <Check className="h-3.5 w-3.5" />
                  <span className="text-xs">Mark read</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NotificationCard;
