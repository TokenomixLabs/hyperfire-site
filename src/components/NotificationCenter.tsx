
import { useState } from "react";
import { Bell, FileText, Calendar, Check, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import NotificationList from "./notifications/NotificationList";

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
              <NotificationList
                key={tab}
                notifications={notifications}
                tabValue={tab}
                onMarkAsRead={markAsRead}
                formatTimeAgo={formatTimeAgo}
              />
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
