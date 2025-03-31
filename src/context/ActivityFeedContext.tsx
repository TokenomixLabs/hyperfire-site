
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ActivityItem, ActivityType, ActivityFeedState } from "@/types/activity";
import { generateMockActivityData } from "@/data/mockActivityData";
import { useToast } from "@/hooks/use-toast";

interface ActivityFeedContextType {
  activityState: ActivityFeedState;
  loadMoreActivities: () => void;
  filterActivities: (types?: ActivityType[], username?: string) => void;
  resetFilters: () => void;
  reactToActivity: (id: string, reactionType: "fire" | "heart" | "clap") => void;
}

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
    },
    page: 1,
    hasMore: true,
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
      if (shouldIncludeActivity(newActivity, activityState.filters)) {
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
  }, [activityState.filters, toast]);

  // Helper to check if an activity matches the current filters
  const shouldIncludeActivity = (
    activity: ActivityItem,
    filters: ActivityFeedState["filters"]
  ) => {
    // If there are type filters and this type isn't included, filter it out
    if (
      filters.types.length > 0 &&
      !filters.types.includes(activity.type)
    ) {
      return false;
    }
    
    // If there's a username filter and this username doesn't match, filter it out
    if (
      filters.username &&
      !activity.username.toLowerCase().includes(filters.username.toLowerCase())
    ) {
      return false;
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
        shouldIncludeActivity(activity, activityState.filters)
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
      types: types || activityState.filters.types,
      username: username !== undefined ? username : activityState.filters.username,
    };
    
    // Apply filters to all activities
    const filteredActivities = allActivities.filter(activity =>
      shouldIncludeActivity(activity, newFilters)
    );
    
    setActivityState(prev => ({
      ...prev,
      items: filteredActivities.slice(0, 10),
      filters: newFilters,
      page: 1,
      hasMore: filteredActivities.length > 10,
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
      }}
    >
      {children}
    </ActivityFeedContext.Provider>
  );
};
