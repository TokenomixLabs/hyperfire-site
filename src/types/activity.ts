
import { LucideIcon } from "lucide-react";

export type ActivityType = 
  | "referral" 
  | "course_duplicated" 
  | "thread_created"
  | "reply_added"
  | "course_completed"
  | "cta_clicked"
  | "admin_announcement"
  | "milestone_reached"
  | "personal_milestone"; // Added for gamified milestone announcements

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  message: string;
  timestamp: string;
  userId: string;
  username: string;
  userAvatar?: string;
  targetId?: string;
  targetType?: string;
  targetUrl: string;
  featured?: boolean;
  pinned?: boolean;
  forYou?: boolean; // Added for personalization
  relevanceScore?: number; // Added for feed prioritization
  aiSummary?: string; // Added for smart summaries
  milestoneType?: "referral" | "course" | "signal" | "reply" | "view"; // Added for milestone tracking
  milestoneValue?: number; // Added for milestone value
  reactions?: {
    fire: number;
    heart: number;
    clap: number;
  };
  userHasReacted?: {
    fire: boolean;
    heart: boolean;
    clap: boolean;
  };
  metadata?: Record<string, any>;
}

export interface ActivityFeedState {
  items: ActivityItem[];
  isLoading: boolean;
  error: string | null;
  filters: {
    types: ActivityType[];
    username: string;
    feedMode?: "all" | "for_you" | "following" | "top_signals"; // Added for feed modes
  };
  page: number;
  hasMore: boolean;
  preferences?: ActivityPreferences; // Added for notification preferences
}

// New interface for notification preferences
export interface ActivityPreferences {
  showReferrals: boolean;
  showCourses: boolean;
  showThreads: boolean;
  showReplies: boolean;
  showAnnouncements: boolean;
  showMilestones: boolean;
  muteOldThreadReplies: boolean;
  muteNonFollowingActivity: boolean;
}
