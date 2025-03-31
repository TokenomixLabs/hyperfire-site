
export type TierLevel = 'free' | 'premium' | 'vip' | 'pro' | 'lifetime' | 'founders';

export interface TierPermissions {
  canAccessAffiliateTools: boolean;
  canCreateSignals: boolean;
  canAccessAIAdvisor: boolean;
  canCreateCTAs: boolean;
  canUseCustomDomains: boolean;
  canDuplicateCourses: boolean;
  [key: string]: boolean; // Allow for future custom permissions
}

export interface MembershipTier {
  id: TierLevel;
  name: string;
  description: string;
  monthlyPrice?: number;
  yearlyPrice?: number;
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
  permissions: TierPermissions;
  features: string[];
  color: string;
  badge?: string;
  order: number; // For sorting tiers in UI
  isDefault?: boolean;
  isHidden?: boolean;
  trialDays?: number;
}

export interface MembershipConfig {
  tiers: Record<TierLevel, MembershipTier>;
  defaultTier: TierLevel;
  enableTrials: boolean;
  defaultTrialDays: number;
}

export interface UserMembership {
  tier: TierLevel;
  expiresAt?: string; // ISO date string
  isInTrial?: boolean;
  trialEndsAt?: string; // ISO date string
  stripeCustId?: string;
  stripeSubId?: string;
  willDowngradeTo?: TierLevel;
  purchasedAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export interface MembershipContext {
  // Current user's membership info
  currentTier: TierLevel;
  tierDetails: MembershipTier;
  isInTrial: boolean;
  trialEndsAt: string | undefined;
  expiresAt: string | undefined;
  
  // Tier config and data
  tiers: Record<TierLevel, MembershipTier>;
  tiersList: MembershipTier[];
  
  // Helper functions
  hasPermission: (permission: keyof TierPermissions) => boolean;
  canUpgrade: (toTier: TierLevel) => boolean;
  getUpgradeUrl: (forTier?: TierLevel) => string;
  
  // Admin functions (only available to admins)
  updateUserTier?: (userId: string, tier: TierLevel) => Promise<void>;
  getUsersForTier?: (tier: TierLevel) => Promise<any[]>;
}
