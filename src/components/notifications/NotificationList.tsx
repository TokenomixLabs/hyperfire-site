
import { Bell } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import NotificationItem from "./NotificationItem";
import { Notification } from "../NotificationCenter";

interface NotificationListProps {
  notifications: Notification[];
  tabValue: string;
  onMarkAsRead: (id: string) => void;
  formatTimeAgo: (timestamp: string) => string;
  onNotificationClick: (notification: Notification) => void;
}

const NotificationList = ({ 
  notifications, 
  tabValue, 
  onMarkAsRead, 
  formatTimeAgo,
  onNotificationClick
}: NotificationListProps) => {
  return (
    <TabsContent value={tabValue} className="m-0">
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
          <Bell className="h-8 w-8 text-muted-foreground mb-2 opacity-20" />
          <p className="text-sm text-muted-foreground">No notifications to show</p>
        </div>
      ) : (
        <ul className="divide-y">
          {notifications.map((notification) => (
            <NotificationItem 
              key={notification.id}
              notification={notification} 
              onMarkAsRead={onMarkAsRead}
              formatTimeAgo={formatTimeAgo}
              onClick={() => onNotificationClick(notification)}
            />
          ))}
        </ul>
      )}
    </TabsContent>
  );
};

export default NotificationList;
