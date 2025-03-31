
import React, { useState } from 'react';
import { PageTitle } from '@/components/ui/page-headers';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Zap, X, Search, Filter, Settings, UserCircle, Flame, MessageSquare, Bell, BellOff, Sparkles, Calendar, Trophy, Award, GraduationCap, Users } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useActivityFeed } from '@/context/ActivityFeedContext';
import ActivityItem from '@/components/activity/ActivityItem';
import { ActivityType, ActivityPreferences } from '@/types/activity';
import { getIconForActivityType } from '@/data/mockActivityData';

const ActivityFeedPage = () => {
  const { 
    activityState, 
    loadMoreActivities, 
    filterActivities, 
    resetFilters, 
    reactToActivity,
    setFeedMode,
    togglePreference,
    savePreferences
  } = useActivityFeed();
  
  const { items, isLoading, filters, hasMore, preferences } = activityState;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [feedModeTab, setFeedModeTab] = useState<string>(filters.feedMode || "all");
  const [tempPreferences, setTempPreferences] = useState<ActivityPreferences>(
    preferences || {
      showReferrals: true,
      showCourses: true,
      showThreads: true,
      showReplies: true,
      showAnnouncements: true,
      showMilestones: true,
      muteOldThreadReplies: false,
      muteNonFollowingActivity: false,
    }
  );
  
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
        selectedTypes = ["admin_announcement", "milestone_reached", "personal_milestone"];
        break;
      case "all":
      default:
        selectedTypes = [];
        break;
    }
    
    filterActivities(selectedTypes, filters.username);
  };
  
  // Handle feed mode change
  const handleFeedModeChange = (value: string) => {
    setFeedModeTab(value);
    setFeedMode(value as "all" | "for_you" | "following" | "top_signals");
  };
  
  // Handle toggle filter
  const handleTypeToggle = (values: string[]) => {
    filterActivities(values as ActivityType[], filters.username);
  };
  
  // Handle preference toggle
  const handlePreferenceChange = (key: keyof ActivityPreferences) => {
    setTempPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  // Save preferences
  const handleSavePreferences = () => {
    savePreferences(tempPreferences);
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
        
        <div className="flex gap-2">
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
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Notification Preferences</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Notification Preferences</DialogTitle>
                <DialogDescription>
                  Customize what activities appear in your feed.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Activity Types</h3>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-amber-500" />
                        <Label htmlFor="show-referrals">Referrals</Label>
                      </div>
                      <Switch
                        id="show-referrals"
                        checked={tempPreferences.showReferrals}
                        onCheckedChange={() => handlePreferenceChange('showReferrals')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-purple-500" />
                        <Label htmlFor="show-courses">Courses</Label>
                      </div>
                      <Switch
                        id="show-courses"
                        checked={tempPreferences.showCourses}
                        onCheckedChange={() => handlePreferenceChange('showCourses')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                        <Label htmlFor="show-threads">Threads</Label>
                      </div>
                      <Switch
                        id="show-threads"
                        checked={tempPreferences.showThreads}
                        onCheckedChange={() => handlePreferenceChange('showThreads')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-indigo-500" />
                        <Label htmlFor="show-replies">Replies</Label>
                      </div>
                      <Switch
                        id="show-replies"
                        checked={tempPreferences.showReplies}
                        onCheckedChange={() => handlePreferenceChange('showReplies')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-red-500" />
                        <Label htmlFor="show-announcements">Announcements</Label>
                      </div>
                      <Switch
                        id="show-announcements"
                        checked={tempPreferences.showAnnouncements}
                        onCheckedChange={() => handlePreferenceChange('showAnnouncements')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-pink-500" />
                        <Label htmlFor="show-milestones">Milestones</Label>
                      </div>
                      <Switch
                        id="show-milestones"
                        checked={tempPreferences.showMilestones}
                        onCheckedChange={() => handlePreferenceChange('showMilestones')}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Additional Settings</h3>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <Label htmlFor="mute-old-threads" className="text-sm">Mute replies to old threads</Label>
                      </div>
                      <Switch
                        id="mute-old-threads"
                        checked={tempPreferences.muteOldThreadReplies}
                        onCheckedChange={() => handlePreferenceChange('muteOldThreadReplies')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4 text-slate-500" />
                        <Label htmlFor="mute-non-following" className="text-sm">Only show followed users</Label>
                      </div>
                      <Switch
                        id="mute-non-following"
                        checked={tempPreferences.muteNonFollowingActivity}
                        onCheckedChange={() => handlePreferenceChange('muteNonFollowingActivity')}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setTempPreferences(preferences || {
                    showReferrals: true,
                    showCourses: true,
                    showThreads: true,
                    showReplies: true,
                    showAnnouncements: true,
                    showMilestones: true,
                    muteOldThreadReplies: false,
                    muteNonFollowingActivity: false,
                  })}
                >
                  Reset
                </Button>
                <Button onClick={handleSavePreferences}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Feed Mode Tabs */}
      <Tabs value={feedModeTab} onValueChange={handleFeedModeChange} className="w-full mb-4">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-1.5">
            <Flame className="h-4 w-4" />
            <span>All</span>
          </TabsTrigger>
          <TabsTrigger value="for_you" className="flex items-center gap-1.5">
            <UserCircle className="h-4 w-4" />
            <span>For You</span>
          </TabsTrigger>
          <TabsTrigger value="following" className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>Following</span>
          </TabsTrigger>
          <TabsTrigger value="top_signals" className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" />
            <span>Top Signals</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
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
              {(["referral", "course_duplicated", "thread_created", "reply_added", "course_completed", "cta_clicked", "admin_announcement", "milestone_reached", "personal_milestone"] as ActivityType[]).map((type) => {
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
                  case "personal_milestone": label = "Your Achievements"; break;
                }
                
                return (
                  <ToggleGroupItem key={type} value={type} className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5" />
                    <span>{label}</span>
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
            
            {(filters.types.length > 0 || filters.username || filters.feedMode !== "all") && (
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
                  {filters.types.length > 0 || filters.username || filters.feedMode !== "all"
                    ? "Try adjusting your filters or search query."
                    : "There are no activities to display yet."}
                </p>
                {(filters.types.length > 0 || filters.username || filters.feedMode !== "all") && (
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
