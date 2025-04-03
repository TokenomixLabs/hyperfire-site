
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Zap, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { PageTitle } from '@/components/ui/page-headers';
import AnimatedTransition from '@/components/AnimatedTransition';
import { useMembership } from '@/context/MembershipContext';

const Pricing = () => {
  const navigate = useNavigate();
  const { currentTier } = useMembership();
  
  const scrollToCheckout = () => {
    document.getElementById('checkout-section')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <AnimatedTransition>
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-12">
          <PageTitle>Choose Your Plan</PageTitle>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Unlock advanced AI tools, exclusive content, and premium community features with HyperFIRE subscription
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Free Plan */}
          <Card className="border-border bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                InsiderLife Free Access
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Essential access to get started</p>
              <div className="mt-4">
                <span className="text-3xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-green-500 shrink-0"><Check className="h-5 w-5" /></span>
                  <span>Access to limited AI tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-green-500 shrink-0"><Check className="h-5 w-5" /></span>
                  <span>Access to community content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-green-500 shrink-0"><Check className="h-5 w-5" /></span>
                  <span>Limited daily credits</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-green-500 shrink-0"><Check className="h-5 w-5" /></span>
                  <span>Basic onboarding</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <span className="mt-0.5 text-red-500 shrink-0"><X className="h-5 w-5" /></span>
                  <span>No custom dashboards</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <span className="mt-0.5 text-red-500 shrink-0"><X className="h-5 w-5" /></span>
                  <span>No tokenized tools or gated drops</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <span className="mt-0.5 text-red-500 shrink-0"><X className="h-5 w-5" /></span>
                  <span>No HyperFIRE exclusive content</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <span className="mt-0.5 text-red-500 shrink-0"><X className="h-5 w-5" /></span>
                  <span>No private community sessions</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate('/signup')}>
                {currentTier === 'free' ? 'Current Plan' : 'Get Started'}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Premium Plan */}
          <Card className="border-purple-500/50 bg-gradient-to-b from-card to-card/95 shadow-lg relative hover:shadow-xl transition-shadow">
            <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs px-3 py-1 rounded-bl-md rounded-tr-md font-medium">
              RECOMMENDED
            </div>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <Flame className="h-5 w-5 text-amber-500" />
                HyperFIRE Subscription
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Unlock the full potential</p>
              <div className="mt-4">
                <span className="text-3xl font-bold">$49</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-green-500 shrink-0"><Check className="h-5 w-5" /></span>
                  <span>Full access to HyperFIRE AI platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-green-500 shrink-0"><Check className="h-5 w-5" /></span>
                  <span>Unlimited daily credits</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-green-500 shrink-0"><Check className="h-5 w-5" /></span>
                  <span>Advanced dashboards & toolkits</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-green-500 shrink-0"><Check className="h-5 w-5" /></span>
                  <span>Early access to tokenized drops</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-green-500 shrink-0"><Check className="h-5 w-5" /></span>
                  <span>Private live streams & content unlocks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-green-500 shrink-0"><Check className="h-5 w-5" /></span>
                  <span>Affiliate + monetization features</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-green-500 shrink-0"><Check className="h-5 w-5" /></span>
                  <span>Premium community sessions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-green-500 shrink-0"><Check className="h-5 w-5" /></span>
                  <span>First access to GOD MODE performance stack</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-green-500 shrink-0"><Check className="h-5 w-5" /></span>
                  <span>Priority support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={scrollToCheckout}>
                <Zap className="mr-1 h-4 w-4" />
                Subscribe Now
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Checkout Section Placeholder */}
        <div id="checkout-section" className="py-12">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to upgrade?</h2>
            <p className="text-muted-foreground mb-8">
              Join HyperFIRE today and unlock the full suite of premium features, exclusive content, and community benefits.
            </p>
            <Card className="bg-card/50 backdrop-blur-sm border border-purple-500/30">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 bg-purple-600/20 rounded-full flex items-center justify-center">
                    <Flame className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">HyperFIRE Premium</h3>
                <p className="text-sm text-muted-foreground mb-4">Billed monthly</p>
                <div className="text-2xl font-bold mb-6">$49/month</div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Zap className="mr-1 h-4 w-4" />
                  Checkout
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Secure payment powered by Stripe. Cancel anytime.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-2">What is HyperFIRE?</h3>
                <p className="text-muted-foreground">HyperFIRE is our premium subscription tier that gives you full access to all AI tools, advanced dashboards, exclusive content, and priority community features.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-2">Can I cancel my subscription?</h3>
                <p className="text-muted-foreground">Yes, you can cancel your subscription at any time. Your benefits will continue until the end of your billing cycle.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-2">What are tokenized drops?</h3>
                <p className="text-muted-foreground">Tokenized drops are exclusive digital assets and tools that are available first to our premium members before wider release.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default Pricing;
