
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { 
  BarChart3, 
  Copy, 
  Eye, 
  Share2, 
  Trash2, 
  MessageSquareShare,
  Link2,
  BarChart2,
  Search
} from 'lucide-react';
import AnimatedTransition from "@/components/AnimatedTransition";
import { useToast } from "@/components/ui/use-toast";
import { DuplicatedSignalWithStats } from '@/types/signalLibrary';
import { useReferral } from '@/context/ReferralContext';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock data for demonstration purposes
const mockDuplicatedSignals: DuplicatedSignalWithStats[] = [
  {
    id: "duplicate-1",
    originalSeriesId: "signal-1",
    userId: "user123",
    name: "AI Freedom Roadmap",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    uniqueUrl: "ai-freedom-roadmap?ref=user123",
    stats: {
      views: 76,
      shares: 12,
      referrals: 5,
      ctaClicks: 18
    }
  },
  {
    id: "duplicate-2",
    originalSeriesId: "signal-3",
    userId: "user123",
    name: "Digital Sovereignty Guide",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    customIntro: "I've been using these techniques for the past year and they've completely transformed my digital life. Here's how you can do it too!",
    uniqueUrl: "digital-sovereignty-guide?ref=user123",
    stats: {
      views: 42,
      shares: 8,
      referrals: 3,
      ctaClicks: 11
    }
  }
];

