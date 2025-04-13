
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ExternalLink, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface StripeConnectButtonProps {
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

const StripeConnectButton: React.FC<StripeConnectButtonProps> = ({
  variant = 'default',
  size = 'default',
  className = '',
}) => {
  const [loading, setLoading] = useState(false);
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();

  const isConnected = !!user?.stripeAccountId && 
    user?.stripeAccountStatus === 'active' && 
    user?.stripeAccountDetails?.chargesEnabled;

  const isPending = !!user?.stripeAccountId && user?.stripeAccountStatus === 'pending';

  const handleConnectStripe = async () => {
    setLoading(true);
    try {
      // Call our Supabase Edge Function to create a Stripe account and get the onboarding URL
      const { data, error } = await supabase.functions.invoke('createStripeAccountLink');
      
      if (error) {
        throw new Error(error.message || 'Failed to create Stripe account link');
      }
      
      if (!data?.url) {
        throw new Error('No account link URL returned');
      }
      
      toast({
        title: "Redirecting to Stripe",
        description: "You'll be redirected to securely connect your Stripe account."
      });
      
      // Update user profile with the new Stripe account ID
      if (data.accountId && !user?.stripeAccountId) {
        updateUserProfile({
          stripeAccountId: data.accountId,
          stripeAccountStatus: 'pending',
          stripeAccountDetails: {
            chargesEnabled: false,
            payoutsEnabled: false,
            detailsSubmitted: false
          }
        });
      }
      
      // Redirect to the Stripe onboarding URL
      window.location.href = data.url;
      
    } catch (error) {
      console.error("Error connecting to Stripe:", error);
      toast({
        title: "Connection Failed",
        description: "There was an error connecting to Stripe. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDashboardOpen = async () => {
    setLoading(true);
    try {
      // In a real implementation, we would call another edge function to get a dashboard link
      // For example: const { data, error } = await supabase.functions.invoke('createStripeDashboardLink');
      // For now, we'll continue with the mock implementation
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // This URL would come from the Stripe API in a real implementation
      const mockDashboardUrl = 'https://dashboard.stripe.com/express';
      
      toast({
        title: "Opening Stripe Dashboard",
        description: "You'll be redirected to your Stripe Express dashboard."
      });
      
      // In a real implementation, we'd open the URL returned from the edge function
      window.open(mockDashboardUrl, '_blank');
    } catch (error) {
      console.error("Error opening Stripe dashboard:", error);
      toast({
        title: "Error",
        description: "There was an error opening your Stripe dashboard.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (isConnected) {
    return (
      <div className="space-y-2">
        <Button 
          variant="outline" 
          size={size} 
          className={`bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800 ${className}`}
          onClick={handleDashboardOpen}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="mr-2 h-4 w-4" />
          )}
          Stripe Connected
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="space-y-2">
        <Button 
          variant="outline" 
          size={size} 
          className={`bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:text-amber-800 ${className}`}
          onClick={handleDashboardOpen}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <AlertTriangle className="mr-2 h-4 w-4" />
          )}
          Complete Stripe Setup
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button 
        variant={variant} 
        size={size} 
        className={className}
        onClick={handleConnectStripe}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <span className="mr-2">💸</span>
        )}
        Connect Stripe Account
      </Button>
    </div>
  );
};

export default StripeConnectButton;
