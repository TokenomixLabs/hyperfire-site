
import { useState, useEffect } from 'react';
import useReferralTracking from './useReferralTracking';
import { ReferralPlatform } from '@/context/ReferralContext';

export interface ReferralLink {
  platform: ReferralPlatform;
  url: string;
  isSet: boolean;
}

export interface ReferralStats {
  clicks: number;
  signups: number;
  sharedContent: number;
}

export interface PlatformStats extends ReferralStats {
  platform: ReferralPlatform;
}

export function useReferralState() {
  const [userReferralCode, setUserReferralCode] = useState<string | null>(null);
  const { getCurrentReferrer, trackContentClick } = useReferralTracking();
  const [referrer, setReferrer] = useState<string | null>(null);
  const [referralLinks, setReferralLinks] = useState<ReferralLink[]>([
    { platform: 'insiderlife', url: '', isSet: false },
    { platform: 'insiderdao', url: '', isSet: false },
    { platform: 'societi', url: '', isSet: false },
    { platform: 'aifc', url: '', isSet: false },
  ]);
  
  // Mock statistics - in a real app, these would come from an API
  const [aggregatedStats] = useState<ReferralStats>({
    clicks: 156,
    signups: 24,
    sharedContent: 8,
  });
  
  const [platformStats] = useState<PlatformStats[]>([
    { platform: 'insiderlife', clicks: 78, signups: 12, sharedContent: 4 },
    { platform: 'insiderdao', clicks: 45, signups: 8, sharedContent: 3 },
    { platform: 'societi', clicks: 21, signups: 3, sharedContent: 1 },
    { platform: 'aifc', clicks: 12, signups: 1, sharedContent: 0 },
  ]);
  
  useEffect(() => {
    // In a real app, this would come from the authenticated user's data
    setUserReferralCode("currentuser123");
    
    // Get the referrer from the cookie
    const currentReferrer = getCurrentReferrer();
    if (currentReferrer) {
      setReferrer(currentReferrer);
    }
    
    // Load saved referral links from localStorage only once on mount
    try {
      const savedLinks = localStorage.getItem('referralLinks');
      
      if (savedLinks) {
        const parsedLinks = JSON.parse(savedLinks) as ReferralLink[];
        setReferralLinks(parsedLinks);
      } else {
        // Initialize with the default InsiderLife link
        const defaultLinks = [...referralLinks];
        const defaultCode = "currentuser123"; // Don't use userReferralCode here to avoid dependency cycle
        defaultLinks[0] = {
          platform: 'insiderlife',
          url: `insiderlife.com/?ref=${defaultCode}`,
          isSet: true
        };
        setReferralLinks(defaultLinks);
        localStorage.setItem('referralLinks', JSON.stringify(defaultLinks));
      }
    } catch (error) {
      console.error('Failed to load referral links:', error);
    }
    // Only run this effect once on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const updateReferralLink = (platform: ReferralPlatform, url: string) => {
    const updatedLinks = referralLinks.map(link => 
      link.platform === platform 
        ? { ...link, url, isSet: url.trim() !== '' } 
        : link
    );
    
    setReferralLinks(updatedLinks);
    
    // Save to localStorage
    try {
      localStorage.setItem('referralLinks', JSON.stringify(updatedLinks));
    } catch (error) {
      console.error('Failed to save referral links:', error);
    }
  };
  
  const generateReferralLink = (contentUrl: string, platform: ReferralPlatform = 'insiderlife'): string => {
    if (!userReferralCode) return contentUrl;
    
    // Find the requested platform link
    const platformLink = referralLinks.find(link => link.platform === platform);
    
    // If no specific platform link is set, fallback to the InsiderLife referral code
    if (!platformLink || !platformLink.isSet) {
      // Add referral code to the URL
      const separator = contentUrl.includes('?') ? '&' : '?';
      return `${contentUrl}${separator}ref=${userReferralCode}`;
    }
    
    // If we have a full URL for the platform, use it with the content
    // Here we would need custom logic per platform to correctly format the URL
    // This is a simplified implementation
    return platformLink.url;
  };
  
  const trackClick = (contentId: string, platform: ReferralPlatform = 'insiderlife') => {
    if (!userReferralCode) return;
    
    trackContentClick(contentId, userReferralCode);
    
    // In a real app, we would send the platform information to the backend as well
    console.log(`Tracking click for ${platform} content: ${contentId}`);
  };

  return {
    userReferralCode,
    referrer,
    generateReferralLink,
    trackClick,
    referralLinks,
    updateReferralLink,
    aggregatedStats,
    platformStats
  };
}
