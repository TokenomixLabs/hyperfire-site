
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ActivityItem, ActivityType, ActivityFeedState, ActivityPreferences } from "@/types/activity";
import { generateMockActivityData, generateMilestoneActivity, generateAiSummaryForThread } from "@/data/mockActivityData";
import { useToast } from "@/hooks/use-toast";

interface ActivityFeedContextType {
  activityState: ActivityFeedState;
  loadMoreActivities: () => void;
  filterActivities: (types?: ActivityType[], username?: string) => void;
  resetFilters: () => void;
  reactToActivity: (id: string, reactionType: "fire" | "heart" | "clap") => void;
  setFeedMode: (mode: "all" | "for_you" | "following" | "top_signals") => void;
  togglePreference: (key: keyof ActivityPreferences) => void;
  savePreferences: (preferences: ActivityPreferences) => void;
}

const defaultPreferences: ActivityPreferences = {
  showReferrals: true,
  showCourses: true,
  showThreads: true,
  showReplies: true,
  showAnnouncements: true,
  showMilestones: true,
  muteOldThreadReplies: false,
  muteNonFollowingActivity: false,
};

const ActivityFeedContext = createContext<ActivityFeedContextType | undefined>(undefined);

export const useActivityFeed = () => {
  const context = useContext(ActivityFeedContext);
  if (!context) {
    throw new Error("useActivityFeed must be used within an ActivityFeedProvider");
  }
  return context;
};

interface ActivityFeedProviderProps {
  children: ReactNode;
}

