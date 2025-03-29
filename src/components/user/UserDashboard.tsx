
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ChevronRight, 
  Copy, 
  BarChart2, 
  Share2, 
  Users, 
  Link, 
  UserCheck, 
  Globe, 
  AlertCircle, 
  CheckCircle2, 
  Info 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useReferral, ReferralPlatform } from "@/context/ReferralContext";

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

// Helper to get platform help URL
const getPlatformHelpUrl = (platform: ReferralPlatform): string => {
  switch (platform) {
    case 'insiderdao': return 'https://insiderdao.com/referrals';
    case 'societi': return 'https://societi.com/get-referral-link';
    case 'aifc': return 'https://aifc.com/referral-program';
    default: return '#';
  }
};

const UserDashboard = () => {
  const { 
    referralLinks, 
    updateReferralLink, 
    aggregatedStats, 
    platformStats 
  } = useReferral();
  
  const [referralInputs, setReferralInputs] = useState<Record<ReferralPlatform, string>>(
    referralLinks.reduce((acc, link) => ({
      ...acc,
      [link.platform]: link.url
    }), {} as Record<ReferralPlatform, string>)
  );
  
  const { toast } = useToast();

  const handleCopyLink = (link: string, type: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied",
      description: `${type} referral link copied to clipboard`,
    });
  };

  const handleUpdateReferralLink = (platform: ReferralPlatform) => {
    const url = referralInputs[platform];
    updateReferralLink(platform, url);
    
    toast({
      title: `${getPlatformDisplayName(platform)} Link Updated`,
      description: `Your ${getPlatformDisplayName(platform)} referral link has been saved`,
    });
  };
  
  const handleInputChange = (platform: ReferralPlatform, value: string) => {
    setReferralInputs(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Signal Hub</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Track your impact and amplify your signal across multiple platforms
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Link className="mr-2 h-4 w-4 text-blue-500" />
              Total Link Clicks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aggregatedStats.clicks}</div>
            <p className="text-xs text-muted-foreground mt-1">From all your shared content</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <UserCheck className="mr-2 h-4 w-4 text-green-500" />
              Total Signups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aggregatedStats.signups}</div>
            <p className="text-xs text-muted-foreground mt-1">People who signed up from your links</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Share2 className="mr-2 h-4 w-4 text-purple-500" />
              Content Shared
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aggregatedStats.sharedContent}</div>
            <p className="text-xs text-muted-foreground mt-1">Pieces of content you've shared</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Globe className="mr-2 h-4 w-4 text-indigo-500" />
              Global Reach
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUserData.reachStats.countries} countries</div>
            <p className="text-xs text-muted-foreground mt-1">
              Your signal has reached {mockUserData.reachStats.totalVisitors} people
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="links" className="mt-8">
        <TabsList className="glass-card">
          <TabsTrigger value="links">My Referral Links</TabsTrigger>
          <TabsTrigger value="stats">Impact Dashboard</TabsTrigger>
          <TabsTrigger value="shares">Content Shares</TabsTrigger>
          <TabsTrigger value="referrals">Top Referrals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="links" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Activate Your Signal Engine</CardTitle>
              <CardDescription>
                Set up your referral links across all platforms to maximize your impact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {referralLinks.map(link => (
                <div key={link.platform} className="space-y-3 pb-5 border-b last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <h3 className="font-medium">{getPlatformDisplayName(link.platform)} Referral Link</h3>
                      {link.isSet ? (
                        <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-500">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Saved
                        </span>
                      ) : (
                        <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
                          <AlertCircle className="mr-1 h-3 w-3" />
                          Not Set
                        </span>
                      )}
                    </div>
                    
                    {link.platform !== 'insiderlife' && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a 
                              href={getPlatformHelpUrl(link.platform)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                            >
                              <Info className="h-4 w-4 mr-1" />
                              How to get it
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Learn how to get your {getPlatformDisplayName(link.platform)} referral link</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1.5">
                    <Input 
                      id={`${link.platform}-link`}
                      value={referralInputs[link.platform] || ''}
                      onChange={(e) => handleInputChange(link.platform, e.target.value)}
                      className="font-mono text-sm"
                      placeholder={`Enter ${getPlatformDisplayName(link.platform)} referral link`}
                      readOnly={link.platform === 'insiderlife'} // InsiderLife link is auto-generated
                    />
                    
                    <div className="flex space-x-2">
                      {link.isSet && (
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleCopyLink(link.url, getPlatformDisplayName(link.platform))}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {link.platform !== 'insiderlife' && (
                        referralInputs[link.platform] !== link.url ? (
                          <Button 
                            size="sm" 
                            onClick={() => handleUpdateReferralLink(link.platform)}
                          >
                            Save
                          </Button>
                        ) : null
                      )}
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {link.platform === 'insiderlife' 
                      ? 'Your InsiderLife link is automatically generated and added to all content you share.'
                      : `Use this link to track your ${getPlatformDisplayName(link.platform)} referrals.`}
                  </p>
                </div>
              ))}
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-6">
                <h3 className="font-medium text-blue-700 dark:text-blue-400 flex items-center">
                  <BarChart2 className="h-5 w-5 mr-2" />
                  Signal Amplification Guide
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                  Your links are automatically added when you share content. Every visitor is tracked for 90 days, 
                  and you get credit if they sign up later on any of our platforms.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats" className="mt-4">
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
                        Your signal has reached <span className="font-bold">{mockUserData.reachStats.totalVisitors} people</span> in <span className="font-bold">{mockUserData.reachStats.countries} countries</span>
                      </p>
                      <p className="text-center text-sm text-muted-foreground">
                        Across {mockUserData.reachStats.platforms} platforms in the ecosystem
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="shares" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Content Shares</CardTitle>
              <CardDescription>
                Track the performance of content you've shared
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Content Title</TableHead>
                    <TableHead>Date Shared</TableHead>
                    <TableHead>Total Clicks</TableHead>
                    <TableHead>Signups</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUserData.recentShares.map(share => (
                    <TableRow key={share.id}>
                      <TableCell className="font-medium">{share.title}</TableCell>
                      <TableCell>{share.date}</TableCell>
                      <TableCell>{share.clicks}</TableCell>
                      <TableCell>{share.signups}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Again
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="referrals" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Referrals</CardTitle>
              <CardDescription>
                People who signed up through your referral links
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Signup Date</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUserData.topReferrals.map(referral => (
                    <TableRow key={referral.id}>
                      <TableCell className="font-medium">{referral.name}</TableCell>
                      <TableCell>{referral.signupDate}</TableCell>
                      <TableCell className="capitalize">{referral.source}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
