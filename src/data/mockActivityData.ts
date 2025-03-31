
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
    
    const fireReactions = Math.floor(Math.random() * 15);
    const heartReactions = Math.floor(Math.random() * 10);
    const clapReactions = Math.floor(Math.random() * 20);
    
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
      reactions: {
        fire: fireReactions,
        heart: heartReactions,
        clap: clapReactions
      },
      userHasReacted: {
        fire: Math.random() < 0.2,
        heart: Math.random() < 0.2,
        clap: Math.random() < 0.2
      }
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
