
import { Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import NotificationItem from "./NotificationItem";

interface NotificationListProps {
  notifications: Array<{
    id: string;
    type: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    icon: React.ComponentType<any>;
    action: string;
  }>;
  tabValue: string;
  onMarkAsRead: (id: string) => void;
  formatTimeAgo: (timestamp: string) => string;
}

const NotificationList = ({ notifications, tabValue, onMarkAsRead, formatTimeAgo }: NotificationListProps) => {
  const getFilteredNotifications = (type: string) => {
    if (type === "all") return notifications;
    if (type === "unread") return notifications.filter(n => !n.read);
    return notifications.filter(n => n.type.includes(type));
  };

  return (
    <TabsContent value={tabValue} className="m-0">
      {getFilteredNotifications(tabValue).length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
          <Bell className="h-8 w-8 text-muted-foreground mb-2 opacity-20" />
          <p className="text-sm text-muted-foreground">No notifications to show</p>
        </div>
      ) : (
        <ul className="divide-y">
          {getFilteredNotifications(tabValue).map((notification) => (
            <NotificationItem 
              key={notification.id}
              notification={notification} 
              onMarkAsRead={onMarkAsRead}
              formatTimeAgo={formatTimeAgo}
            />
          ))}
        </ul>
      )}
    </TabsContent>
  );
};

export default NotificationList;
