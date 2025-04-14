
import { useNavigate } from 'react-router-dom';
import { FunnelStep } from '@/types/funnel';
import { useToast } from '@/hooks/use-toast';

export const useFunnelNavigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleCTAAction = (
    action: string, 
    ctaUrl?: string, 
    nextStepIndex?: number, 
    totalSteps?: number
  ) => {
    // Track the CTA click
    console.log(`CTA clicked: ${action}`);
    
    // Handle the action based on the CTA type
    switch (action) {
      case 'next_step':
        if (nextStepIndex !== undefined && totalSteps !== undefined) {
          if (nextStepIndex < totalSteps) {
            return { type: 'next_step' };
          }
        }
        break;
      case 'join_community':
        return { type: 'show_lead_form' };
      case 'purchase':
        navigate('/pricing');
        break;
      case 'go_to_training':
        navigate('/learn');
        break;
      case 'go_to_course':
        if (ctaUrl) {
          navigate(ctaUrl);
        } else {
          navigate('/learn');
        }
        break;
      case 'go_to_dashboard':
        navigate('/dashboard');
        break;
      case 'external_url':
        if (ctaUrl) {
          window.open(ctaUrl, '_blank');
        }
        break;
      default:
        break;
    }
    
    return null;
  };

  const handleLeadCaptureSuccess = (isAuthenticated: boolean) => {
    toast({
      title: "Thanks for joining!",
      description: "You've been added to our community. Check your email for next steps.",
    });
    
    // Redirect to dashboard if authenticated, otherwise to the home page
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };
  
  return { handleCTAAction, handleLeadCaptureSuccess };
};
