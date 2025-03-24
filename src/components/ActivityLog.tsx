
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { FileText, Edit, Calendar, Eye, UserPlus, Settings, Clock } from "lucide-react";

type Activity = {
  id: string;
  action: string;
  actionType: "document" | "content" | "event" | "user" | "system";
  user: string;
  userRole: string;
  time: string;
  item: string;
  details?: string;
};

type ActivityLogProps = {
  limit?: number;
  filter?: string[];
};

const ActivityLog = ({ limit = 10, filter }: ActivityLogProps) => {
  // Mock data - in a real app this would come from an API
  const [activities] = useState<Activity[]>([
    { 
      id: "1",
      action: "Document uploaded", 
      actionType: "document",
      user: "Sarah Johnson", 
      userRole: "admin",
      time: "10 minutes ago", 
      item: "Q2 Financial Report.pdf",
      details: "Added to Reports category" 
    },
    { 
      id: "2",
      action: "Content edited", 
      actionType: "content",
      user: "Alex Chen", 
      userRole: "editor",
      time: "2 hours ago", 
      item: "Market Update: July 2023",
      details: "Updated text and images" 
    },
    { 
      id: "3",
      action: "Event scheduled", 
      actionType: "event",
      user: "Maria Rodriguez", 
      userRole: "admin",
      time: "Yesterday at 4:32 PM", 
      item: "Quarterly Investor Call",
      details: "Set for August 15th, 2:00 PM EST" 
    },
    { 
      id: "4",
      action: "Document updated", 
      actionType: "document",
      user: "James Wilson", 
      userRole: "editor",
      time: "2 days ago", 
      item: "Tokenomics Whitepaper v2",
      details: "Replaced with new version" 
    },
    { 
      id: "5",
      action: "User invited", 
      actionType: "user",
      user: "Sarah Johnson", 
      userRole: "admin",
      time: "3 days ago", 
      item: "mark@example.com",
      details: "Assigned editor role" 
    },
    { 
      id: "6",
      action: "Content published", 
      actionType: "content",
      user: "Alex Chen", 
      userRole: "editor",
      time: "4 days ago", 
      item: "DeFi Market Analysis",
      details: "Marked as premium content" 
    },
    { 
      id: "7",
      action: "System update", 
      actionType: "system",
      user: "System", 
      userRole: "system",
      time: "5 days ago", 
      item: "CMS Platform",
      details: "Updated to version 2.1.0" 
    }
  ]);

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case "document":
        return <FileText className="h-4 w-4" />;
      case "content":
        return <Edit className="h-4 w-4" />;
      case "event":
        return <Calendar className="h-4 w-4" />;
      case "user":
        return <UserPlus className="h-4 w-4" />;
      case "system":
        return <Settings className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActionBadge = (actionType: string) => {
    switch (actionType) {
      case "document":
        return <Badge className="bg-blue-600">Document</Badge>;
      case "content":
        return <Badge className="bg-purple-600">Content</Badge>;
      case "event":
        return <Badge className="bg-amber-600">Event</Badge>;
      case "user":
        return <Badge className="bg-green-600">User</Badge>;
      case "system":
        return <Badge className="bg-gray-600">System</Badge>;
      default:
        return <Badge>{actionType}</Badge>;
    }
  };

  const filteredActivities = filter 
    ? activities.filter(activity => filter.includes(activity.actionType))
    : activities;

  const displayActivities = filteredActivities.slice(0, limit);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>Recent actions taken in the CMS</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.map((activity) => (
            <div key={activity.id} className="flex items-start pb-3 last:pb-0 border-b last:border-0">
              <div className="mr-2 mt-0.5">
                <div className={`p-2 rounded-full 
                  ${activity.actionType === "document" ? "bg-blue-100 text-blue-700" : 
                  activity.actionType === "content" ? "bg-purple-100 text-purple-700" : 
                  activity.actionType === "event" ? "bg-amber-100 text-amber-700" : 
                  activity.actionType === "user" ? "bg-green-100 text-green-700" : 
                  "bg-gray-100 text-gray-700"}`}>
                  {getActionIcon(activity.actionType)}
                </div>
              </div>
              <div className="w-full">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{activity.action}</p>
                    {getActionBadge(activity.actionType)}
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {activity.user} • {activity.item}
                </p>
                {activity.details && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.details}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityLog;
