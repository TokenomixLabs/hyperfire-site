
import { useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

// Helper functions for cookie management
const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
};

const setCookie = (name: string, value: string, days: number): void => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + value + expires + "; path=/";
};

// Types for localStorage
interface ReferralData {
  referrer: string;
  timestamp: number;
  platform?: string;
}

interface UseReferralTrackingProps {
  // Optional callback to execute when a referral is detected
  onReferralDetected?: (referralCode: string, platform?: string) => void;
  // Number of days to keep the referral cookie
  cookieDuration?: number;
}

const useReferralTracking = ({ 
  onReferralDetected,
  cookieDuration = 90  // Default to 90 days
}: UseReferralTrackingProps = {}) => {
  const { toast } = useToast();

  useEffect(() => {
    // Check for referral code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get('ref');
    const platform = urlParams.get('platform') || 'insiderlife'; // Default to InsiderLife
    
    if (referralCode) {
      console.log('✅ Referral detected in URL:', referralCode, 'platform:', platform);
      
      // Check for existing referral in localStorage (more persistent than cookies)
      let shouldTrack = true;
      
      try {
        const storedReferralData = localStorage.getItem('referralData');
        
        if (storedReferralData) {
          const referralData: ReferralData = JSON.parse(storedReferralData);
          const currentTime = new Date().getTime();
          const daysSinceReferral = (currentTime - referralData.timestamp) / (1000 * 60 * 60 * 24);
          
          // Only override if explicitly requested or if the cookie has expired
          if (daysSinceReferral < cookieDuration && !urlParams.get('override')) {
            shouldTrack = false;
            console.log('📝 Using existing referral data:', referralData);
          }
        }
        
        if (shouldTrack) {
          // Set the cookie for compatibility
          setCookie('referrer', referralCode, cookieDuration);
          
          // Store in localStorage with timestamp and platform
          const referralData: ReferralData = {
            referrer: referralCode,
            timestamp: new Date().getTime(),
            platform
          };
          
          localStorage.setItem('referralData', JSON.stringify(referralData));
          console.log('✅ Saved referral data to localStorage:', referralData);
          
          if (onReferralDetected) {
            onReferralDetected(referralCode, platform);
          }
          
          // For debugging/testing only - would be removed in production
          toast({
            title: "Referral Tracked",
            description: `You were referred by ${referralCode}`,
          });
        }
      } catch (error) {
        console.error('❌ Error storing referral data:', error);
        
        // Fallback to just setting the cookie
        setCookie('referrer', referralCode, cookieDuration);
      }
    }
  }, [onReferralDetected, cookieDuration, toast]);
  
  // Check if a user has visited via a referral link
  const hasReferral = useCallback((): boolean => {
    try {
      const storedReferralData = localStorage.getItem('referralData');
      return !!storedReferralData;
    } catch (error) {
      return false;
    }
  }, []);
  
  // Functions to expose to components using this hook
  const trackContentClick = useCallback((contentId: string, referralCode: string, platform: string = 'insiderlife') => {
    // In a real app, this would call an API to track the click
    console.log(`✅ Content ${contentId} clicked via ${platform} referral code ${referralCode}`);
    
    // Save click to localStorage for testing
    try {
      const clicks = JSON.parse(localStorage.getItem('referralClicks') || '[]');
      clicks.push({
        timestamp: new Date().toISOString(),
        contentId,
        referralCode,
        platform
      });
      localStorage.setItem('referralClicks', JSON.stringify(clicks));
    } catch (error) {
      console.error('❌ Error tracking click:', error);
    }
  }, []);
  
  const getCurrentReferrer = useCallback((): string | null => {
    // Try localStorage first (more persistent)
    try {
      const storedReferralData = localStorage.getItem('referralData');
      if (storedReferralData) {
        const referralData: ReferralData = JSON.parse(storedReferralData);
        return referralData.referrer;
      }
    } catch (error) {
      console.error('❌ Error retrieving referral data from localStorage:', error);
    }
    
    // Fall back to cookie
    return getCookie('referrer');
  }, []);
  
  const getReferralPlatform = useCallback((): string | null => {
    try {
      const storedReferralData = localStorage.getItem('referralData');
      if (storedReferralData) {
        const referralData: ReferralData = JSON.parse(storedReferralData);
        return referralData.platform || 'insiderlife';
      }
    } catch (error) {
      console.error('❌ Error retrieving referral platform from localStorage:', error);
    }
    
    return 'insiderlife'; // Default if not found
  }, []);
  
  return {
    trackContentClick,
    getCurrentReferrer,
    getReferralPlatform,
    hasReferral
  };
};

export default useReferralTracking;
