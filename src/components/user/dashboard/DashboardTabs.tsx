
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import StatsTab from './StatsTab';
import ReferralsTab from './ReferralsTab';
import ReferralLinksTab from './ReferralLinksTab';
import SharesTab from './SharesTab';
import AffiliateTab from './AffiliateTab';
import DashboardActivityWidget from '@/components/activity/DashboardActivityWidget';
import EmptyState from '@/components/empty-states/EmptyState';
import { Share2, Users } from 'lucide-react';
import { ReferralLink } from '@/types/referral';
import { ReferralPlatform } from '@/context/ReferralContext';

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  platformStats: any[];
  reachStats: any;
  referrals: any[];
  shares: any[];
  referralLinks: ReferralLink[];
  updateReferralLink: (platform: ReferralPlatform, url: string) => void;
  handleCopyLink: (link: string) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  activeTab,
  platformStats,
  reachStats,
  referrals,
  shares,
  referralLinks,
  updateReferralLink,
  handleCopyLink,
  setActiveTab
}) => {
  return (
    <>
      <TabsContent value="stats" className="mt-6">
        <StatsTab 
          platformStats={platformStats}
          reachStats={reachStats}
        />
      </TabsContent>
      
      <TabsContent value="referrals" className="mt-6">
        {referrals.length > 0 ? (
          <ReferralsTab />
        ) : (
          <EmptyState
            title="No Referrals Yet"
            description="Share your referral links with your network to start earning rewards."
            icon={<Users className="h-8 w-8" />}
            actionLabel="View Referral Links"
            onAction={() => setActiveTab('links')}
            size="md"
          />
        )}
      </TabsContent>
      
      <TabsContent value="links" className="mt-6">
        <ReferralLinksTab
          referralLinks={referralLinks}
          updateReferralLink={updateReferralLink}
          onCopyLink={handleCopyLink}
        />
      </TabsContent>
      
      <TabsContent value="shares" className="mt-6">
        {shares.length > 0 ? (
          <SharesTab shares={shares} />
        ) : (
          <EmptyState
            title="No Shares Yet"
            description="Start sharing content with your network to track engagement."
            icon={<Share2 className="h-8 w-8" />}
            actionLabel="Browse Content"
            actionHref="/content"
            size="md"
          />
        )}
      </TabsContent>
      
      <TabsContent value="activity" className="mt-6">
        <DashboardActivityWidget />
      </TabsContent>
      
      <TabsContent value="affiliate" className="mt-6">
        <AffiliateTab />
      </TabsContent>
    </>
  );
};

export default DashboardTabs;
