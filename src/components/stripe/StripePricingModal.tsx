
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useMembership } from '@/context/MembershipContext';

interface StripePricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTier?: 'premium' | 'vip';
}

const StripePricingModal: React.FC<StripePricingModalProps> = ({
  open,
  onOpenChange,
  defaultTier = 'premium'
}) => {
  const [selectedTier, setSelectedTier] = useState<'premium' | 'vip'>(defaultTier);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { currentTier } = useMembership();
  const { toast } = useToast();

  const handlePurchase = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would call a Supabase Edge Function
      // that creates a Stripe Checkout session
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // This URL would come from the Stripe API in a real implementation
      const mockCheckoutUrl = 'https://checkout.stripe.com/c/pay/mock_session';
      
      toast({
        title: "Redirecting to Checkout",
        description: "You'll be redirected to securely complete your purchase."
      });
      
      // In a real implementation, we would redirect to the Stripe Checkout
      console.log(`Would redirect to Stripe Checkout for ${selectedTier} tier`);
      
      // Close the modal
      onOpenChange(false);
      
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast({
        title: "Checkout Failed",
        description: "There was an error setting up the checkout. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const premiumFeatures = [
    "Access to premium signals",
    "Advanced dashboard analytics",
    "Early access to new features",
    "Premium community access",
    "Email support"
  ];

  const vipFeatures = [
    "Everything in Premium",
    "Custom domain support",
    "1-on-1 strategy sessions",
    "VIP community access",
    "Higher affiliate commissions",
    "Priority support"
  ];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Upgrade Your HyperFIRE Account</DialogTitle>
          <DialogDescription>
            Choose a plan that works for you and start unlocking premium features
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {/* Premium Tier */}
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedTier === 'premium' 
                ? 'ring-2 ring-purple-500 border-purple-300 bg-purple-50 dark:bg-purple-900/30' 
                : 'hover:border-purple-200 hover:bg-purple-50/50 dark:hover:bg-purple-900/10'
            }`}
            onClick={() => setSelectedTier('premium')}
          >
            <div className="mb-2 flex justify-between items-center">
              <h3 className="font-bold text-lg">Premium</h3>
              {currentTier === 'premium' && (
                <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Current Plan</div>
              )}
            </div>
            <div className="mb-4">
              <span className="text-2xl font-bold">$49</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-2 text-sm mb-4">
              {premiumFeatures.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 mr-2 mt-1 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* VIP Tier */}
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedTier === 'vip' 
                ? 'ring-2 ring-amber-500 border-amber-300 bg-amber-50 dark:bg-amber-900/30' 
                : 'hover:border-amber-200 hover:bg-amber-50/50 dark:hover:bg-amber-900/10'
            }`}
            onClick={() => setSelectedTier('vip')}
          >
            <div className="mb-2 flex justify-between items-center">
              <h3 className="font-bold text-lg">VIP</h3>
              {currentTier === 'vip' && (
                <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Current Plan</div>
              )}
            </div>
            <div className="mb-4">
              <span className="text-2xl font-bold">$199</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-2 text-sm mb-4">
              {vipFeatures.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 mr-2 mt-1 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-xs text-muted-foreground mb-4">
          By proceeding with the purchase, you agree to our Terms of Service and Privacy Policy.
          You can cancel your subscription at any time.
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            className={selectedTier === 'premium' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-amber-600 hover:bg-amber-700'} 
            onClick={handlePurchase}
            disabled={loading || (currentTier === selectedTier)}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : currentTier === selectedTier ? (
              'Current Plan'
            ) : (
              `Upgrade to ${selectedTier === 'premium' ? 'Premium' : 'VIP'}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StripePricingModal;
