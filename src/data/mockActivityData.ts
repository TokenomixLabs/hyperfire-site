
import { ActivityItem, ActivityType } from "@/types/activity";
import {
  MessageSquare,
  Award,
  FileText,
  Link2,
  Volume2,
  User,
  GraduationCap,
  Zap,
  Trophy,
  Sparkles,
} from "lucide-react";

// Helper to get icon for activity type
export const getIconForActivityType = (type: ActivityType) => {
  switch (type) {
    case "referral":
      return Award;
    case "course_duplicated":
      return FileText;
    case "thread_created":
    case "reply_added":
      return MessageSquare;
    case "course_completed":
      return GraduationCap;
    case "cta_clicked":
      return Link2;
    case "admin_announcement":
      return Volume2;
    case "milestone_reached":
      return Zap;
    case "personal_milestone":
      return Trophy;
    default:
      return User;
  }
};

// Generate a random time between now and 7 days ago
const getRandomPastTime = () => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const randomTime = new Date(
    sevenDaysAgo.getTime() + Math.random() * (now.getTime() - sevenDaysAgo.getTime())
  );
  return randomTime.toISOString();
};

// Generate random avatar URL
const getRandomAvatar = () => {
  const avatarIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const randomId = avatarIds[Math.floor(Math.random() * avatarIds.length)];
  return `https://i.pravatar.cc/150?img=${randomId}`;
};

// Generate random username
const getRandomUsername = () => {
  const firstNames = ["Alex", "Jordan", "Taylor", "Casey", "Morgan", "Riley", "Cameron", "Avery", "Skyler", "Dakota"];
  const lastNames = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Miller", "Davis", "Garcia", "Wilson", "Anderson"];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${firstName}${lastName}`;
};

// Generate AI summary for threads
export const generateAiSummaryForThread = (threadTitle: string) => {
  const summaries = [
    "This thread discusses market trends with focus on emerging technologies and potential investment opportunities in the AI sector.",
    "An analysis of recent market movements with insights on bullish patterns that may indicate a recovery in the crypto space.",
    "Community debate on inflation impacts with several strong viewpoints on how it might affect digital assets.",
    "Technical breakdown of recent price action with detailed chart analysis showing key support and resistance levels.",
    "Discussion explores interoperability between blockchains and how this might shape future development.",
    "Overview of regulatory developments in major markets with commentary on potential impacts for investors.",
    "Members share strategies for risk management during market volatility with practical examples.",
    "Analysis of institutional adoption trends and how they're influencing market sentiment and price action.",
    "Exploration of DeFi innovations with focus on yield farming opportunities and associated risks.",
    "Discussion of environmental concerns related to proof-of-work consensus mechanisms and sustainable alternatives."
  ];
  
  // Select a summary based on some property of the thread title
  const index = Math.abs(threadTitle.charCodeAt(0) + (threadTitle.charCodeAt(1) || 0)) % summaries.length;
  return summaries[index];
};

// Generate milestone activity
export const generateMilestoneActivity = (): ActivityItem => {
  const isSelf = Math.random() < 0.5; // 50% chance it's the user's own milestone
  const username = isSelf ? "You" : getRandomUsername();
  
  // Different milestone types
  const milestoneTypes = ["referral", "course", "signal", "reply", "view"] as const;
  const milestoneType = milestoneTypes[Math.floor(Math.random() * milestoneTypes.length)];
  
  let title = "";
  let message = "";
  let targetUrl = "";
  let milestoneValue = 0;
  
  switch (milestoneType) {
    case "referral":
      milestoneValue = Math.floor(Math.random() * 4) * 5 + 5; // 5, 10, 15, or 20
      title = `${isSelf ? "You" : username} Reached ${milestoneValue} Referrals!`;
      message = `${isSelf ? "You've" : `${username} has`} successfully referred ${milestoneValue} users to the platform. Keep growing your network!`;
      targetUrl = isSelf ? "/dashboard/referrals" : `/profile/${username}`;
      break;
    case "course":
      title = `${isSelf ? "You" : username} Completed a Course Series!`;
      message = `${isSelf ? "You've" : `${username} has`} finished the entire "Advanced Trading Strategies" course series. Great job!`;
      targetUrl = isSelf ? "/learn" : `/profile/${username}`;
      break;
    case "signal":
      milestoneValue = Math.floor(Math.random() * 5) * 5 + 5; // 5, 10, 15, 20, or 25
      title = `${isSelf ? "Your" : `${username}'s`} Signal Reached ${milestoneValue} Duplicates!`;
      message = `The "${Math.random() < 0.5 ? "Market Analysis" : "Technical Strategy"}" signal has been duplicated ${milestoneValue} times. It's making an impact!`;
      targetUrl = "/signalboard/popular";
      break;
    case "reply":
      milestoneValue = Math.floor(Math.random() * 3) * 50 + 50; // 50, 100, or 150
      title = `${isSelf ? "Your" : `${username}'s`} Thread Hit ${milestoneValue} Replies!`;
      message = `The thread "${Math.random() < 0.5 ? "Predictions for Q3" : "Strategy Discussion"}" is generating lots of engagement with ${milestoneValue} replies.`;
      targetUrl = "/signalboard/trending";
      break;
    case "view":
      milestoneValue = Math.floor(Math.random() * 5) * 100 + 100; // 100, 200, 300, 400, or 500
      title = `Milestone: ${milestoneValue}+ Views!`;
      message = `${isSelf ? "Your" : `${username}'s`} content has been viewed over ${milestoneValue} times. You're making an impact in the community!`;
      targetUrl = isSelf ? "/dashboard/stats" : `/profile/${username}`;
      break;
  }
  
  return {
    id: `milestone-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type: isSelf ? "personal_milestone" : "milestone_reached",
    title,
    message,
    timestamp: new Date().toISOString(),
    userId: isSelf ? "current-user" : `user-${Math.floor(Math.random() * 1000)}`,
    username,
    userAvatar: getRandomAvatar(),
    targetUrl,
    featured: true,
    forYou: isSelf,
    milestoneType,
    milestoneValue,
    reactions: {
      fire: 0,
      heart: 0,
      clap: 0
    },
    userHasReacted: {
      fire: false,
      heart: false,
      clap: false
    }
  };
};

