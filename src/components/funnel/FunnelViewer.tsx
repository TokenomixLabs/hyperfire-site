
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Funnel } from '@/types/funnel';
import FunnelStepDisplay from './FunnelStepDisplay';
import FunnelLeadCapture from './FunnelLeadCapture';
import FunnelError from './FunnelError';
import { useFunnelNavigation } from '@/hooks/useFunnelNavigation';
import { useFunnelTracking } from '@/hooks/useFunnelTracking';

interface FunnelViewerProps {
  funnel?: Funnel; // Optional for direct prop passing
}

export default function FunnelViewer({ funnel: propFunnel }: FunnelViewerProps) {
  const { slug } = useParams<{ slug: string }>();
  const [funnel, setFunnel] = useState<Funnel | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const { isAuthenticated } = useAuth();
  const { handleCTAAction, handleLeadCaptureSuccess } = useFunnelNavigation();
  
  // Track funnel views and handle auth redirects
  useFunnelTracking(funnel, currentStepIndex, isAuthenticated);
  
  useEffect(() => {
    if (propFunnel) {
      setFunnel(propFunnel);
      setLoading(false);
      return;
    }
    
    // If no prop funnel, load by slug
    loadFunnelBySlug();
  }, [slug, propFunnel]);
  
  const loadFunnelBySlug = async () => {
    setLoading(true);
    
    // In a real app, this would be an API call to load the funnel by slug
    // For now, we'll simulate with a timeout and mock data
    setTimeout(() => {
      // Mock data - in a real app this would come from an API
      if (slug) {
        const mockFunnel: Funnel = {
          id: 'funnel-1',
          slug: slug,
          title: 'VIP Insider Access',
          description: 'Exclusive funnel for VIP members',
          steps: [
            {
              id: 'step1',
              funnelId: 'funnel-1',
              title: 'Welcome to InsiderLife',
              description: 'Learn about our exclusive community',
              videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              thumbnailUrl: '/placeholder.svg',
              order: 0,
              ctaText: 'Continue to step 2',
              ctaAction: 'next_step',
              customHeadline: 'Join the Insiders Today!',
              customText: 'Get access to exclusive content and community benefits. Learn how you can level up your knowledge and network with like-minded individuals.',
              trackingId: 'step_1_track',
              isLastStep: false
            },
            {
              id: 'step2',
              funnelId: 'funnel-1',
              title: 'Member Benefits',
              description: 'Discover the benefits of membership',
              videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              thumbnailUrl: '/placeholder.svg',
              order: 1,
              ctaText: 'Join Now',
              ctaAction: 'join_community',
              customHeadline: 'Exclusive Benefits Await!',
              customText: 'Join now and get instant access to premium content, expert insights, and a supportive community to help you grow.',
              trackingId: 'step_2_track',
              isLastStep: true
            }
          ],
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-10T00:00:00Z',
          createdBy: 'admin_user',
          isPublished: true,
          visibility: 'public',
          customRoute: '/vip-invite',
          trackingId: 'funnel_vip_123',
          requiresAuth: false,
          redirectLoggedInTo: 'first_step',
          referralParams: {
            trackReferrals: true,
            defaultPlatform: 'insiderlife',
            affiliateEnabled: true
          }
        };
        
        setFunnel(mockFunnel);
      }
      
      setLoading(false);
    }, 800);
  };
  
  const handleCtaClick = () => {
    if (!funnel || !currentStep) return;
    
    const action = handleCTAAction(
      currentStep.ctaAction, 
      currentStep.ctaUrl,
      currentStepIndex + 1,
      funnel.steps.length
    );
    
    if (action) {
      if (action.type === 'next_step') {
        setCurrentStepIndex(currentStepIndex + 1);
      } else if (action.type === 'show_lead_form') {
        setShowLeadForm(true);
      }
    }
  };
  
  if (loading) {
    return <FunnelError type="loading" />;
  }
  
  if (!funnel || funnel.steps.length === 0) {
    return <FunnelError type="not-found" />;
  }
  
  const currentStep = funnel.steps[currentStepIndex];
  
  // If showing the lead capture form
  if (showLeadForm) {
    return (
      <FunnelLeadCapture 
        funnelId={funnel.id}
        onSuccess={() => handleLeadCaptureSuccess(isAuthenticated)}
      />
    );
  }
  
  return (
    <FunnelStepDisplay
      step={currentStep}
      stepIndex={currentStepIndex}
      totalSteps={funnel.steps.length}
      onCtaClick={handleCtaClick}
    />
  );
}
