
import { LucideIcon } from "lucide-react";

export type ActivityType = 
  | "referral" 
  | "course_duplicated" 
  | "thread_created"
  | "reply_added"
  | "course_completed"
  | "cta_clicked"
  | "admin_announcement"
  | "milestone_reached";

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
  };
  page: number;
  hasMore: boolean;
}
