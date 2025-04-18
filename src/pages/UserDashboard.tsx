
import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TooltipProvider } from '@/components/ui/tooltip';
import AnimatedTransition from '@/components/AnimatedTransition';
import Header from '@/components/Header';
import DashboardStats from '@/components/user/dashboard/DashboardStats';
import EmptyState from '@/components/empty-states/EmptyState';
import { Share2, BarChart2, Link, Users, Zap, DollarSign, RefreshCw } from 'lucide-react';
import { ReferralPlatform } from '@/context/ReferralContext';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import DashboardActivityWidget from '@/components/activity/DashboardActivityWidget';
import GlobalCTA from '@/components/GlobalCTA';
import WelcomeBanner from '@/components/welcome/WelcomeBanner';
import DashboardTabs from '@/components/user/dashboard/DashboardTabs';
import { useReferralLinks } from '@/hooks/useReferralLinks';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [isNewUser, setIsNewUser] = useState(false);
  const [showActivityFeed, setShowActivityFeed] = useState(true);
  const { user } = useAuth();
  const { referralLinks, handleCopyLink, updateReferralLink } = useReferralLinks();

  useEffect(() => {
    const userJoinDate = user?.createdAt ? new Date(user.createdAt) : user?.joinDate ? new Date(user.joinDate) : null;
    const isRecent = userJoinDate ? 
      (Date.now() - userJoinDate.getTime()) < (7 * 24 * 60 * 60 * 1000) : false;
    
    setIsNewUser(isRecent);
  }, [user]);

  // Mock data - would come from API in a real app
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Dashboard
              </h1>
              
              {user?.isTopReferrer && (
                <Badge variant="outline" className="ml-0 mt-2 sm:mt-0 sm:ml-4 bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 border-amber-300">
                  <RefreshCw className="h-3 w-3 mr-1 text-amber-700" /> Top Referrer
                </Badge>
              )}
            </div>

            {isNewUser && <WelcomeBanner />}

            {hasNoActivity ? (
              <div className="space-y-8">
                <EmptyState
                  title="Welcome to your Signal Hub!"
                  description="Start by exploring content, participating in SignalBoard discussions, or checking out our Education Hub."
                  icon={<Share2 className="h-8 w-8" />}
                  actionLabel="Explore Content"
                  actionHref="/content"
                  size="lg"
                />
                <DashboardStats 
                  aggregatedStats={aggregatedStats}
                  reachStats={reachStats}
                />
                
                {showActivityFeed && (
                  <DashboardActivityWidget 
                    className="mt-8" 
                    onHide={() => setShowActivityFeed(false)}
                  />
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <DashboardStats 
                      aggregatedStats={aggregatedStats}
                      reachStats={reachStats}
                    />
                  </div>
                  
                  {showActivityFeed && (
                    <div className="lg:col-span-1">
                      <DashboardActivityWidget 
                        onHide={() => setShowActivityFeed(false)}
                      />
                    </div>
                  )}
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
                  <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 md:flex md:flex-row bg-gray-100 dark:bg-gray-800/50 p-1 rounded-lg">
                    <TabsTrigger value="stats" className="flex items-center gap-1.5">
                      <BarChart2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Stats</span>
                    </TabsTrigger>
                    <TabsTrigger value="referrals" className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      <span className="hidden sm:inline">Referrals</span>
                    </TabsTrigger>
                    <TabsTrigger value="links" className="flex items-center gap-1.5">
                      <Link className="h-4 w-4" />
                      <span className="hidden sm:inline">Referral Links</span>
                    </TabsTrigger>
                    <TabsTrigger value="shares" className="flex items-center gap-1.5">
                      <Share2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Shares</span>
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="flex items-center gap-1.5">
                      <Zap className="h-4 w-4" />
                      <span className="hidden sm:inline">Activity</span>
                    </TabsTrigger>
                    <TabsTrigger value="affiliate" className="flex items-center gap-1.5">
                      <DollarSign className="h-4 w-4" />
                      <span className="hidden sm:inline">Affiliate</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TooltipProvider>
                    <DashboardTabs
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      platformStats={platformStats}
                      reachStats={reachStats}
                      referrals={referrals}
                      shares={shares}
                      referralLinks={referralLinks}
                      updateReferralLink={updateReferralLink}
                      handleCopyLink={handleCopyLink}
                    />
                  </TooltipProvider>
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
