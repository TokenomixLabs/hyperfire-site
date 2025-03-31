
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Globe, Settings, BarChart2, Plus, Check, Copy, Users, MessageSquare, BookOpen, LineChart } from "lucide-react";
import AnimatedTransition from "@/components/AnimatedTransition";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const CommunityCloningSystem = () => {
  const [activeTab, setActiveTab] = useState("communities");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoBack = () => {
    navigate("/admin");
  };

  const handleCreateCommunity = () => {
    setCreateDialogOpen(false);
    toast({
      title: "Community created",
      description: "New community template has been created successfully.",
    });
  };

  // Mock data for demonstration
  const communities = [
    {
      id: "com-001",
      name: "FinanceSignals",
      domain: "finance.signalfire.app",
      customDomain: "signals.financeco.com",
      members: 1245,
      status: "active",
      owner: "Financial Insights Inc.",
      created: "2023-08-15"
    },
    {
      id: "com-002",
      name: "TechTrends",
      domain: "tech.signalfire.app",
      customDomain: null,
      members: 872,
      status: "active",
      owner: "Digital Horizons LLC",
      created: "2023-09-22"
    },
    {
      id: "com-003",
      name: "HealthSignals",
      domain: "health.signalfire.app",
      customDomain: "community.healthcentral.org",
      members: 2541,
      status: "pending",
      owner: "Wellness Central Group",
      created: "2023-10-05"
    }
  ];

  return (
    <AnimatedTransition className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleGoBack}
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Community Cloning System</h1>
        </div>
        
        <Button 
          onClick={() => setCreateDialogOpen(true)} 
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Community Template
        </Button>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-5 mb-8 w-full md:w-auto">
          <TabsTrigger value="communities">Communities</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="domains">Custom Domains</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="communities" className="mt-4 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Manage Communities</h2>
            <div className="flex gap-2">
              <Input placeholder="Search communities..." className="w-64" />
              <Button variant="outline">Filter</Button>
            </div>
          </div>
          
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Domain</th>
                  <th className="text-left p-3 font-medium">Members</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Owner</th>
                  <th className="text-left p-3 font-medium">Created</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {communities.map((community) => (
                  <tr key={community.id} className="border-t hover:bg-muted/20">
                    <td className="p-3 font-medium">{community.name}</td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span>{community.domain}</span>
                        {community.customDomain && (
                          <span className="text-xs text-green-600 flex items-center gap-1 mt-1">
                            <Check className="h-3 w-3" /> {community.customDomain}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">{community.members.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        community.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {community.status === 'active' ? 'Active' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-3">{community.owner}</td>
                    <td className="p-3">{community.created}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">View</Button>
                        <Button size="sm" variant="ghost">Edit</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="mt-4 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Community Templates</h2>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" /> Add Template
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Community</CardTitle>
                <CardDescription>
                  Perfect for companies looking to build a professional community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">12 Starter Threads</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <LineChart className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">8 Signal Series</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">4 Courses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">3-tier Membership</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Preview</Button>
                <Button variant="outline">Edit</Button>
                <Button>Clone</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Creator Community</CardTitle>
                <CardDescription>
                  Designed for content creators and influencers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">8 Starter Threads</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <LineChart className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">6 Signal Series</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">2 Courses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">2-tier Membership</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Preview</Button>
                <Button variant="outline">Edit</Button>
                <Button>Clone</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Educational Community</CardTitle>
                <CardDescription>
                  For educators, courses, and learning communities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">6 Starter Threads</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <LineChart className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">4 Signal Series</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">10 Courses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">3-tier Membership</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Preview</Button>
                <Button variant="outline">Edit</Button>
                <Button>Clone</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="domains" className="mt-4 space-y-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Domain Verification</CardTitle>
                  <CardDescription>
                    Verify domain ownership and manage DNS settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="domain">Verify New Domain</Label>
                    <div className="flex gap-2">
                      <Input id="domain" placeholder="yourdomain.com" />
                      <Button>Verify</Button>
                    </div>
                  </div>
                  <div className="rounded border p-4 bg-muted/20">
                    <h4 className="font-medium mb-2">DNS Instructions</h4>
                    <p className="text-sm mb-2">Add the following CNAME record to your domain:</p>
                    <div className="flex justify-between items-center bg-muted p-2 rounded text-sm font-mono">
                      <code>CNAME @ cloning.signalfire.app</code>
                      <Button size="sm" variant="ghost">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Domain Status</CardTitle>
                  <CardDescription>
                    View and manage your verified domains
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <p className="font-medium">signals.financeco.com</p>
                        <p className="text-sm text-muted-foreground">Connects to: finance.signalfire.app</p>
                      </div>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <p className="font-medium">community.healthcentral.org</p>
                        <p className="text-sm text-muted-foreground">Connects to: health.signalfire.app</p>
                      </div>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        Pending
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Communities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-muted-foreground mt-1">+3 from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24,521</div>
                <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Communities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">9</div>
                <p className="text-xs text-muted-foreground mt-1">60% of total communities</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Community Growth</CardTitle>
              <CardDescription>New users across all communities over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                Growth chart would appear here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Global Settings</CardTitle>
              <CardDescription>Configure system-wide settings for community cloning</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="communityPrefix">Subdomain Prefix</Label>
                <Input id="communityPrefix" defaultValue="signalfire.app" />
                <p className="text-xs text-muted-foreground">Domain used for all community subdomains</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="enableCloning" className="form-checkbox" defaultChecked />
                <Label htmlFor="enableCloning">Enable community cloning for users</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="requireApproval" className="form-checkbox" defaultChecked />
                <Label htmlFor="requireApproval">Require admin approval for new communities</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="showBranding" className="form-checkbox" defaultChecked />
                <Label htmlFor="showBranding">Show "Powered by SignalFire" on all communities</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create New Community Template</DialogTitle>
            <DialogDescription>
              Create a template that users can clone to start their own community.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="templateName">Template Name</Label>
              <Input id="templateName" placeholder="Business Community" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="templateDesc">Description</Label>
              <Input id="templateDesc" placeholder="A community template for businesses" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="threads">Starter Threads</Label>
                <Input id="threads" type="number" defaultValue="5" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="series">Signal Series</Label>
                <Input id="series" type="number" defaultValue="3" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="courses">Education Courses</Label>
                <Input id="courses" type="number" defaultValue="2" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tiers">Membership Tiers</Label>
                <Input id="tiers" type="number" defaultValue="3" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCommunity}>Create Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AnimatedTransition>
  );
};

export default CommunityCloningSystem;
