
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, FileText, Calendar, Check, User, MessageSquare, Award, Link2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import NotificationList from "./notifications/NotificationList";
import { useToast } from "@/hooks/use-toast";

// Types for our notification system
export type NotificationType = 
  | "referral" 
  | "reply" 
  | "course_duplicated" 
  | "cta_clicked" 
  | "admin_announcement";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon: React.ComponentType<any>;
  action: string;
  metadata?: Record<string, any>;
}

// Function to get icon for notification type
const getIconForType = (type: NotificationType) => {
  switch (type) {
    case "referral":
      return Award;
    case "reply":
      return MessageSquare;
    case "course_duplicated":
      return FileText;
    case "cta_clicked":
      return Link2;
    case "admin_announcement":
      return Volume2;
    default:
      return Bell;
  }
};

// Mock notification data - structured to represent real system events
const generateMockNotifications = (): Notification[] => [
  {
    id: "1",
    type: "referral",
    title: "New referral!",
    message: "Sarah Jones signed up using your referral link",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    read: false,
    icon: getIconForType("referral"),
    action: "/dashboard/referrals",
    metadata: {
      userId: "user123",
      referralId: "ref789",
      program: "InsiderDAO"
    }
  },
  {
    id: "2",
    type: "reply",
    title: "New reply to your thread",
    message: "CryptoMaster commented on 'Market Analysis for Q3'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false,
    icon: getIconForType("reply"),
    action: "/signalboard/thread/123",
    metadata: {
      threadId: "thread123",
      replyId: "reply456"
    }
  },
  {
    id: "3",
    type: "course_duplicated",
    title: "Course duplicated",
    message: "Your 'DeFi Basics' course was duplicated by 5 users today",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    read: true,
    icon: getIconForType("course_duplicated"),
    action: "/dashboard/content",
    metadata: {
      courseId: "course123",
      duplicateCount: 5
    }
  },
  {
    id: "4",
    type: "cta_clicked",
    title: "CTA getting attention!",
    message: "Your 'Join Premium' CTA was clicked 12 times yesterday",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true,
    icon: getIconForType("cta_clicked"),
    action: "/dashboard/stats",
    metadata: {
      ctaId: "cta123",
      clickCount: 12
    }
  },
  {
    id: "5",
    type: "admin_announcement",
    title: "Platform Update",
    message: "New features available: Enhanced Signal Analytics",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
    read: false,
    icon: getIconForType("admin_announcement"),
    action: "/announcements/platform-update",
    metadata: {
      announcementId: "ann123",
      priority: "medium"
    }
  },
  {
    id: "6",
    type: "reply",
    title: "Reply to your comment",
    message: "BlockchainDev replied to your comment on 'NFT Market Trends'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    read: true,
    icon: getIconForType("reply"),
    action: "/signalboard/thread/456?comment=789",
    metadata: {
      threadId: "thread456",
      commentId: "comment789",
      replyId: "reply101"
    }
  }
];

const NotificationCenter = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  
  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Format timestamps to relative time
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
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  // Mark a single notification as read
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    setOpen(false);
    navigate(notification.action);
  };

  // Simulate receiving new notifications
  useEffect(() => {
    // Load initial notifications
    setNotifications(generateMockNotifications());
    
    // Simulate receiving a new notification after a delay
    const timer = setTimeout(() => {
      const newNotification: Notification = {
        id: Math.random().toString(36).substring(2, 9),
        type: "referral",
        title: "New referral just now!",
        message: "Alex Thompson signed up using your referral link",
        timestamp: new Date().toISOString(),
        read: false,
        icon: getIconForType("referral"),
        action: "/dashboard/referrals",
        metadata: {
          userId: "user456",
          referralId: "ref123",
          program: "InsiderLife"
        }
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      
      // Show toast notification
      toast({
        title: "🔥 New referral!",
        description: "Alex Thompson just signed up using your link",
        duration: 5000,
      });
    }, 10000); // Simulate a new notification after 10 seconds
    
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
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
          <TabsList className="w-full grid grid-cols-5">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </TabsTrigger>
            <TabsTrigger value="referral" className="text-xs">Referrals</TabsTrigger>
            <TabsTrigger value="reply" className="text-xs">Replies</TabsTrigger>
            <TabsTrigger value="other" className="text-xs">Other</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[300px]">
            {/* Notification lists for different tabs */}
            <NotificationList
              notifications={notifications}
              tabValue="all"
              onMarkAsRead={markAsRead}
              formatTimeAgo={formatTimeAgo}
              onNotificationClick={handleNotificationClick}
            />
            <NotificationList
              notifications={notifications.filter(n => !n.read)}
              tabValue="unread"
              onMarkAsRead={markAsRead}
              formatTimeAgo={formatTimeAgo}
              onNotificationClick={handleNotificationClick}
            />
            <NotificationList
              notifications={notifications.filter(n => n.type === "referral")}
              tabValue="referral"
              onMarkAsRead={markAsRead}
              formatTimeAgo={formatTimeAgo}
              onNotificationClick={handleNotificationClick}
            />
            <NotificationList
              notifications={notifications.filter(n => n.type === "reply")}
              tabValue="reply"
              onMarkAsRead={markAsRead}
              formatTimeAgo={formatTimeAgo}
              onNotificationClick={handleNotificationClick}
            />
            <NotificationList
              notifications={notifications.filter(n => 
                n.type !== "referral" && n.type !== "reply"
              )}
              tabValue="other"
              onMarkAsRead={markAsRead}
              formatTimeAgo={formatTimeAgo}
              onNotificationClick={handleNotificationClick}
            />
          </ScrollArea>
        </Tabs>
        
        <div className="p-2 border-t">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-xs h-8"
            onClick={() => {
              setOpen(false);
              navigate("/notifications");
            }}
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
