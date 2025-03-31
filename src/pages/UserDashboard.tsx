
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnimatedTransition from '@/components/AnimatedTransition';
import Header from '@/components/Header';
import DashboardStats from '@/components/user/dashboard/DashboardStats';
import StatsTab from '@/components/user/dashboard/StatsTab';
import ReferralsTab from '@/components/user/dashboard/ReferralsTab';
import ReferralLinksTab from '@/components/user/dashboard/ReferralLinksTab';
import SharesTab from '@/components/user/dashboard/SharesTab';
import GlobalCTA from '@/components/GlobalCTA';
import WelcomeBanner from '@/components/welcome/WelcomeBanner';
import EmptyState from '@/components/empty-states/EmptyState';
import { MessageSquare, BookOpen, Share2 } from 'lucide-react';
import { ReferralPlatform } from '@/context/ReferralContext';
import { useAuth } from '@/context/AuthContext';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [isNewUser, setIsNewUser] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Check if the user is new based on registration date or activity
    // This would typically come from user data
    const userJoinDate = user?.createdAt ? new Date(user.createdAt) : user?.joinDate ? new Date(user.joinDate) : null;
    const isRecent = userJoinDate ? 
      (Date.now() - userJoinDate.getTime()) < (7 * 24 * 60 * 60 * 1000) : false;
    
    setIsNewUser(isRecent);
  }, [user]);

  // Mock Data
  const aggregatedStats = {
    clicks: 4567,
    signups: 789,
    sharedContent: 123,
  };

  const reachStats = {
    totalVisitors: 12345,
    countries: 45,
    platforms: 12,
  };

  // Mock platform stats data for StatsTab
  const platformStats = [
    { platform: 'insiderlife' as ReferralPlatform, clicks: 2500, signups: 400, sharedContent: 60 },
    { platform: 'insiderdao' as ReferralPlatform, clicks: 1200, signups: 220, sharedContent: 35 },
    { platform: 'societi' as ReferralPlatform, clicks: 600, signups: 100, sharedContent: 18 },
    { platform: 'aifc' as ReferralPlatform, clicks: 267, signups: 69, sharedContent: 10 }
  ];

  const referrals = [
    { id: "1", name: "Alice Smith", signupDate: "2024-01-15", source: "insiderlife" },
    { id: "2", name: "Bob Johnson", signupDate: "2024-02-01", source: "insiderdao" },
    { id: "3", name: "Charlie Brown", signupDate: "2024-02-10", source: "societi" },
  ];

  // Convert the object format to array format for ReferralLinksTab
  const referralLinks = [
    { platform: 'insiderlife' as ReferralPlatform, url: "insiderlife.com/?ref=your-username", isSet: true },
    { platform: 'insiderdao' as ReferralPlatform, url: "insiderdao.com/?ref=your-username", isSet: true },
    { platform: 'societi' as ReferralPlatform, url: "societi.com/?ref=your-username", isSet: true },
    { platform: 'aifc' as ReferralPlatform, url: "aifc.com/?ref=your-username", isSet: true }
  ];

  // Mock updateReferralLink function
  const updateReferralLink = (platform: ReferralPlatform, url: string) => {
    console.log(`Updating ${platform} referral link to ${url}`);
    // In a real app, this would update the state or call an API
  };

  // Convert the format to match what SharesTab expects
  const shares = [
    { id: "1", title: "The Future of AI", date: "March 15, 2024", clicks: 120, signups: 14 },
    { id: "2", title: "Blockchain Explained", date: "March 2, 2024", clicks: 90, signups: 8 },
    { id: "3", title: "Web3 Development", date: "February 20, 2024", clicks: 110, signups: 12 }
  ];

  const hasNoActivity = shares.length === 0 && referrals.length === 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <AnimatedTransition>
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
              Dashboard
            </h1>

            {isNewUser && <WelcomeBanner />}

            {hasNoActivity ? (
              <div className="space-y-8">
                <EmptyState
                  title="Welcome to your Signal Hub!"
                  description="Start by exploring content, participating in SignalBoard discussions, or checking out our Education Hub."
                  icon={<Share2 className="h-8 w-8" />}
                  actionLabel="Explore Content"
                  actionHref="/content"
                />
                <DashboardStats 
                  aggregatedStats={aggregatedStats}
                  reachStats={reachStats}
                />
              </div>
            ) : (
              <>
                <DashboardStats 
                  aggregatedStats={aggregatedStats}
                  reachStats={reachStats}
                />

                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
                  <TabsList className="w-full md:w-auto grid grid-cols-2 md:flex md:flex-row">
                    <TabsTrigger value="stats">Stats</TabsTrigger>
                    <TabsTrigger value="referrals">Referrals</TabsTrigger>
                    <TabsTrigger value="links">Referral Links</TabsTrigger>
                    <TabsTrigger value="shares">Shares</TabsTrigger>
                  </TabsList>
                  <TabsContent value="stats" className="mt-6">
                    <StatsTab 
                      platformStats={platformStats}
                      reachStats={reachStats}
                    />
                  </TabsContent>
                  <TabsContent value="referrals" className="mt-6">
                    {referrals.length > 0 ? (
                      <ReferralsTab referrals={referrals} />
                    ) : (
                      <EmptyState
                        title="No Referrals Yet"
                        description="Share your referral links with your network to start earning rewards."
                        icon={<Share2 className="h-8 w-8" />}
                        actionLabel="View Referral Links"
                        onAction={() => setActiveTab('links')}
                      />
                    )}
                  </TabsContent>
                  <TabsContent value="links" className="mt-6">
                    <ReferralLinksTab
                      referralLinks={referralLinks}
                      updateReferralLink={updateReferralLink}
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
                      />
                    )}
                  </TabsContent>
                </Tabs>
              </>
            )}

            <div className="mt-12">
              <GlobalCTA
                id="dashboard-cta"
                title="Unlock Pro Features"
                description="Upgrade to Pro to access advanced analytics and more."
                buttonText="Upgrade Now"
                buttonUrl="/pricing"
                type="card"
                brand="insiderlife"
                theme="primary"
              />
            </div>
          </div>
        </AnimatedTransition>
      </main>
    </div>
  );
};

export default UserDashboard;
