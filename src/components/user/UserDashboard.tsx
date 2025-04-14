
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReferral } from "@/context/ReferralContext";
import DashboardStats from "./dashboard/DashboardStats";
import ReferralLinksTab from "./dashboard/ReferralLinksTab";
import StatsTab from "./dashboard/StatsTab";
import SharesTab from "./dashboard/SharesTab";
import ReferralsTab from "./dashboard/ReferralsTab";

// Mock data - in a real app this would come from an authenticated user
const mockUserData = {
  id: "1",
  name: "Sarah Johnson",
  email: "sarah@insiderlife.com",
  recentShares: [
    {
      id: "1",
      title: "Crypto Market Analysis - August Edition",
      date: "Aug 15, 2023",
      clicks: 42,
      signups: 5
    },
    {
      id: "2",
      title: "Tokenomics Fundamentals Guide",
      date: "July 28, 2023",
      clicks: 35,
      signups: 3
    },
    {
      id: "3",
      title: "InsiderDAO Governance Framework",
      date: "Aug 10, 2023",
      clicks: 28,
      signups: 4
    }
  ],
  topReferrals: [
    {
      id: "1",
      name: "Mark Wilson",
      signupDate: "Aug 12, 2023",
      source: "twitter"
    },
    {
      id: "2",
      name: "Jessica Chen",
      signupDate: "Aug 10, 2023",
      source: "direct link"
    },
    {
      id: "3",
      name: "Thomas Rodriguez",
      signupDate: "Aug 8, 2023",
      source: "facebook"
    }
  ],
  reachStats: {
    totalVisitors: 254,
    countries: 6,
    platforms: 3
  }
};

const UserDashboard = () => {
  const { 
    referralLinks, 
    updateReferralLink, 
    aggregatedStats, 
    platformStats 
  } = useReferral();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Signal Hub</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Track your impact and amplify your signal across multiple platforms
      </p>
      
      <DashboardStats 
        aggregatedStats={aggregatedStats}
        reachStats={mockUserData.reachStats}
      />
      
      <Tabs defaultValue="links" className="mt-8">
        <TabsList className="glass-card">
          <TabsTrigger value="links">My Referral Links</TabsTrigger>
          <TabsTrigger value="stats">Impact Dashboard</TabsTrigger>
          <TabsTrigger value="shares">Content Shares</TabsTrigger>
          <TabsTrigger value="referrals">Top Referrals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="links" className="space-y-4 mt-4">
          <ReferralLinksTab 
            referralLinks={referralLinks}
            updateReferralLink={updateReferralLink}
          />
        </TabsContent>
        
        <TabsContent value="stats" className="mt-4">
          <StatsTab 
            platformStats={platformStats}
            reachStats={mockUserData.reachStats}
          />
        </TabsContent>
        
        <TabsContent value="shares" className="mt-4">
          <SharesTab shares={mockUserData.recentShares} />
        </TabsContent>
        
        <TabsContent value="referrals" className="mt-4">
          <ReferralsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
