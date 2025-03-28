
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight, Copy, BarChart2, Share2, Users, Link, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data - in a real app this would come from an authenticated user
const mockUserData = {
  id: "1",
  name: "Sarah Johnson",
  email: "sarah@insiderlife.com",
  referralLink: "insiderlife.com/?ref=sarahj",
  daoReferralLink: "insiderdao.com/?ref=sarahj",
  referralStats: {
    clicks: 156,
    signups: 24,
    sharedContent: 8
  },
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
  ]
};

const UserDashboard = () => {
  const [daoReferralLink, setDaoReferralLink] = useState(mockUserData.daoReferralLink);
  const { toast } = useToast();

  const handleCopyLink = (link: string, type: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied",
      description: `${type} referral link copied to clipboard`,
    });
  };

  const handleUpdateDaoLink = () => {
    // In a real app this would update the database
    toast({
      title: "DAO Referral Link Updated",
      description: "Your InsiderDAO referral link has been updated",
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Referral Dashboard</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Track your referrals and boost your impact as a signal amplifier
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Link className="mr-2 h-4 w-4 text-blue-500" />
              Total Link Clicks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUserData.referralStats.clicks}</div>
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
            <div className="text-2xl font-bold">{mockUserData.referralStats.signups}</div>
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
            <div className="text-2xl font-bold">{mockUserData.referralStats.sharedContent}</div>
            <p className="text-xs text-muted-foreground mt-1">Pieces of content you've shared</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="links" className="mt-8">
        <TabsList className="glass-card">
          <TabsTrigger value="links">My Referral Links</TabsTrigger>
          <TabsTrigger value="shares">Content Shares</TabsTrigger>
          <TabsTrigger value="referrals">Top Referrals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="links" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Referral Links</CardTitle>
              <CardDescription>
                Share these links to track your impact and get credit for referrals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="insider-link">InsiderLife Referral Link</Label>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Input 
                      id="insider-link"
                      value={mockUserData.referralLink} 
                      readOnly 
                      className="font-mono text-sm"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleCopyLink(mockUserData.referralLink, "InsiderLife")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Use this link to refer people to InsiderLife
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="dao-link">InsiderDAO Referral Link</Label>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Input 
                      id="dao-link"
                      value={daoReferralLink} 
                      onChange={(e) => setDaoReferralLink(e.target.value)}
                      className="font-mono text-sm"
                      placeholder="Enter InsiderDAO referral link"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCopyLink(daoReferralLink, "InsiderDAO")}
                      disabled={!daoReferralLink}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Add your InsiderDAO referral link to get credit for DAO signups
                  </p>
                  {mockUserData.daoReferralLink !== daoReferralLink && (
                    <Button 
                      size="sm" 
                      className="mt-2"
                      onClick={handleUpdateDaoLink}
                    >
                      Update DAO Link
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-4">
                <h3 className="font-medium text-blue-700 dark:text-blue-400 flex items-center">
                  <BarChart2 className="h-5 w-5 mr-2" />
                  Referral Tip
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                  When you share content from the library, your referral code is automatically added to the link. 
                  You can also share your main referral link directly.
                </p>
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
