
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useMembership } from '@/context/MembershipContext';
import { TierGuard } from '@/components/membership/TierGuard';
import StripeConnectStatus from '@/components/stripe/StripeConnectStatus';
import { UpgradeOverlay } from '@/components/membership/UpgradeOverlay';
import ReferralLinksTab from './ReferralLinksTab'; 
import { ReferralPlatform, useReferral } from '@/context/ReferralContext';
import { useToast } from '@/hooks/use-toast';
import CommissionStats from './CommissionStats';
import ReferralLinkCard from './ReferralLinkCard';
import ReferralTransactions from './ReferralTransactions';

const AffiliateTab = () => {
  const { user } = useAuth();
  const { hasPermission } = useMembership();
  const { referralLinks, updateReferralLink } = useReferral();
  const { toast } = useToast();
  
  const canAccessAffiliateTools = hasPermission('canAccessAffiliateTools');
  
  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link).then(() => {
      toast({
        title: "Link Copied",
        description: "Referral link copied to clipboard!",
        duration: 3000,
      });
    });
  };

  if (!user) {
    return <div>Please log in to access affiliate tools.</div>;
  }
  
  if (!canAccessAffiliateTools) {
    return (
      <UpgradeOverlay 
        title="Affiliate Tools Locked"
        description="Upgrade to Premium or VIP to access affiliate tools and earn commissions."
        requiredTier="premium"
        variant="inline"
      >
        <div className="min-h-[300px]">
          <StripeConnectStatus user={user} />
        </div>
      </UpgradeOverlay>
    );
  }
  
  return (
    <div className="space-y-6">
      <StripeConnectStatus user={user} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReferralLinkCard />
        <CommissionStats />
      </div>
      
      <ReferralTransactions />
      
      <Card>
        <CardHeader>
          <CardTitle>Your Referral Links</CardTitle>
          <CardDescription>
            Share these links to earn commission on every purchase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReferralLinksTab 
            referralLinks={referralLinks}
            updateReferralLink={updateReferralLink}
            onCopyLink={handleCopyLink}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Commission Rates</CardTitle>
          <CardDescription>
            Your current commission rates for different products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            <div className="py-3 flex justify-between items-center">
              <div>
                <div className="font-medium">Premium Subscription</div>
                <div className="text-sm text-muted-foreground">Monthly and yearly plans</div>
              </div>
              <div className="font-medium text-green-600">{user.commissionRate || 80}%</div>
            </div>
            <div className="py-3 flex justify-between items-center">
              <div>
                <div className="font-medium">VIP Subscription</div>
                <div className="text-sm text-muted-foreground">Monthly and yearly plans</div>
              </div>
              <div className="font-medium text-green-600">{user.commissionRate || 80}%</div>
            </div>
            <div className="py-3 flex justify-between items-center">
              <div>
                <div className="font-medium">Digital Products</div>
                <div className="text-sm text-muted-foreground">One-time purchases</div>
              </div>
              <div className="font-medium text-green-600">{user.commissionRate || 80}%</div>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Commission rates are subject to change. Payments are processed instantly when a purchase is made through your referral link.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AffiliateTab;