const MySignalDuplicates: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { generateReferralLink } = useReferral();
  
  const [duplicatedSignals, setDuplicatedSignals] = useState<DuplicatedSignalWithStats[]>(mockDuplicatedSignals);
  const [searchTerm, setSearchTerm] = useState('');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null);
  
  const filteredSignals = duplicatedSignals.filter(signal =>
    signal.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Stats calculations
  const totalViews = duplicatedSignals.reduce((sum, signal) => sum + signal.stats.views, 0);
  const totalReferrals = duplicatedSignals.reduce((sum, signal) => sum + signal.stats.referrals, 0);
  const totalShares = duplicatedSignals.reduce((sum, signal) => sum + signal.stats.shares, 0);
  const totalClicks = duplicatedSignals.reduce((sum, signal) => sum + signal.stats.ctaClicks, 0);
  
  const handleView = (uniqueUrl: string) => {
    // In a real app, this would navigate to the actual URL
    navigate(`/signal/${uniqueUrl}`);
  };
  
  const handleShare = (uniqueUrl: string) => {
    const fullUrl = `${window.location.origin}/signal/${uniqueUrl}`;
    setShareUrl(fullUrl);
    setShareDialogOpen(true);
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Link Copied!",
        description: "Share link has been copied to clipboard",
      });
    });
  };
  
  const handleDeleteConfirm = () => {
    if (selectedSignalId) {
      setDuplicatedSignals(duplicatedSignals.filter(s => s.id !== selectedSignalId));
      setDeleteDialogOpen(false);
      setSelectedSignalId(null);
      
      toast({
        title: "Signal Removed",
        description: "The duplicated signal has been removed from your account",
      });
    }
  };
  
  const openDeleteDialog = (id: string) => {
    setSelectedSignalId(id);
    setDeleteDialogOpen(true);
  };

  return (
    <AnimatedTransition className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold">My Signal Funnels</h1>
          <p className="text-muted-foreground mt-2">
            Manage your duplicated signal series and track their performance
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Referrals Generated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReferrals.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Shares</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalShares.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">CTA Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="signals" className="w-full">
          <TabsList>
            <TabsTrigger value="signals">My Signals</TabsTrigger>
            <TabsTrigger value="stats">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signals">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Duplicated Signals</h2>
                <div className="w-1/3">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="search"
                      placeholder="Search your signals..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {filteredSignals.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No Duplicated Signals Found</h3>
                  {searchTerm ? (
                    <p className="text-muted-foreground mb-4">Try a different search term</p>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-muted-foreground mb-4">
                        You haven't duplicated any Signals yet
                      </p>
                      <Button onClick={() => navigate('/signal-library')}>
                        Browse Signal Library
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSignals.map((signal) => (
                    <Card key={signal.id}>
                      <div className="flex flex-col md:flex-row">
                        <CardHeader className="md:flex-1">
                          <div className="flex justify-between">
                            <CardTitle>{signal.name}</CardTitle>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openDeleteDialog(signal.id)}
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                            </Button>
                          </div>
                          
                          {signal.customIntro && (
                            <div className="mt-2">
                              <Badge variant="outline" className="mr-2">Custom Intro</Badge>
                              <CardDescription className="mt-1">
                                "{signal.customIntro.substring(0, 100)}..."
                              </CardDescription>
                            </div>
                          )}
                          
                          <div className="mt-4 text-sm">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                              <div className="flex items-center">
                                <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{signal.stats.views} views</span>
                              </div>
                              <div className="flex items-center">
                                <Share2 className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{signal.stats.shares} shares</span>
                              </div>
                              <div className="flex items-center">
                                <Copy className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{signal.stats.referrals} referrals</span>
                              </div>
                              <div className="flex items-center">
                                <MessageSquareShare className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{signal.stats.ctaClicks} CTA clicks</span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <Separator orientation="vertical" className="hidden md:block" />
                        
                        <CardFooter className="flex md:flex-col justify-end space-y-2 p-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleView(signal.uniqueUrl)}
                          >
                            <Eye className="mr-2 h-4 w-4" /> View Signal
                          </Button>
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleShare(signal.uniqueUrl)}
                          >
                            <Share2 className="mr-2 h-4 w-4" /> Share
                          </Button>
                        </CardFooter>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
              
              <div className="mt-8">
                <Alert>
                  <BarChart3 className="h-4 w-4" />
                  <AlertTitle>Want more conversions?</AlertTitle>
                  <AlertDescription>
                    Customize your signal with a personal intro and share it on your favorite platforms to maximize engagement.
                  </AlertDescription>
                </Alert>
              </div>
              
              <div className="mt-4 flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/signal-library')}
                  className="w-full md:w-auto"
                >
                  <Copy className="mr-2 h-4 w-4" /> Duplicate More Signals
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Signal Performance Analytics</CardTitle>
                <CardDescription>
                  Track how your duplicated signals are performing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Performance Overview</h3>
                    <div className="aspect-[2/1] bg-muted rounded-md flex items-center justify-center p-8">
                      <div className="text-center space-y-2">
                        <BarChart2 className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Detailed analytics charts would appear here
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Signal Comparison</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-4">Signal Name</th>
                            <th className="text-center py-2 px-4">Views</th>
                            <th className="text-center py-2 px-4">Shares</th>
                            <th className="text-center py-2 px-4">Referrals</th>
                            <th className="text-center py-2 px-4">CTA Clicks</th>
                            <th className="text-center py-2 px-4">Conversion %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {duplicatedSignals.map((signal) => {
                            const conversionRate = signal.stats.views > 0 
                              ? ((signal.stats.referrals / signal.stats.views) * 100).toFixed(1) 
                              : '0.0';
                              
                            return (
                              <tr key={signal.id} className="border-b hover:bg-muted/50">
                                <td className="py-2 px-4">{signal.name}</td>
                                <td className="text-center py-2 px-4">{signal.stats.views}</td>
                                <td className="text-center py-2 px-4">{signal.stats.shares}</td>
                                <td className="text-center py-2 px-4">{signal.stats.referrals}</td>
                                <td className="text-center py-2 px-4">{signal.stats.ctaClicks}</td>
                                <td className="text-center py-2 px-4">{conversionRate}%</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your Signal</DialogTitle>
            <DialogDescription>
              Share your personalized signal link with your audience
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">Link</Label>
                <Input
                  id="link"
                  defaultValue={shareUrl}
                  readOnly
                  className="w-full"
                />
              </div>
              <Button onClick={handleCopyLink} className="flex-shrink-0">
                <Link2 className="h-4 w-4 mr-1" /> Copy
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Share on platforms</h4>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">Twitter</Button>
                <Button variant="outline" size="sm">Facebook</Button>
                <Button variant="outline" size="sm">LinkedIn</Button>
                <Button variant="outline" size="sm">Email</Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShareDialogOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Duplicated Signal</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this signal from your account?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              This will remove the signal from your dashboard. The original signal in the library will remain unaffected. This action cannot be undone.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Remove Signal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AnimatedTransition>
  );
};

export default MySignalDuplicates;
