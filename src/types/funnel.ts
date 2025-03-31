
import { ReferralPlatform } from "@/context/ReferralContext";
import { User } from "./user";

export type FunnelStepAction = 
  | 'next_step' 
  | 'join_community' 
  | 'purchase' 
  | 'go_to_training' 
  | 'go_to_course' 
  | 'go_to_dashboard' 
  | 'external_url';

export type FunnelVisibility = 'public' | 'private' | 'unlisted';

export interface FunnelStep {
  id: string;
  funnelId: string;
  title: string;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  order: number;
  ctaText: string;
  ctaAction: FunnelStepAction;
  ctaUrl?: string; // For external URLs or course/training IDs
  customHeadline?: string;
  customText?: string;
  trackingId?: string;
  isLastStep: boolean;
}

export interface FunnelStats {
  visits: number;
  ctaClicks: number;
  conversions: number;
  referralSignups: number;
  completionRate: number;
  stepStats: {
    stepId: string;
    visits: number;
    ctaClicks: number;
    dropOff: number;
  }[];
}

export interface Funnel {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  steps: FunnelStep[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isPublished: boolean;
  visibility: FunnelVisibility;
  customRoute?: string;
  trackingId: string;
  stats?: FunnelStats;
  requiresAuth?: boolean;
  redirectLoggedInTo?: 'first_step' | 'dashboard' | 'specific_url';
  redirectLoggedInUrl?: string;
  referralParams?: {
    trackReferrals: boolean;
    defaultPlatform: ReferralPlatform;
    affiliateEnabled: boolean;
  };
}

export interface FunnelStep {
  id: string;
  funnelId: string;
  title: string;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  order: number;
  ctaText: string;
  ctaAction: FunnelStepAction;
  ctaUrl?: string; // For external URLs or course/training IDs
  customHeadline?: string;
  customText?: string;
  trackingId?: string;
  isLastStep: boolean;
}

export interface FunnelVisitor {
  id: string;
  funnelId: string;
  visitorId: string;
  referralSource?: string;
  referralPlatform?: ReferralPlatform;
  user?: User;
  firstVisit: string;
  lastVisit: string;
  currentStep: string;
  stepsCompleted: string[];
  completedFunnel: boolean;
  convertedToSignup: boolean;
  convertedToPurchase: boolean;
}
