
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ExternalLink, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

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
      // In a real implementation, this would call a Supabase Edge Function
      // For now, we'll use a mock response
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // This URL would come from the Stripe API in a real implementation
      const mockRedirectUrl = `https://connect.stripe.com/oauth/v2/authorize?response_type=code&client_id=ca_xxxx&scope=read_write&redirect_uri=${window.location.origin}/dashboard`;
      
      toast({
        title: "Redirecting to Stripe",
        description: "You'll be redirected to securely connect your Stripe account."
      });
      
      // In a real implementation, we'd redirect to this URL
      console.log("Would redirect to:", mockRedirectUrl);
      
      // For demo, we'll just update the user profile with mock data
      updateUserProfile({
        stripeAccountId: 'acct_mock123456',
        stripeAccountStatus: 'pending',
        stripeAccountDetails: {
          chargesEnabled: false,
          payoutsEnabled: false,
          detailsSubmitted: false
        }
      });
      
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
      // In a real implementation, this would call a Supabase Edge Function
      // For now, we'll use a mock response
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // This URL would come from the Stripe API in a real implementation
      const mockDashboardUrl = 'https://dashboard.stripe.com/express';
      
      toast({
        title: "Opening Stripe Dashboard",
        description: "You'll be redirected to your Stripe Express dashboard."
      });
      
      // In a real implementation, we'd open this URL
      console.log("Would open:", mockDashboardUrl);
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
