
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, ExternalLink, Lock, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from '@/types/user';
import { format } from 'date-fns';
import StripeConnectButton from './StripeConnectButton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StripeConnectStatusProps {
  user: User;
  className?: string;
}

const StripeConnectStatus: React.FC<StripeConnectStatusProps> = ({ 
  user,
  className = ''
}) => {
  const isConnected = !!user?.stripeAccountId && 
    user?.stripeAccountStatus === 'active' && 
    user?.stripeAccountDetails?.chargesEnabled;

  const isPending = !!user?.stripeAccountId && user?.stripeAccountStatus === 'pending';

  const getStatusBadge = () => {
    if (isConnected) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                  <CheckCircle className="mr-1 h-3 w-3" /> Connected
                </Badge>
                <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground cursor-help" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Your Stripe account is fully connected and can receive payments. Commissions will be automatically sent to this account.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    if (isPending) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
                  <AlertTriangle className="mr-1 h-3 w-3" /> Setup Pending
                </Badge>
                <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground cursor-help" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Your Stripe account needs additional setup. Click the "Complete Stripe Setup" button to provide the required information.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center">
              <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                <Lock className="mr-1 h-3 w-3" /> Not Connected
              </Badge>
              <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground cursor-help" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>Connect your Stripe account to receive commission payouts directly to your bank account.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // If not connected, show a simple card with connect button
  if (!user?.stripeAccountId) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            Affiliate Payments
            {getStatusBadge()}
          </CardTitle>
          <CardDescription>
            Connect your Stripe account to receive affiliate commission payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-2 text-sm text-muted-foreground mb-4">
            <p>Earn commission for every user who signs up through your referral links. Payments are processed instantly when a referred user makes a purchase.</p>
          </div>
          <StripeConnectButton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          Stripe Connect Status
          {getStatusBadge()}
        </CardTitle>
        <CardDescription>
          {isPending 
            ? "Complete your Stripe account setup to receive payments" 
            : "Your Stripe account is connected and ready to receive payments"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Account ID</p>
              <p className="font-mono text-xs">{user.stripeAccountId}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-muted-foreground">Commission Rate</p>
              <p>{user.commissionRate || 80}%</p>
            </div>
            
            {user.stripeAccountDetails?.lastVerificationDate && (
              <div className="space-y-1">
                <p className="text-muted-foreground">Last Verified</p>
                <p>{format(new Date(user.stripeAccountDetails.lastVerificationDate), 'MMM d, yyyy')}</p>
              </div>
            )}
            
            <div className="space-y-1">
              <p className="text-muted-foreground">Status Details</p>
              <div className="flex flex-col gap-1">
                <Badge variant="outline" className={`w-fit ${user.stripeAccountDetails?.detailsSubmitted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {user.stripeAccountDetails?.detailsSubmitted ? 'Details Submitted' : 'Details Required'}
                </Badge>
                <Badge variant="outline" className={`w-fit ${user.stripeAccountDetails?.chargesEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {user.stripeAccountDetails?.chargesEnabled ? 'Charges Enabled' : 'Charges Disabled'}
                </Badge>
                <Badge variant="outline" className={`w-fit ${user.stripeAccountDetails?.payoutsEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {user.stripeAccountDetails?.payoutsEnabled ? 'Payouts Enabled' : 'Payouts Disabled'}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <StripeConnectButton />
            
            {isConnected && (
              <div className="mt-2 text-xs text-muted-foreground">
                Use this button to access your Stripe dashboard at any time
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StripeConnectStatus;
