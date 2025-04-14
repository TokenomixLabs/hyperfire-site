
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import useReferralTracking from '@/hooks/useReferralTracking';
import { Funnel } from '@/types/funnel';

export const useFunnelTracking = (
  funnel: Funnel | null, 
  currentStepIndex: number, 
  isAuthenticated: boolean
) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getCurrentReferrer } = useReferralTracking();
  
  useEffect(() => {
    if (!funnel) return;
    
    // Track page view
    console.log(`Tracking funnel view: ${funnel.trackingId}, step: ${currentStepIndex + 1}`);
    
    // Check if we need to redirect logged-in users
    if (isAuthenticated && funnel.redirectLoggedInTo && funnel.redirectLoggedInTo !== 'first_step') {
      if (funnel.redirectLoggedInTo === 'dashboard') {
        navigate('/dashboard');
      } else if (funnel.redirectLoggedInTo === 'specific_url' && funnel.redirectLoggedInUrl) {
        navigate(funnel.redirectLoggedInUrl);
      }
    }
    
    // Check if authentication is required
    if (funnel.requiresAuth && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to view this content.",
      });
      navigate('/login');
    }
    
    // Check for referral code
    if (funnel.referralParams?.trackReferrals) {
      const referrer = getCurrentReferrer();
      if (referrer) {
        console.log(`Referral detected: ${referrer}`);
      }
    }
  }, [funnel, currentStepIndex, isAuthenticated, navigate, toast, getCurrentReferrer]);
};
