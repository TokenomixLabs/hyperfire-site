
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import AnimatedTransition from '@/components/AnimatedTransition';
import Header from '@/components/Header';
import { useMembership } from '@/context/MembershipContext';
import { TierLevel } from '@/types/membership';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

const Pricing = () => {
  const [searchParams] = useSearchParams();
  const initialTier = searchParams.get('tier') as TierLevel | null;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { tiersList, currentTier, canUpgrade } = useMembership();
  const { isAuthenticated } = useAuth();
  
  const [yearlyBilling, setYearlyBilling] = useState(true);
  
  // Filter out free tier and hidden tiers
  const paidTiers = tiersList.filter(tier => tier.id !== 'free' && !tier.isHidden);
  
  const handlePurchase = (tierId: TierLevel) => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in or sign up to subscribe",
        duration: 3000,
      });
      navigate(`/login?redirect=${encodeURIComponent(`/pricing?tier=${tierId}`)}`);
      return;
    }
    
    // If user is already on this tier or higher
    if (tierId === currentTier || !canUpgrade(tierId)) {
      toast({
        title: "Already Subscribed",
        description: `You already have access to ${tierId} features`,
        duration: 3000,
      });
      return;
    }
    
    // In a real app, this would redirect to a checkout page
    // For now, just show a toast
    toast({
      title: "Checkout Initiated",
      description: `Starting checkout for ${tierId} ${yearlyBilling ? 'yearly' : 'monthly'} plan`,
      duration: 3000,
    });
    
    // Simulate a redirect to checkout
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <AnimatedTransition className="container max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Choose Your SignalFire Plan</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Unlock powerful features to amplify your signal and build your community
          </p>
          
          <div className="flex items-center justify-center mt-8">
            <Label htmlFor="billing-toggle" className={!yearlyBilling ? "font-semibold" : ""}>
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={yearlyBilling}
              onCheckedChange={setYearlyBilling}
              className="mx-4"
            />
            <div className="flex items-center">
              <Label htmlFor="billing-toggle" className={yearlyBilling ? "font-semibold" : ""}>
                Yearly
              </Label>
              <span className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs py-0.5 px-2 rounded-full">
                Save 16%
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Free Tier */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-1">Free</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Get started with basic features</p>
              
              <div className="mb-6">
                <span className="text-3xl font-bold">$0</span>
                <span className="text-gray-600 dark:text-gray-400">/forever</span>
              </div>
              
              <Button 
                className="w-full mb-6" 
                variant="outline"
                onClick={() => navigate('/signup')}
                disabled={isAuthenticated && currentTier !== 'free'}
              >
                {isAuthenticated && currentTier === 'free' ? 'Current Plan' : 'Get Started'}
              </Button>
              
              <div className="space-y-3">
                {tiersList[0].features.map((feature, i) => (
                  <div key={i} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Paid Tiers */}
          {paidTiers.map((tier) => {
            const price = yearlyBilling ? tier.yearlyPrice : tier.monthlyPrice;
            const isCurrentTier = currentTier === tier.id;
            const isHighlighted = initialTier === tier.id || 
              (!initialTier && tier.id === 'premium');
            
            return (
              <div 
                key={tier.id}
                className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden 
                  ${isHighlighted 
                    ? 'ring-2 ring-purple-500 shadow-xl scale-105 lg:scale-100 lg:transform lg:translate-y-[-20px]' 
                    : 'shadow-md border border-gray-200 dark:border-gray-700'
                  }`}
              >
                {isHighlighted && (
                  <div className="bg-purple-500 text-white py-2 text-center font-medium">
                    Most Popular
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex justify-between items-center mb-1">
                    <h2 className="text-2xl font-bold">{tier.name}</h2>
                    <div className={`${tier.color} text-xs text-white py-1 px-2 rounded-full`}>
                      {tier.badge || tier.name}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{tier.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-3xl font-bold">${price}</span>
                    <span className="text-gray-600 dark:text-gray-400">
                      /{yearlyBilling ? 'year' : 'month'}
                    </span>
                  </div>
                  
                  <Button 
                    className={`w-full mb-6 ${isHighlighted ? tier.color : ''}`}
                    variant={isHighlighted ? "default" : "outline"}
                    onClick={() => handlePurchase(tier.id as TierLevel)}
                    disabled={isCurrentTier}
                  >
                    {isCurrentTier ? 'Current Plan' : `Upgrade to ${tier.name}`}
                  </Button>
                  
                  <div className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    
                    {/* Show what's not included from higher tiers */}
                    {paidTiers
                      .filter(t => t.order > tier.order)
                      .flatMap(t => t.features)
                      .filter((feature, i, arr) => !tier.features.includes(feature) && arr.indexOf(feature) === i)
                      .slice(0, 2)
                      .map((feature, i) => (
                        <div key={`not-${i}`} className="flex items-center text-gray-400">
                          <X className="h-5 w-5 text-gray-400 mr-2" />
                          <span>{feature}</span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold mb-4">Looking for a custom solution?</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Need specific features or have custom requirements? Contact us to discuss
            a tailored solution for your community or organization.
          </p>
          <Button variant="outline" size="lg" onClick={() => navigate('/contact')}>
            Contact Us
          </Button>
        </div>
      </AnimatedTransition>
    </div>
  );
};

export default Pricing;
