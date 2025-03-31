
import { useState, useEffect } from 'react';
import { NotificationType, Notification as NotificationItem } from '@/components/NotificationCenter';
import { PageTitle } from '@/components/ui/page-headers';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Bell, FileText, MessageSquare, Award, Link2, Volume2, Check } from 'lucide-react';
import NotificationCard from '@/components/notifications/NotificationCard';
import { Card } from '@/components/ui/card';

// Get icon for notification type (same as in NotificationCenter)
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

// Mock notification data - we'll use the same structure as NotificationCenter
const generateMockNotifications = (): NotificationItem[] => {
  const baseNotifications = [
    {
      id: "1",
      type: "referral" as NotificationType,
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
      type: "reply" as NotificationType,
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
    // ... more notifications
  ];
  
  // Generate more notifications for a fuller page
  const extraNotifications = [];
  for (let i = 0; i < 15; i++) {
    const types: NotificationType[] = [
      "referral", "reply", "course_duplicated", "cta_clicked", "admin_announcement"
    ];
    const type = types[Math.floor(Math.random() * types.length)];
    
    let title, message;
    switch (type) {
      case "referral":
        title = "New referral received";
        message = `User${i} signed up using your referral link`;
        break;
      case "reply":
        title = "New reply to your content";
        message = `User${i} replied to your thread about crypto insights`;
        break;
      case "course_duplicated":
        title = "Course duplicated";
        message = `Your 'Crypto Trading ${i}' course was duplicated`;
        break;
      case "cta_clicked":
        title = "CTA clicked";
        message = `Your 'Join Now ${i}' CTA was clicked`;
        break;
      case "admin_announcement":
        title = "Platform announcement";
        message = `New feature released: Feature ${i}`;
        break;
    }
    
    extraNotifications.push({
      id: `extra-${i}`,
      type,
      title,
      message,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * (i + 1)).toISOString(),
      read: Math.random() > 0.3, // 30% chance of being unread
      icon: getIconForType(type),
      action: "/dashboard",
      metadata: {}
    });
  }
  
  return [...baseNotifications, ...extraNotifications];
};

const formatTimeStamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  
  useEffect(() => {
    setNotifications(generateMockNotifications());
  }, []);
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };
  
  const filterNotifications = (type: string) => {
    if (type === "all") return notifications;
    if (type === "unread") return notifications.filter(n => !n.read);
    if (type === "other") return notifications.filter(n => 
      n.type !== "referral" && n.type !== "reply"
    );
    return notifications.filter(n => n.type === type);
  };
  
  const filteredNotifications = filterNotifications(activeTab);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <PageTitle>Notifications</PageTitle>
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={markAllAsRead}
            className="flex items-center gap-1"
          >
            <Check className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">
            All
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </TabsTrigger>
          <TabsTrigger value="referral">
            Referrals
          </TabsTrigger>
          <TabsTrigger value="reply">
            Replies
          </TabsTrigger>
          <TabsTrigger value="other">
            Other
          </TabsTrigger>
        </TabsList>
        
        {/* All notification types share the same content area */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card className="p-12 flex flex-col items-center justify-center text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
              <h3 className="text-xl font-medium mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                You don't have any {activeTab !== "all" ? activeTab + " " : ""}notifications yet.
              </p>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                formatTimeStamp={formatTimeStamp}
              />
            ))
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default NotificationsPage;
