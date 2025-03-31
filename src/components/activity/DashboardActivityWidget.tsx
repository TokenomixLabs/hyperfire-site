
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Zap, ChevronRight, EyeOff } from 'lucide-react';
import { useActivityFeed } from '@/context/ActivityFeedContext';
import ActivityItem from './ActivityItem';
import { cn } from '@/lib/utils';

interface DashboardActivityWidgetProps {
  className?: string;
  onHide?: () => void;
}

const DashboardActivityWidget = ({ className, onHide }: DashboardActivityWidgetProps) => {
  const { activityState, reactToActivity } = useActivityFeed();
  const { items } = activityState;
  
  // Take just the first 3 items for the dashboard
  const displayItems = items.slice(0, 3);
  
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            <span>Recent Activity</span>
          </CardTitle>
          {onHide && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onHide}
              className="h-8 w-8"
            >
              <EyeOff className="h-4 w-4" />
              <span className="sr-only">Hide Activity Feed</span>
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {displayItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[150px] text-center">
            <Zap className="h-10 w-10 text-muted-foreground mb-3 opacity-20" />
            <p className="text-sm text-muted-foreground">No activities yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayItems.map((activity) => (
              <ActivityItem 
                key={activity.id} 
                activity={activity} 
                onReaction={reactToActivity}
                variant="standard"
              />
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-1">
        <Button variant="ghost" size="sm" className="w-full flex justify-between" asChild>
          <Link to="/activity">
            View All Activities
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DashboardActivityWidget;
