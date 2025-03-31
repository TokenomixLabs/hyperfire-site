
import React, { useState } from 'react';
import { PageTitle } from '@/components/ui/page-headers';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, X, Search, Filter } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useActivityFeed } from '@/context/ActivityFeedContext';
import ActivityItem from '@/components/activity/ActivityItem';
import { ActivityType } from '@/types/activity';
import { getIconForActivityType } from '@/data/mockActivityData';

const ActivityFeedPage = () => {
  const { activityState, loadMoreActivities, filterActivities, resetFilters, reactToActivity } = useActivityFeed();
  const { items, isLoading, filters, hasMore } = activityState;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Handle search query change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Submit search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterActivities(filters.types, searchQuery);
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    filterActivities(filters.types, "");
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    let selectedTypes: ActivityType[] = [];
    
    switch (value) {
      case "referrals":
        selectedTypes = ["referral"];
        break;
      case "courses":
        selectedTypes = ["course_duplicated", "course_completed"];
        break;
      case "signals":
        selectedTypes = ["thread_created", "reply_added"];
        break;
      case "ctas":
        selectedTypes = ["cta_clicked"];
        break;
      case "announcements":
        selectedTypes = ["admin_announcement", "milestone_reached"];
        break;
      case "all":
      default:
        selectedTypes = [];
        break;
    }
    
    filterActivities(selectedTypes, filters.username);
  };
  
  // Handle toggle filter
  const handleTypeToggle = (values: string[]) => {
    filterActivities(values as ActivityType[], filters.username);
  };
  
  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <PageTitle>
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-amber-500" />
            Signal Pulse
          </div>
        </PageTitle>
        
        <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full aspect-square"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </form>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full grid grid-cols-3 md:grid-cols-6 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="signals">Signals</TabsTrigger>
          <TabsTrigger value="ctas">CTAs</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-3">Filter by activity type:</p>
            <ToggleGroup 
              type="multiple" 
              className="flex flex-wrap gap-2"
              value={filters.types}
              onValueChange={handleTypeToggle}
            >
              {(["referral", "course_duplicated", "thread_created", "reply_added", "course_completed", "cta_clicked", "admin_announcement", "milestone_reached"] as ActivityType[]).map((type) => {
                const Icon = getIconForActivityType(type);
                let label = "";
                
                switch (type) {
                  case "referral": label = "Referrals"; break;
                  case "course_duplicated": label = "Course Duplication"; break;
                  case "thread_created": label = "New Threads"; break;
                  case "reply_added": label = "Replies"; break;
                  case "course_completed": label = "Course Completions"; break;
                  case "cta_clicked": label = "CTA Clicks"; break;
                  case "admin_announcement": label = "Announcements"; break;
                  case "milestone_reached": label = "Milestones"; break;
                }
                
                return (
                  <ToggleGroupItem key={type} value={type} className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5" />
                    <span>{label}</span>
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
            
            {(filters.types.length > 0 || filters.username) && (
              <div className="flex justify-end mt-4">
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <TabsContent value={activeTab} className="mt-0">
          <div className="space-y-4">
            {items.length === 0 ? (
              <Card className="p-12 flex flex-col items-center justify-center text-center">
                <Zap className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-xl font-medium mb-2">No activities found</h3>
                <p className="text-muted-foreground">
                  {filters.types.length > 0 || filters.username
                    ? "Try adjusting your filters or search query."
                    : "There are no activities to display yet."}
                </p>
                {(filters.types.length > 0 || filters.username) && (
                  <Button variant="outline" className="mt-4" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                )}
              </Card>
            ) : (
              <>
                {items.map((activity) => (
                  <ActivityItem 
                    key={activity.id} 
                    activity={activity} 
                    onReaction={reactToActivity}
                  />
                ))}
                
                {(hasMore || isLoading) && (
                  <div className="flex justify-center my-8">
                    <Button 
                      onClick={loadMoreActivities} 
                      disabled={isLoading || !hasMore}
                      variant="outline"
                    >
                      {isLoading ? "Loading..." : hasMore ? "Load More" : "No More Activities"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ActivityFeedPage;
