
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Copy, Edit, Eye, ExternalLink, FileText, Play, Share2, Trash2, Video } from 'lucide-react';
import Header from "@/components/Header";
import AnimatedTransition from "@/components/AnimatedTransition";
import { DuplicatedSignal, SignalSeries, SignalSeriesWithStats } from '@/types/signal';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Mock data for duplicated signals
const mockDuplicatedSignals: DuplicatedSignal[] = [
  {
    id: "dup-1",
    originalId: "signal-1",
    userId: "user-123",
    name: "AI Freedom Roadmap (My Version)",
    createdAt: new Date().toISOString(),
    stats: {
      views: 124,
      ctaClicks: 35,
      conversions: 8,
      shares: 12
    }
  },
  {
    id: "dup-2",
    originalId: "signal-2",
    userId: "user-123",
    name: "Crypto Investing Guide (Custom)",
    createdAt: new Date().toISOString(),
    stats: {
      views: 87,
      ctaClicks: 22,
      conversions: 5,
      shares: 7
    }
  }
];

// Mock original series data
const mockOriginalSeries: SignalSeriesWithStats[] = [
  {
    id: "signal-1",
    name: "AI Freedom Roadmap",
    slug: "ai-freedom-roadmap",
    description: "Master AI tools and build your freedom business in 5 simple steps",
    contentType: "mixed",
    thumbnailUrl: "/thumbnails/ai-freedom.jpg",
    featuredImageUrl: "/featured/ai-freedom-banner.jpg",
    createdBy: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: true,
    steps: [],
    isDuplicated: false,
    stats: {
      views: 1456,
      ctaClicks: 328,
      conversions: 42,
      shares: 86
    }
  },
  {
    id: "signal-2",
    name: "Crypto Investing Fundamentals",
    slug: "crypto-investing",
    description: "Learn the foundational principles of cryptocurrency investing",
    contentType: "video",
    thumbnailUrl: "/thumbnails/crypto-basics.jpg",
    featuredImageUrl: "/featured/crypto-banner.jpg",
    createdBy: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: true,
    steps: [],
    isDuplicated: false,
    stats: {
      views: 2387,
      ctaClicks: 542,
      conversions: 78,
      shares: 134
    }
  }
];

