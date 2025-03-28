
import React, { createContext, useContext, useState, useEffect } from 'react';
import useReferralTracking from '@/hooks/useReferralTracking';

interface ReferralContextType {
  // The current user's referral code
  userReferralCode: string | null;
  // The referrer who referred the current user (if any)
  referrer: string | null;
  // Generate a referral link for the given content
  generateReferralLink: (contentUrl: string) => string;
  // Track a click on a referral link
  trackClick: (contentId: string) => void;
}

const ReferralContext = createContext<ReferralContextType | undefined>(undefined);

export const ReferralProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userReferralCode, setUserReferralCode] = useState<string | null>(null);
  const { getCurrentReferrer, trackContentClick } = useReferralTracking();
  const [referrer, setReferrer] = useState<string | null>(null);
  
  useEffect(() => {
    // In a real app, this would come from the authenticated user's data
    setUserReferralCode("currentuser123");
    
    // Get the referrer from the cookie
    const currentReferrer = getCurrentReferrer();
    if (currentReferrer) {
      setReferrer(currentReferrer);
    }
  }, [getCurrentReferrer]);
  
  const generateReferralLink = (contentUrl: string): string => {
    if (!userReferralCode) return contentUrl;
    
    // Add referral code to the URL
    const separator = contentUrl.includes('?') ? '&' : '?';
    return `${contentUrl}${separator}ref=${userReferralCode}`;
  };
  
  const trackClick = (contentId: string) => {
    if (!userReferralCode) return;
    
    trackContentClick(contentId, userReferralCode);
  };
  
  return (
    <ReferralContext.Provider value={{
      userReferralCode,
      referrer,
      generateReferralLink,
      trackClick
    }}>
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
