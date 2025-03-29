
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReferralPlatform } from "@/context/ReferralContext";

interface PlatformStat {
  platform: ReferralPlatform;
  clicks: number;
  signups: number;
  sharedContent: number;
}

interface CTAStat {
  id: string;
  name: string;
  platform: ReferralPlatform;
  clicks: number;
  signups: number;
  conversionRate: number;
}

interface ReachStats {
  totalVisitors: number;
  countries: number;
  platforms: number;
}

interface StatsTabProps {
  platformStats: PlatformStat[];
  reachStats: ReachStats;
  ctaStats?: CTAStat[];
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

// Mock CTA data for preview purposes
const mockCTAStats: CTAStat[] = [
  { 
    id: '1', 
    name: 'Join InsiderDAO', 
    platform: 'insiderdao', 
    clicks: 78, 
    signups: 12, 
    conversionRate: 15.4 
  },
  { 
    id: '2', 
    name: 'Try Societi Free', 
    platform: 'societi', 
    clicks: 45, 
    signups: 8, 
    conversionRate: 17.8 
  },
  { 
    id: '3', 
    name: 'Learn AI Development', 
    platform: 'aifc', 
    clicks: 32, 
    signups: 4, 
    conversionRate: 12.5 
  },
];

const StatsTab = ({ platformStats, reachStats, ctaStats = mockCTAStats }: StatsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Impact Dashboard</CardTitle>
        <CardDescription>
          Track your influence across all platforms in the ecosystem
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="platforms" className="space-y-6">
          <TabsList>
            <TabsTrigger value="platforms">By Platform</TabsTrigger>
            <TabsTrigger value="ctas">By CTA</TabsTrigger>
          </TabsList>
          
          <TabsContent value="platforms" className="space-y-6">
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
          </TabsContent>
          
          <TabsContent value="ctas" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">CTA Performance</h3>
              <div className="overflow-hidden border rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left py-3 px-4 text-sm font-medium">CTA</th>
                      <th className="text-left py-3 px-4 text-sm font-medium">Platform</th>
                      <th className="text-right py-3 px-4 text-sm font-medium">Clicks</th>
                      <th className="text-right py-3 px-4 text-sm font-medium">Signups</th>
                      <th className="text-right py-3 px-4 text-sm font-medium">Conv. Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ctaStats.map((stat, index) => (
                      <tr key={stat.id} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                        <td className="py-3 px-4 text-sm font-medium">{stat.name}</td>
                        <td className="py-3 px-4 text-sm">{getPlatformDisplayName(stat.platform)}</td>
                        <td className="py-3 px-4 text-sm text-right">{stat.clicks}</td>
                        <td className="py-3 px-4 text-sm text-right">{stat.signups}</td>
                        <td className="py-3 px-4 text-sm text-right font-medium">{stat.conversionRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Conversion rate shows the percentage of clicks that resulted in signups. Higher is better!</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">CTA Comparison</h3>
              <div className="bg-muted/20 rounded-lg p-6">
                <div className="space-y-4">
                  {ctaStats.map(stat => (
                    <div key={stat.id} className="relative pt-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-sm font-medium">{stat.name}</span>
                          <span className="ml-2 text-xs text-muted-foreground">({getPlatformDisplayName(stat.platform)})</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium">{stat.conversionRate}%</span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                        <div
                          style={{ width: `${Math.min(100, stat.conversionRate * 5)}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StatsTab;
