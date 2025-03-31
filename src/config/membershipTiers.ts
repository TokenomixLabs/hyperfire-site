
import { MembershipConfig, TierLevel } from "@/types/membership";

export const membershipTiers: MembershipConfig = {
  tiers: {
    free: {
      id: "free",
      name: "Free",
      description: "Get started with basic features",
      permissions: {
        canAccessAffiliateTools: false,
        canCreateSignals: false,
        canAccessAIAdvisor: false,
        canCreateCTAs: false,
        canUseCustomDomains: false,
        canDuplicateCourses: false
      },
      features: [
        "Access to SignalBoard community",
        "Limited Signal Library access",
        "Basic referral tracking"
      ],
      color: "bg-gray-500",
      order: 1,
      isDefault: true
    },
    premium: {
      id: "premium",
      name: "Premium",
      description: "Unlock advanced features and content",
      monthlyPrice: 19.99,
      yearlyPrice: 199.99,
      stripePriceIdMonthly: "price_premium_monthly",
      stripePriceIdYearly: "price_premium_yearly",
      permissions: {
        canAccessAffiliateTools: true,
        canCreateSignals: true,
        canAccessAIAdvisor: false,
        canCreateCTAs: false,
        canUseCustomDomains: false,
        canDuplicateCourses: true
      },
      features: [
        "Everything in Free",
        "Full Signal Library access",
        "Create and share signal series",
        "Advanced affiliate tools",
        "Premium education content"
      ],
      color: "bg-purple-600",
      badge: "Premium",
      order: 2,
      trialDays: 7
    },
    vip: {
      id: "vip",
      name: "VIP",
      description: "The ultimate SignalFire experience",
      monthlyPrice: 49.99,
      yearlyPrice: 499.99,
      stripePriceIdMonthly: "price_vip_monthly",
      stripePriceIdYearly: "price_vip_yearly",
      permissions: {
        canAccessAffiliateTools: true,
        canCreateSignals: true,
        canAccessAIAdvisor: true,
        canCreateCTAs: true,
        canUseCustomDomains: true,
        canDuplicateCourses: true
      },
      features: [
        "Everything in Premium",
        "AI Advisor access",
        "Custom CTA creation",
        "Custom domain support",
        "Priority support",
        "Early access to new features"
      ],
      color: "bg-amber-500",
      badge: "VIP",
      order: 3,
      trialDays: 7
    },
    pro: {
      id: "pro",
      name: "Pro",
      description: "For serious content creators",
      permissions: {
        canAccessAffiliateTools: true,
        canCreateSignals: true,
        canAccessAIAdvisor: true,
        canCreateCTAs: true,
        canUseCustomDomains: false,
        canDuplicateCourses: true
      },
      features: [],
      color: "bg-blue-600",
      order: 4,
      isHidden: true // Not available yet
    },
    lifetime: {
      id: "lifetime",
      name: "Lifetime",
      description: "One-time payment for lifetime access",
      permissions: {
        canAccessAffiliateTools: true,
        canCreateSignals: true,
        canAccessAIAdvisor: true,
        canCreateCTAs: true,
        canUseCustomDomains: true,
        canDuplicateCourses: true
      },
      features: [],
      color: "bg-emerald-600",
      order: 5,
      isHidden: true // Not available yet
    },
    founders: {
      id: "founders",
      name: "Founders",
      description: "Special access for founding members",
      permissions: {
        canAccessAffiliateTools: true,
        canCreateSignals: true,
        canAccessAIAdvisor: true,
        canCreateCTAs: true,
        canUseCustomDomains: true,
        canDuplicateCourses: true
      },
      features: [],
      color: "bg-rose-600",
      order: 6,
      isHidden: true // Not available yet
    }
  },
  defaultTier: "free",
  enableTrials: true,
  defaultTrialDays: 7
};

// Helper to get sorted tiers for display
export const getSortedVisibleTiers = () => {
  return Object.values(membershipTiers.tiers)
    .filter(tier => !tier.isHidden)
    .sort((a, b) => a.order - b.order);
};

// Helper to check if a tier exists
export const tierExists = (tierId: string): boolean => {
  return tierId in membershipTiers.tiers;
};

// Helper to get the next tier up (for upgrade suggestions)
export const getNextTier = (currentTier: TierLevel): TierLevel | null => {
  const visibleTiers = getSortedVisibleTiers();
  const currentIndex = visibleTiers.findIndex(tier => tier.id === currentTier);
  
  if (currentIndex === -1 || currentIndex === visibleTiers.length - 1) {
    return null;
  }
  
  return visibleTiers[currentIndex + 1].id as TierLevel;
};