const MySignalFunnels: React.FC = () => {
  const [duplicatedSignals, setDuplicatedSignals] = useState<DuplicatedSignal[]>(mockDuplicatedSignals);
  const [originalSeries, setOriginalSeries] = useState<SignalSeriesWithStats[]>(mockOriginalSeries);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState("date");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [currentSignalId, setCurrentSignalId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const navigate = useNavigate();
  
  // Find duplicated signal by ID and get its original series
  const getSignalWithDetails = (signalId: string) => {
    const duplicated = duplicatedSignals.find(s => s.id === signalId);
    if (!duplicated) return null;
    
    const original = originalSeries.find(s => s.id === duplicated.originalId);
    return { duplicated, original };
  };
  
  // Filter signals by search term
  const filteredSignals = duplicatedSignals.filter(signal => 
    signal.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort signals based on criteria
  const sortedSignals = [...filteredSignals].sort((a, b) => {
    switch (sortCriteria) {
      case "date":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "views":
        return b.stats.views - a.stats.views;
      case "conversions":
        return b.stats.conversions - a.stats.conversions;
      default:
        return 0;
    }
  });
  
  // Navigation to view signal
  const handleViewSignal = (signalId: string) => {
    const signal = getSignalWithDetails(signalId);
    if (signal && signal.original) {
      navigate(`/s/${signal.original.slug}`);
    }
  };
  
  // Handle rename
  const handleOpenRenameDialog = (signalId: string) => {
    const signal = duplicatedSignals.find(s => s.id === signalId);
    if (signal) {
      setCurrentSignalId(signalId);
      setNewName(signal.name);
      setShowRenameDialog(true);
    }
  };
  
  const handleRename = () => {
    if (currentSignalId && newName.trim()) {
      setDuplicatedSignals(prev => 
        prev.map(signal => 
          signal.id === currentSignalId 
            ? { ...signal, name: newName.trim() } 
            : signal
        )
      );
      setShowRenameDialog(false);
      setCurrentSignalId(null);
      setNewName("");
    }
  };
  
  // Handle delete
  const handleOpenDeleteDialog = (signalId: string) => {
    setCurrentSignalId(signalId);
    setShowDeleteDialog(true);
  };
  
  const handleDelete = () => {
    if (currentSignalId) {
      setDuplicatedSignals(prev => 
        prev.filter(signal => signal.id !== currentSignalId)
      );
      setShowDeleteDialog(false);
      setCurrentSignalId(null);
    }
  };
  
  // Function to get content type icon
  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'article':
        return <FileText className="h-4 w-4" />;
      case 'mixed':
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };
  
  // Get original series for a duplicated signal
  const getOriginalSeries = (originalId: string) => {
    return originalSeries.find(series => series.id === originalId);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <AnimatedTransition>
          <div className="container mx-auto max-w-6xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold">My Signal Funnels</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Manage and track your duplicated Signal Series
                </p>
              </div>
              <Button onClick={() => navigate('/browse-signals')}>
                Browse Signal Series
              </Button>
            </div>
            
            <div className="mb-8">
              <Tabs defaultValue="signals" className="w-full">
                <TabsList>
                  <TabsTrigger value="signals">My Signals</TabsTrigger>
                  <TabsTrigger value="stats">Performance</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signals" className="mt-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="w-full max-w-sm">
                      <Input
                        placeholder="Search signals..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
                      <Select
                        value={sortCriteria}
                        onValueChange={setSortCriteria}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sort criteria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="date">Date (newest)</SelectItem>
                          <SelectItem value="views">Most views</SelectItem>
                          <SelectItem value="conversions">Most conversions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {sortedSignals.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                        <Copy className="h-8 w-8 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No Signal Funnels Yet</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
                        You haven't duplicated any Signal Series. Browse available series and duplicate one to get started.
                      </p>
                      <Button onClick={() => navigate('/browse-signals')}>
                        Browse Signal Series
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedSignals.map((signal) => {
                        const originalSeries = getOriginalSeries(signal.originalId);
                        
                        return (
                          <Card key={signal.id} className="overflow-hidden border border-gray-200 dark:border-gray-800 transition-all hover:shadow-md">
                            {originalSeries?.thumbnailUrl && (
                              <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                                <img 
                                  src={originalSeries.thumbnailUrl} 
                                  alt={signal.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{signal.name}</CardTitle>
                                <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">
                                  Custom
                                </Badge>
                              </div>
                              <CardDescription className="line-clamp-2">
                                {originalSeries?.description || "No description available"}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pb-2">
                              <div className="flex items-center space-x-2 mb-4">
                                {originalSeries && (
                                  <>
                                    {getContentTypeIcon(originalSeries.contentType)}
                                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{originalSeries.contentType} content</span>
                                  </>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <div className="flex flex-col">
                                  <span className="text-muted-foreground">Views</span>
                                  <span className="font-medium">{signal.stats.views.toLocaleString()}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-muted-foreground">Clicks</span>
                                  <span className="font-medium">{signal.stats.ctaClicks.toLocaleString()}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-muted-foreground">Conversions</span>
                                  <span className="font-medium">{signal.stats.conversions.toLocaleString()}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-muted-foreground">CTR</span>
                                  <span className="font-medium">
                                    {signal.stats.views > 0 
                                      ? ((signal.stats.ctaClicks / signal.stats.views) * 100).toFixed(1) + '%' 
                                      : '0%'}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-between pt-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleViewSignal(signal.id)}
                                className="flex items-center"
                              >
                                <Eye className="mr-1 h-4 w-4" /> View
                              </Button>
                              <div className="flex items-center space-x-2">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                                      </svg>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleOpenRenameDialog(signal.id)}>
                                      <Edit className="mr-2 h-4 w-4" /> Rename
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Share2 className="mr-2 h-4 w-4" /> Share
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <BarChart3 className="mr-2 h-4 w-4" /> Detailed Stats
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleOpenDeleteDialog(signal.id)} className="text-red-600">
                                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </CardFooter>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                  
                  {sortedSignals.length > 0 && filteredSignals.length === 0 && (
                    <div className="text-center py-8">
                      <h3 className="text-lg font-medium mb-2">No results found</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        No signals match your search term: "{searchTerm}"
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="stats" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Signal Performance</CardTitle>
                      <CardDescription>
                        Track the impact of your shared Signal Funnels
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">
                                {duplicatedSignals.reduce((sum, signal) => sum + signal.stats.views, 0).toLocaleString()}
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium text-muted-foreground">CTA Clicks</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">
                                {duplicatedSignals.reduce((sum, signal) => sum + signal.stats.ctaClicks, 0).toLocaleString()}
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium text-muted-foreground">Conversions</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">
                                {duplicatedSignals.reduce((sum, signal) => sum + signal.stats.conversions, 0).toLocaleString()}
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
                            </CardHeader>
                            <CardContent>
                              {(() => {
                                const totalClicks = duplicatedSignals.reduce((sum, signal) => sum + signal.stats.ctaClicks, 0);
                                const totalConversions = duplicatedSignals.reduce((sum, signal) => sum + signal.stats.conversions, 0);
                                const convRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
                                return <div className="text-2xl font-bold">{convRate.toFixed(1)}%</div>;
                              })()}
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">Signal Comparison</h3>
                          {duplicatedSignals.length === 0 ? (
                            <div className="text-center py-8 border border-dashed rounded-md">
                              <p className="text-gray-600 dark:text-gray-400">
                                Duplicate a Signal Series to see performance metrics
                              </p>
                            </div>
                          ) : (
                            <div className="overflow-hidden border rounded-lg">
                              <table className="w-full">
                                <thead>
                                  <tr className="bg-muted/50">
                                    <th className="text-left py-3 px-4 text-sm font-medium">Signal Name</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium">Views</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium">Clicks</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium">Conversions</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium">CTR</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {sortedSignals.map((signal, index) => {
                                    const ctr = signal.stats.views > 0 
                                      ? ((signal.stats.ctaClicks / signal.stats.views) * 100).toFixed(1) + '%' 
                                      : '0%';
                                      
                                    return (
                                      <tr key={signal.id} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                                        <td className="py-3 px-4 text-sm">{signal.name}</td>
                                        <td className="py-3 px-4 text-sm text-right">{signal.stats.views.toLocaleString()}</td>
                                        <td className="py-3 px-4 text-sm text-right">{signal.stats.ctaClicks.toLocaleString()}</td>
                                        <td className="py-3 px-4 text-sm text-right">{signal.stats.conversions.toLocaleString()}</td>
                                        <td className="py-3 px-4 text-sm text-right font-medium">{ctr}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </AnimatedTransition>
      </main>
      
      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename Signal</DialogTitle>
            <DialogDescription>
              Give your Signal Funnel a descriptive name to make it easier to identify
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="mt-1"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Signal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this Signal Funnel? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MySignalFunnels;
