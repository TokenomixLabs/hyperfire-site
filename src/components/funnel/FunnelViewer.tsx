
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import useReferralTracking from '@/hooks/useReferralTracking';
import { Funnel, FunnelStep } from '@/types/funnel';
import LeadCaptureForm from './LeadCaptureForm';

interface FunnelViewerProps {
  funnel?: Funnel; // Optional for direct prop passing
}

export default function FunnelViewer({ funnel: propFunnel }: FunnelViewerProps) {
  const { slug } = useParams<{ slug: string }>();
  const [funnel, setFunnel] = useState<Funnel | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { getCurrentReferrer } = useReferralTracking();
  
  useEffect(() => {
    if (propFunnel) {
      setFunnel(propFunnel);
      setLoading(false);
      return;
    }
    
    // If no prop funnel, load by slug
    const loadFunnel = async () => {
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
        } else {
          toast({
            title: "Funnel not found",
            description: "The requested funnel could not be found.",
            variant: "destructive",
          });
          navigate('/');
        }
        
        setLoading(false);
      }, 800);
    };
    
    loadFunnel();
  }, [slug, propFunnel, toast, navigate]);
  
  useEffect(() => {
    // Check for referral code and auth requirements
    if (funnel) {
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
    }
  }, [funnel, currentStepIndex, isAuthenticated, navigate, toast, getCurrentReferrer]);
  
  const currentStep = funnel?.steps[currentStepIndex];
  
  const handleCTAClick = () => {
    if (!funnel || !currentStep) return;
    
    // Track the CTA click
    console.log(`CTA clicked: ${currentStep.trackingId}`);
    
    // Handle the action based on the CTA type
    switch (currentStep.ctaAction) {
      case 'next_step':
        if (currentStepIndex < funnel.steps.length - 1) {
          setCurrentStepIndex(currentStepIndex + 1);
        }
        break;
      case 'join_community':
        // Show the lead capture form
        setShowLeadForm(true);
        break;
      case 'purchase':
        navigate('/pricing');
        break;
      case 'go_to_training':
        navigate('/learn');
        break;
      case 'go_to_course':
        if (currentStep.ctaUrl) {
          navigate(currentStep.ctaUrl);
        } else {
          navigate('/learn');
        }
        break;
      case 'go_to_dashboard':
        navigate('/dashboard');
        break;
      case 'external_url':
        if (currentStep.ctaUrl) {
          window.open(currentStep.ctaUrl, '_blank');
        }
        break;
      default:
        break;
    }
  };
  
  const handleLeadCaptureSuccess = () => {
    toast({
      title: "Thanks for joining!",
      description: "You've been added to our community. Check your email for next steps.",
    });
    
    // Redirect to dashboard if authenticated, otherwise to the home page
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      // Could redirect to a thank you page or login page
      navigate('/');
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }
  
  if (!funnel || !currentStep) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <h2 className="text-2xl font-bold mb-2">Funnel Not Found</h2>
        <p className="text-muted-foreground mb-4">The requested funnel does not exist or is not available.</p>
        <Button onClick={() => navigate('/')}>Return to Home</Button>
      </div>
    );
  }
  
  // If showing the lead capture form
  if (showLeadForm) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">Complete Your Registration</h1>
            <p className="text-lg text-muted-foreground">
              Enter your information below to join our community and get access to exclusive content.
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <LeadCaptureForm
                funnelId={funnel.id}
                onSuccess={handleLeadCaptureSuccess}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            {currentStep.customHeadline || currentStep.title}
          </h1>
          
          {/* Progress indicator */}
          <div className="flex justify-center items-center space-x-2">
            {funnel.steps.map((_, index) => (
              <div 
                key={index}
                className={`h-2 w-12 rounded-full transition-colors ${
                  index === currentStepIndex 
                    ? 'bg-purple-600' 
                    : index < currentStepIndex
                    ? 'bg-purple-300'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Video content */}
        {currentStep.videoUrl && (
          <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
            <iframe
              src={currentStep.videoUrl}
              title={currentStep.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        )}
        
        {/* Thumbnail fallback (if no video) */}
        {!currentStep.videoUrl && currentStep.thumbnailUrl && (
          <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
            <img 
              src={currentStep.thumbnailUrl} 
              alt={currentStep.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Text content */}
        {currentStep.customText && (
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-center">{currentStep.customText}</p>
          </div>
        )}
        
        {/* CTA Button */}
        <div className="flex justify-center mt-8">
          <Button 
            onClick={handleCTAClick}
            className="px-8 py-6 text-lg bg-purple-600 hover:bg-purple-700"
          >
            {currentStep.ctaText}
            {currentStep.ctaAction === 'next_step' && (
              <ChevronRight className="ml-2 h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