export const ActivityFeedProvider = ({ children }: ActivityFeedProviderProps) => {
  const { toast } = useToast();
  const [allActivities, setAllActivities] = useState<ActivityItem[]>([]);
  const [activityState, setActivityState] = useState<ActivityFeedState>({
    items: [],
    isLoading: false,
    error: null,
    filters: {
      types: [],
      username: "",
      feedMode: "all",
    },
    page: 1,
    hasMore: true,
    preferences: defaultPreferences,
  });

  // Load initial mock data
  useEffect(() => {
    setActivityState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Generate mock activity data
      const mockData = generateMockActivityData(50);
      setAllActivities(mockData);
      
      // Set the first page of activities
      setActivityState(prev => ({
        ...prev,
        items: mockData.slice(0, 10),
        isLoading: false,
        hasMore: mockData.length > 10,
      }));
    } catch (error) {
      setActivityState(prev => ({
        ...prev,
        isLoading: false,
        error: "Failed to load activities",
      }));
    }
  }, []);

  // Simulate receiving a new activity every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Generate a single new activity
      const newActivity = generateMockActivityData(1)[0];
      
      // Add it to the beginning of the list
      setAllActivities(prev => [newActivity, ...prev]);
      
      // Apply current filters
      if (shouldIncludeActivity(newActivity, activityState.filters, activityState.preferences)) {
        setActivityState(prev => ({
          ...prev,
          items: [newActivity, ...prev.items],
        }));
        
        // Show toast notification for new activity
        toast({
          title: `🎯 ${newActivity.title}`,
          description: newActivity.message,
          duration: 5000,
        });
      }
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [activityState.filters, activityState.preferences, toast]);

  // Simulate generating personal milestones
  useEffect(() => {
    const milestoneInterval = setInterval(() => {
      // 20% chance to generate a milestone
      if (Math.random() < 0.2) {
        const milestone = generateMilestoneActivity();
        
        if (activityState.preferences?.showMilestones !== false) {
          setAllActivities(prev => [milestone, ...prev]);
          
          if (shouldIncludeActivity(milestone, activityState.filters, activityState.preferences)) {
            setActivityState(prev => ({
              ...prev,
              items: [milestone, ...prev.items],
            }));
            
            // Show celebratory toast notification for milestone
            toast({
              title: `🎉 ${milestone.title}`,
              description: milestone.message,
              duration: 8000,
            });
          }
        }
      }
    }, 120000); // Every 2 minutes
    
    return () => clearInterval(milestoneInterval);
  }, [activityState.filters, activityState.preferences, toast]);

  // Simulate generating AI summaries for popular threads
  useEffect(() => {
    // One-time effect to add AI summaries to some existing threads
    const threadActivities = allActivities.filter(
      activity => activity.type === "thread_created" && !activity.aiSummary
    );
    
    if (threadActivities.length > 0) {
      // Add AI summaries to 30% of thread activities
      const updatedActivities = [...allActivities];
      
      threadActivities.forEach((activity, index) => {
        if (index % 3 === 0) { // Every third thread gets a summary
          const activityIndex = updatedActivities.findIndex(a => a.id === activity.id);
          if (activityIndex !== -1) {
            updatedActivities[activityIndex] = {
              ...updatedActivities[activityIndex],
              aiSummary: generateAiSummaryForThread(activity.title),
            };
          }
        }
      });
      
      setAllActivities(updatedActivities);
      
      // Update current items if needed
      setActivityState(prev => ({
        ...prev,
        items: prev.items.map(item => {
          const updatedItem = updatedActivities.find(a => a.id === item.id);
          return updatedItem || item;
        }),
      }));
    }
  }, [allActivities.length]);

  // Helper to check if an activity matches the current filters and preferences
  const shouldIncludeActivity = (
    activity: ActivityItem,
    filters: ActivityFeedState["filters"],
    preferences?: ActivityPreferences
  ) => {
    // Apply feed mode filter
    if (filters.feedMode === "for_you" && !activity.forYou) {
      return false;
    }
    
    if (filters.feedMode === "following" && activity.metadata?.following !== true) {
      return false;
    }
    
    if (filters.feedMode === "top_signals" && 
        (activity.type !== "thread_created" || (activity.relevanceScore || 0) < 70)) {
      return false;
    }
    
    // If there are type filters and this type isn't included, filter it out
    if (filters.types.length > 0 && !filters.types.includes(activity.type)) {
      return false;
    }
    
    // If there's a username filter and this username doesn't match, filter it out
    if (filters.username && !activity.username.toLowerCase().includes(filters.username.toLowerCase())) {
      return false;
    }
    
    // Apply preference-based filtering
    if (preferences) {
      // Filter based on activity type preferences
      if (!preferences.showReferrals && activity.type === "referral") return false;
      if (!preferences.showCourses && (activity.type === "course_duplicated" || activity.type === "course_completed")) return false;
      if (!preferences.showThreads && activity.type === "thread_created") return false;
      if (!preferences.showReplies && activity.type === "reply_added") return false;
      if (!preferences.showAnnouncements && activity.type === "admin_announcement") return false;
      if (!preferences.showMilestones && (activity.type === "milestone_reached" || activity.type === "personal_milestone")) return false;
      
      // Additional mute preferences
      if (preferences.muteOldThreadReplies && activity.type === "reply_added" && activity.metadata?.isOldThread) return false;
      if (preferences.muteNonFollowingActivity && activity.metadata?.following !== true && activity.userId !== "current-user") return false;
    }
    
    return true;
  };

  // Load more activities (pagination)
  const loadMoreActivities = () => {
    if (!activityState.hasMore || activityState.isLoading) return;
    
    setActivityState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const nextPage = activityState.page + 1;
      const startIndex = (nextPage - 1) * 10;
      const endIndex = startIndex + 10;
      
      // Filter activities based on current filters
      const filteredActivities = allActivities.filter(activity =>
        shouldIncludeActivity(activity, activityState.filters, activityState.preferences)
      );
      
      const moreActivities = filteredActivities.slice(startIndex, endIndex);
      
      setActivityState(prev => ({
        ...prev,
        items: [...prev.items, ...moreActivities],
        page: nextPage,
        isLoading: false,
        hasMore: endIndex < filteredActivities.length,
      }));
    } catch (error) {
      setActivityState(prev => ({
        ...prev,
        isLoading: false,
        error: "Failed to load more activities",
      }));
    }
  };

  // Filter activities by type and/or username
  const filterActivities = (types?: ActivityType[], username?: string) => {
    const newFilters = {
      ...activityState.filters,
      types: types || activityState.filters.types,
      username: username !== undefined ? username : activityState.filters.username,
    };
    
    // Apply filters to all activities
    const filteredActivities = allActivities.filter(activity =>
      shouldIncludeActivity(activity, newFilters, activityState.preferences)
    );
    
    setActivityState(prev => ({
      ...prev,
      items: filteredActivities.slice(0, 10),
      filters: newFilters,
      page: 1,
      hasMore: filteredActivities.length > 10,
    }));
  };

  // Set feed mode
  const setFeedMode = (mode: "all" | "for_you" | "following" | "top_signals") => {
    const newFilters = {
      ...activityState.filters,
      feedMode: mode,
    };
    
    // Apply filters to all activities with the new feed mode
    const filteredActivities = allActivities.filter(activity =>
      shouldIncludeActivity(activity, newFilters, activityState.preferences)
    );
    
    setActivityState(prev => ({
      ...prev,
      items: filteredActivities.slice(0, 10),
      filters: newFilters,
      page: 1,
      hasMore: filteredActivities.length > 10,
    }));
  };

  // Toggle a single preference
  const togglePreference = (key: keyof ActivityPreferences) => {
    const newPreferences = {
      ...activityState.preferences,
      [key]: !activityState.preferences?.[key],
    } as ActivityPreferences;
    
    // Re-filter based on new preferences
    const filteredActivities = allActivities.filter(activity =>
      shouldIncludeActivity(activity, activityState.filters, newPreferences)
    );
    
    setActivityState(prev => ({
      ...prev,
      items: filteredActivities.slice(0, 10),
      page: 1,
      hasMore: filteredActivities.length > 10,
      preferences: newPreferences,
    }));
  };

  // Save all preferences at once
  const savePreferences = (preferences: ActivityPreferences) => {
    // Re-filter based on new preferences
    const filteredActivities = allActivities.filter(activity =>
      shouldIncludeActivity(activity, activityState.filters, preferences)
    );
    
    setActivityState(prev => ({
      ...prev,
      items: filteredActivities.slice(0, 10),
      page: 1,
      hasMore: filteredActivities.length > 10,
      preferences,
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setActivityState(prev => ({
      ...prev,
      items: allActivities.slice(0, 10),
      filters: {
        types: [],
        username: "",
        feedMode: "all",
      },
      page: 1,
      hasMore: allActivities.length > 10,
    }));
  };

  // Handle reaction to an activity
  const reactToActivity = (id: string, reactionType: "fire" | "heart" | "clap") => {
    // Update the activities with the new reaction
    setAllActivities(prev =>
      prev.map(activity => {
        if (activity.id === id) {
          const hasReacted = activity.userHasReacted?.[reactionType] || false;
          
          return {
            ...activity,
            reactions: {
              ...activity.reactions,
              [reactionType]: hasReacted
                ? (activity.reactions?.[reactionType] || 0) - 1
                : (activity.reactions?.[reactionType] || 0) + 1,
            },
            userHasReacted: {
              ...activity.userHasReacted,
              [reactionType]: !hasReacted,
            },
          };
        }
        return activity;
      })
    );
    
    // Also update the current state
    setActivityState(prev => ({
      ...prev,
      items: prev.items.map(activity => {
        if (activity.id === id) {
          const hasReacted = activity.userHasReacted?.[reactionType] || false;
          
          return {
            ...activity,
            reactions: {
              ...activity.reactions,
              [reactionType]: hasReacted
                ? (activity.reactions?.[reactionType] || 0) - 1
                : (activity.reactions?.[reactionType] || 0) + 1,
            },
            userHasReacted: {
              ...activity.userHasReacted,
              [reactionType]: !hasReacted,
            },
          };
        }
        return activity;
      }),
    }));
  };

  // Provide the state and functions to children
  return (
    <ActivityFeedContext.Provider
      value={{
        activityState,
        loadMoreActivities,
        filterActivities,
        resetFilters,
        reactToActivity,
        setFeedMode,
        togglePreference,
        savePreferences,
      }}
    >
      {children}
    </ActivityFeedContext.Provider>
  );
};