// Generate mock activity data
export const generateMockActivityData = (count: number = 50): ActivityItem[] => {
  const activityTypes: ActivityType[] = [
    "referral",
    "course_duplicated",
    "thread_created",
    "reply_added",
    "course_completed",
    "cta_clicked",
    "admin_announcement",
    "milestone_reached"
  ];
  
  const activities: ActivityItem[] = [];
  
  for (let i = 0; i < count; i++) {
    const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const username = getRandomUsername();
    const referredUsername = getRandomUsername();
    
    let title = "";
    let message = "";
    let targetUrl = "";
    
    switch (type) {
      case "referral":
        title = "New Referral";
        message = `${username} referred ${referredUsername} to the platform`;
        targetUrl = "/dashboard/referrals";
        break;
      case "course_duplicated":
        title = "Course Duplicated";
        message = `${username} duplicated the "DeFi Mastery" course`;
        targetUrl = "/content/courses/defi-mastery";
        break;
      case "thread_created":
        title = "New Signal Thread";
        message = `${username} created a new thread: "Market Trends for Q2"`;
        targetUrl = "/signalboard/thread/123";
        break;
      case "reply_added":
        title = "New Reply";
        message = `${username} replied to the thread "Technical Analysis Basics"`;
        targetUrl = "/signalboard/thread/456?reply=789";
        break;
      case "course_completed":
        title = "Course Completed";
        message = `${username} completed the "Crypto Trading 101" course`;
        targetUrl = "/learn/crypto-trading-101";
        break;
      case "cta_clicked":
        title = "CTA Clicked";
        message = `${username}'s "Join Premium" CTA was clicked 5 times today`;
        targetUrl = "/dashboard/stats";
        break;
      case "admin_announcement":
        title = "Platform Announcement";
        message = `New feature released: Signal Pulse Activity Feed`;
        targetUrl = "/announcements/new-features";
        break;
      case "milestone_reached":
        title = "Milestone Reached";
        message = `${username} reached 50 referred users!`;
        targetUrl = `/profile/${username}`;
        break;
    }
    
    const featured = Math.random() < 0.1; // 10% chance to be featured
    const pinned = Math.random() < 0.05; // 5% chance to be pinned
    const forYou = Math.random() < 0.3; // 30% chance to be "for you"
    const relevanceScore = Math.floor(Math.random() * 100); // 0-100 relevance score
    
    const fireReactions = Math.floor(Math.random() * 15);
    const heartReactions = Math.floor(Math.random() * 10);
    const clapReactions = Math.floor(Math.random() * 20);
    
    // Generate AI summary for 20% of thread activities
    let aiSummary = undefined;
    if (type === "thread_created" && Math.random() < 0.2) {
      aiSummary = generateAiSummaryForThread("Market Trends for Q2");
    }
    
    // Metadata for filtering and personalization
    const metadata: Record<string, any> = {
      following: Math.random() < 0.4, // 40% chance user is following this content creator
      isOldThread: Math.random() < 0.3, // 30% chance it's an old thread
      tags: ["crypto", "trading", "defi", "analysis"].filter(() => Math.random() > 0.5), // Random tags
    };
    
    activities.push({
      id: `activity-${i}`,
      type,
      title,
      message,
      timestamp: getRandomPastTime(),
      userId: `user-${i}`,
      username,
      userAvatar: getRandomAvatar(),
      targetUrl,
      featured,
      pinned,
      forYou,
      relevanceScore,
      aiSummary,
      reactions: {
        fire: fireReactions,
        heart: heartReactions,
        clap: clapReactions
      },
      userHasReacted: {
        fire: Math.random() < 0.2,
        heart: Math.random() < 0.2,
        clap: Math.random() < 0.2
      },
      metadata
    });
  }
  
  // Sort by timestamp (newest first)
  return activities.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

// Format time as "Xm ago", "Xh ago", etc.
export const formatTimeAgo = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds} seconds ago`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
};
