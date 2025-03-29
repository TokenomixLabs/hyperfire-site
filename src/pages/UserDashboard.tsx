import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnimatedTransition from '@/components/AnimatedTransition';
import Header from '@/components/Header';
import DashboardStats from '@/components/user/dashboard/DashboardStats';
import StatsTab from '@/components/user/dashboard/StatsTab';
import ReferralsTab from '@/components/user/dashboard/ReferralsTab';
import ReferralLinksTab from '@/components/user/dashboard/ReferralLinksTab';
import SharesTab from '@/components/user/dashboard/SharesTab';
import GlobalCTA from '@/components/GlobalCTA';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');

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

  const statsData = [
    { name: "Total Views", value: 12345 },
    { name: "Unique Visitors", value: 6789 },
    { name: "Avg. Session Duration", value: "3m 24s" },
    { name: "Bounce Rate", value: "45%" },
  ];

  const referrals = [
    { id: "1", name: "Alice Smith", signupDate: "2024-01-15", source: "insiderlife" },
    { id: "2", name: "Bob Johnson", signupDate: "2024-02-01", source: "insiderdao" },
    { id: "3", name: "Charlie Brown", signupDate: "2024-02-10", source: "societi" },
  ];

  const referralLinks = {
    insiderlife: "insiderlife.com/?ref=your-username",
    insiderdao: "insiderdao.com/?ref=your-username",
    societi: "societi.com/?ref=your-username",
    aifc: "aifc.com/?ref=your-username",
  };

  const sharesData = [
    { id: "1", contentTitle: "The Future of AI", platform: "Twitter", shares: 50, clicks: 120 },
    { id: "2", contentTitle: "Blockchain Explained", platform: "LinkedIn", shares: 30, clicks: 90 },
    { id: "3", contentTitle: "Web3 Development", platform: "Facebook", shares: 40, clicks: 110 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <AnimatedTransition>
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
              Dashboard
            </h1>

            <DashboardStats 
              aggregatedStats={aggregatedStats}
              reachStats={reachStats}
            />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
              <TabsList>
                <TabsTrigger value="stats">Stats</TabsTrigger>
                <TabsTrigger value="referrals">Referrals</TabsTrigger>
                <TabsTrigger value="links">Referral Links</TabsTrigger>
                <TabsTrigger value="shares">Shares</TabsTrigger>
              </TabsList>
              <TabsContent value="stats" className="mt-6">
                <StatsTab statsData={statsData} />
              </TabsContent>
              <TabsContent value="referrals" className="mt-6">
                <ReferralsTab referrals={referrals} />
              </TabsContent>
              <TabsContent value="links" className="mt-6">
                <ReferralLinksTab referralLinks={referralLinks} />
              </TabsContent>
              <TabsContent value="shares" className="mt-6">
                <SharesTab sharesData={sharesData} />
              </TabsContent>
            </Tabs>

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
