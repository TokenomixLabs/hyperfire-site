
import { Link, UserCheck, Share2, Globe } from "lucide-react";
import StatCard from "./StatCard";

interface DashboardStatsProps {
  aggregatedStats: {
    clicks: number;
    signups: number;
    sharedContent: number;
  };
  reachStats: {
    totalVisitors: number;
    countries: number;
    platforms: number;
  };
}

const DashboardStats = ({ aggregatedStats, reachStats }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Total Link Clicks"
        value={aggregatedStats.clicks}
        description="From all your shared content"
        icon={Link}
        iconColor="text-blue-500"
      />
      
      <StatCard 
        title="Total Signups"
        value={aggregatedStats.signups}
        description="People who signed up from your links"
        icon={UserCheck}
        iconColor="text-green-500"
      />
      
      <StatCard 
        title="Content Shared"
        value={aggregatedStats.sharedContent}
        description="Pieces of content you've shared"
        icon={Share2}
        iconColor="text-purple-500"
      />
      
      <StatCard 
        title="Global Reach"
        value={`${reachStats.countries} countries`}
        description={`Your signal has reached ${reachStats.totalVisitors} people`}
        icon={Globe}
        iconColor="text-indigo-500"
      />
    </div>
  );
};

export default DashboardStats;
