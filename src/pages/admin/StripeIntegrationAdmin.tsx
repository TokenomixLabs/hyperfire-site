
import React from 'react';
import { PageTitle } from '@/components/ui/page-headers';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Settings, CreditCard, Users, RefreshCw } from 'lucide-react';
import ConnectedAffiliatesManager from '@/components/admin/stripe/ConnectedAffiliatesManager';
import PaymentsManager from '@/components/admin/stripe/PaymentsManager';
import AnimatedTransition from '@/components/AnimatedTransition';
import { useToast } from '@/hooks/use-toast';

const StripeIntegrationAdmin = () => {
  const { toast } = useToast();
  
  const handleSyncSettings = async () => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Synced",
        description: "Stripe settings have been synced successfully.",
      });
      
    } catch (error) {
      console.error("Error syncing settings:", error);
      toast({
        title: "Sync Failed",
        description: "There was an error syncing Stripe settings.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <AnimatedTransition>
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <PageTitle>Stripe Integration</PageTitle>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => window.open('https://dashboard.stripe.com/', '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
            Open Stripe Dashboard
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Connect Status</CardTitle>
              <CardDescription>Payment processing readiness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Environment</span>
                  <span className="font-medium">Test Mode</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Webhooks</span>
                  <span className="font-medium text-green-600">Configured</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Products</span>
                  <span className="font-medium">3 Active</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Connected Accounts</span>
                  <span className="font-medium">12 Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Payment Stats</CardTitle>
              <CardDescription>Transaction overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Volume</span>
                  <span className="font-medium">$24,750.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Successful Payments</span>
                  <span className="font-medium">347</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Subscriptions</span>
                  <span className="font-medium">128</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Commission Payouts</span>
                  <span className="font-medium">$10,125.50</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Configuration</CardTitle>
              <CardDescription>Platform settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span className="font-medium">20%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Default Commission</span>
                  <span className="font-medium">80%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Instant Payouts</span>
                  <span className="font-medium text-green-600">Enabled</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={handleSyncSettings}
              >
                <Settings className="h-4 w-4 mr-2" />
                Update Settings
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="affiliates" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:w-auto md:inline-flex">
            <TabsTrigger value="affiliates" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Connected Affiliates</span>
              <span className="md:hidden">Affiliates</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden md:inline">Payment History</span>
              <span className="md:hidden">Payments</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="affiliates" className="space-y-6">
            <ConnectedAffiliatesManager />
          </TabsContent>
          
          <TabsContent value="payments" className="space-y-6">
            <PaymentsManager />
          </TabsContent>
        </Tabs>
      </div>
    </AnimatedTransition>
  );
};

export default StripeIntegrationAdmin;
