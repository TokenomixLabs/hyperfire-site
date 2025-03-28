import { useEffect } from 'react';
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

interface UseReferralTrackingProps {
  // Optional callback to execute when a referral is detected
  onReferralDetected?: (referralCode: string) => void;
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
    
    if (referralCode) {
      const existingReferrer = getCookie('referrer');
      
      // If there's a new referral code and no existing cookie, or we're overriding
      if (!existingReferrer) {
        // Set the referral cookie
        setCookie('referrer', referralCode, cookieDuration);
        
        if (onReferralDetected) {
          onReferralDetected(referralCode);
        }
        
        // For debugging/testing only - would be removed in production
        toast({
          title: "Referral Tracked",
          description: `You were referred by ${referralCode}`,
        });
      }
    }
  }, [onReferralDetected, cookieDuration, toast]);
  
  // Functions to expose to components using this hook
  const trackContentClick = (contentId: string, referralCode: string) => {
    // In a real app, this would call an API to track the click
    console.log(`Content ${contentId} clicked via referral code ${referralCode}`);
    // This is a mock implementation - in a real app you'd send this to your backend
  };
  
  const getCurrentReferrer = (): string | null => {
    return getCookie('referrer');
  };
  
  return {
    trackContentClick,
    getCurrentReferrer
  };
};

export default useReferralTracking;
