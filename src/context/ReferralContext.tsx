
import React, { createContext, useContext } from 'react';
import { useReferralState, ReferralLink, ReferralStats, PlatformStats } from '@/hooks/useReferralState';

// Define the platforms we support
export type ReferralPlatform = 'insiderlife' | 'insiderdao' | 'societi' | 'aifc';

interface ReferralContextType {
  // The current user's referral code
  userReferralCode: string | null;
  // The referrer who referred the current user (if any)
  referrer: string | null;
  // Generate a referral link for the given content
  generateReferralLink: (contentUrl: string, platform?: ReferralPlatform) => string;
  // Track a click on a referral link
  trackClick: (contentId: string, platform?: ReferralPlatform) => void;
  // Get all referral links for the current user
  referralLinks: ReferralLink[];
  // Update a referral link
  updateReferralLink: (platform: ReferralPlatform, url: string) => void;
  // Get aggregated stats
  aggregatedStats: ReferralStats;
  // Get stats per platform
  platformStats: PlatformStats[];
}

const ReferralContext = createContext<ReferralContextType | undefined>(undefined);

export const ReferralProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const referralState = useReferralState();
  
  return (
    <ReferralContext.Provider value={referralState}>
      {children}
    </ReferralContext.Provider>
  );
};

export const useReferral = () => {
  const context = useContext(ReferralContext);
  if (context === undefined) {
    throw new Error("useReferral must be used within a ReferralProvider");
  }
  return context;
};
