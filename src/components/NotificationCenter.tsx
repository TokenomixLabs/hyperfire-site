
import { useState } from "react";
import { Bell, Check, X, Clock, Calendar, FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// Mock notification data
const mockNotifications = [
  {
    id: "1",
    type: "approval_request",
    title: "Content Needs Approval",
    message: "New article 'Crypto Market Outlook' awaiting your approval",
    timestamp: "2023-08-15T10:30:00Z",
    read: false,
    icon: FileText,
    action: "/admin/content-approval"
  },
  {
    id: "2",
    type: "scheduled",
    title: "Content Scheduled",
    message: "Your document has been scheduled for Aug 25, 2023",
    timestamp: "2023-08-14T15:45:00Z",
    read: true,
    icon: Calendar,
    action: "#"
  },
  {
    id: "3",
    type: "approval_granted",
    title: "Content Approved",
    message: "Your livestream has been approved for publishing",
    timestamp: "2023-08-13T09:15:00Z",
    read: false,
    icon: Check,
    action: "#"
  },
  {
    id: "4",
    type: "user_invite",
    title: "New User Invited",
    message: "You invited sarah@example.com to join as Editor",
    timestamp: "2023-08-12T14:20:00Z",
    read: true,
    icon: User,
    action: "#"
  },
  {
    id: "5",
    type: "approval_request",
    title: "Content Needs Approval",
    message: "New document 'DeFi Risk Management' awaiting your approval",
    timestamp: "2023-08-11T11:10:00Z",
    read: true,
    icon: FileText,
    action: "/admin/content-approval"
  }
];

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [open, setOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };
  
  const getFilteredNotifications = (type: string) => {
    if (type === "all") return notifications;
    if (type === "unread") return notifications.filter(n => !n.read);
    return notifications.filter(n => n.type.includes(type));
  };
  
  const getIconForType = (notification: typeof notifications[0]) => {
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-96 p-0" align="end">
        <div className="p-4 border-b flex items-center justify-between">
          <h4 className="font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 text-xs"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </TabsTrigger>
            <TabsTrigger value="approval" className="text-xs">Approval</TabsTrigger>
            <TabsTrigger value="scheduled" className="text-xs">Scheduled</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[300px]">
            {["all", "unread", "approval", "scheduled"].map((tab) => (
              <TabsContent value={tab} key={tab} className="m-0">
                {getFilteredNotifications(tab).length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
                    <Bell className="h-8 w-8 text-muted-foreground mb-2 opacity-20" />
                    <p className="text-sm text-muted-foreground">No notifications to show</p>
                  </div>
                ) : (
                  <ul className="divide-y">
                    {getFilteredNotifications(tab).map((notification) => (
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
                                  onClick={() => markAsRead(notification.id)}
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
                    ))}
                  </ul>
                )}
              </TabsContent>
            ))}
          </ScrollArea>
        </Tabs>
        
        <div className="p-2 border-t">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-xs h-8"
            onClick={() => setOpen(false)}
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
