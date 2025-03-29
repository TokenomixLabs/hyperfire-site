
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ReferralPlatform } from "@/context/ReferralContext";

interface PlatformStat {
  platform: ReferralPlatform;
  clicks: number;
  signups: number;
  sharedContent: number;
}

interface ReachStats {
  totalVisitors: number;
  countries: number;
  platforms: number;
}

interface StatsTabProps {
  platformStats: PlatformStat[];
  reachStats: ReachStats;
}

// Helper to get platform display name
const getPlatformDisplayName = (platform: ReferralPlatform): string => {
  switch (platform) {
    case 'insiderlife': return 'InsiderLife';
    case 'insiderdao': return 'InsiderDAO';
    case 'societi': return 'Societi';
    case 'aifc': return 'AI Freedom Code';
    default: return platform;
  }
};

const StatsTab = ({ platformStats, reachStats }: StatsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Impact Dashboard</CardTitle>
        <CardDescription>
          Track your influence across all platforms in the ecosystem
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Performance by Platform</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {platformStats.map(stat => (
                <Card key={stat.platform} className="border border-gray-200 dark:border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {getPlatformDisplayName(stat.platform)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Clicks</p>
                        <p className="text-lg font-medium">{stat.clicks}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Signups</p>
                        <p className="text-lg font-medium">{stat.signups}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Shares</p>
                        <p className="text-lg font-medium">{stat.sharedContent}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Global Reach</h3>
            <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 border-0">
              <CardContent className="p-6">
                <p className="text-center text-lg mb-2">
                  Your signal has reached <span className="font-bold">{reachStats.totalVisitors} people</span> in <span className="font-bold">{reachStats.countries} countries</span>
                </p>
                <p className="text-center text-sm text-muted-foreground">
                  Across {reachStats.platforms} platforms in the ecosystem
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsTab;
