
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Flame, Clap } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ActivityItem as ActivityItemType } from '@/types/activity';
import { formatTimeAgo, getIconForActivityType } from '@/data/mockActivityData';
import { cn } from '@/lib/utils';

interface ActivityItemProps {
  activity: ActivityItemType;
  onReaction: (id: string, type: "fire" | "heart" | "clap") => void;
  variant?: 'compact' | 'standard';
}

const ActivityItem = ({ activity, onReaction, variant = 'standard' }: ActivityItemProps) => {
  const Icon = getIconForActivityType(activity.type);
  
  // Get appropriate style based on activity type
  const getColorClassForType = (type: string): string => {
    switch (type) {
      case "referral":
        return "text-amber-500 bg-amber-50 dark:bg-amber-900/20";
      case "course_duplicated":
        return "text-green-500 bg-green-50 dark:bg-green-900/20";
      case "thread_created":
      case "reply_added":
        return "text-blue-500 bg-blue-50 dark:bg-blue-900/20";
      case "course_completed":
        return "text-purple-500 bg-purple-50 dark:bg-purple-900/20";
      case "cta_clicked":
        return "text-teal-500 bg-teal-50 dark:bg-teal-900/20";
      case "admin_announcement":
        return "text-red-500 bg-red-50 dark:bg-red-900/20";
      case "milestone_reached":
        return "text-pink-500 bg-pink-50 dark:bg-pink-900/20";
      default:
        return "text-gray-500 bg-gray-50 dark:bg-gray-900/20";
    }
  };
  
  const colorClass = getColorClassForType(activity.type);
  
  if (variant === 'compact') {
    return (
      <Link 
        to={activity.targetUrl} 
        className={cn(
          "block p-3 hover:bg-muted/50 rounded-lg transition-colors",
          activity.pinned && "border-l-2 border-l-primary pl-2"
        )}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <div className={`p-1.5 rounded-md ${colorClass}`}>
              <Icon className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{activity.title}</p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">{activity.message}</p>
            <div className="flex justify-between items-center mt-1">
              <span className="text-[10px] text-muted-foreground">
                {formatTimeAgo(activity.timestamp)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }
  
  return (
    <div 
      className={cn(
        "p-4 rounded-lg hover:bg-muted/30 transition-colors border border-border/40",
        activity.featured && "bg-muted/20",
        activity.pinned && "border-l-4 border-l-primary"
      )}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <Avatar className="h-10 w-10">
            <AvatarImage src={activity.userAvatar} alt={activity.username} />
            <AvatarFallback>{activity.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            <div>
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-md ${colorClass}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <h3 className="font-medium text-sm">
                  <Link to={activity.targetUrl} className="hover:underline">
                    {activity.title}
                  </Link>
                </h3>
                {activity.featured && (
                  <Badge variant="secondary" className="ml-2 text-xs">Featured</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {activity.message}
              </p>
            </div>
            
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatTimeAgo(activity.timestamp)}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 rounded-full px-3 gap-1.5",
                activity.userHasReacted?.fire && "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-500"
              )}
              onClick={() => onReaction(activity.id, "fire")}
            >
              <Flame className="h-3.5 w-3.5" />
              <span className="text-xs">{activity.reactions?.fire || 0}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 rounded-full px-3 gap-1.5",
                activity.userHasReacted?.heart && "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-500"
              )}
              onClick={() => onReaction(activity.id, "heart")}
            >
              <Heart className="h-3.5 w-3.5" />
              <span className="text-xs">{activity.reactions?.heart || 0}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 rounded-full px-3 gap-1.5",
                activity.userHasReacted?.clap && "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-500"
              )}
              onClick={() => onReaction(activity.id, "clap")}
            >
              <Clap className="h-3.5 w-3.5" />
              <span className="text-xs">{activity.reactions?.clap || 0}</span>
            </Button>
            
            <div className="flex-1"></div>
            
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1"
              asChild
            >
              <Link to={activity.targetUrl}>
                View Details
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
