
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, Users, CheckSquare, Image, Tag, Code, BarChart2, BookOpen, GraduationCap, Globe, Settings, GitFork } from "lucide-react";
import AnimatedTransition from "@/components/AnimatedTransition";
import ContentCreator from "@/components/ContentCreator";
import DocumentUploader from "@/components/DocumentUploader";
import EventCreator from "@/components/EventCreator";
import AdminDashboard from "@/components/AdminDashboard";
import NotificationCenter from "@/components/NotificationCenter";
import ReferralProgramManager from "@/components/admin/referrals/ReferralProgramManager";
import CTAManager from "@/components/admin/referrals/CTAManager";
import CoursesAdmin from "./admin/CoursesAdmin";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleGoBack = () => {
    navigate("/");
    toast({
      title: "Exited admin panel",
      description: "You have successfully exited the admin panel",
    });
  };

  const handleNavigateToUsers = () => {
    navigate("/users");
  };
  
  const handleNavigateToApproval = () => {
    navigate("/content-approval");
  };
  
  const handleNavigateToMedia = () => {
    navigate("/media-library");
  };

  const handleNavigateToSeoTools = () => {
    navigate("/seo-tools");
  };
  
  const handleNavigateToIntegrationTools = () => {
    navigate("/integration-tools");
  };
  
  const handleNavigateToCourses = () => {
    navigate("/admin/courses");
  };
  
  const handleNavigateToFunnels = () => {
    navigate("/admin/funnels");
  };
  
  const handleNavigateToCommunityCloningSystem = () => {
    navigate("/admin/community-cloning");
  };

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
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <NotificationCenter />
          
          <Button 
            variant="outline"
            onClick={handleNavigateToIntegrationTools}
            className="flex items-center gap-2"
          >
            <Code className="h-4 w-4" /> Integration Tools
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleNavigateToSeoTools}
            className="flex items-center gap-2"
          >
            <Tag className="h-4 w-4" /> SEO Tools
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleNavigateToMedia}
            className="flex items-center gap-2"
          >
            <Image className="h-4 w-4" /> Media Library
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleNavigateToApproval}
            className="flex items-center gap-2"
          >
            <CheckSquare className="h-4 w-4" /> Content Approval
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleNavigateToUsers}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" /> Manage Users
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleNavigateToCourses}
            className="flex items-center gap-2"
          >
            <GraduationCap className="h-4 w-4" /> Education
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleNavigateToFunnels}
            className="flex items-center gap-2 bg-orange-500 text-white hover:bg-orange-600"
          >
            <GitFork className="h-4 w-4" /> Funnel Builder
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleNavigateToCommunityCloningSystem}
            className="flex items-center gap-2 bg-purple-600 text-white hover:bg-purple-700"
          >
            <Globe className="h-4 w-4" /> Community Cloning
          </Button>
          
          <Button 
            onClick={() => setActiveTab("create-content")} 
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Create New
          </Button>
        </div>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-9 mb-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="create-content">Content</TabsTrigger>
          <TabsTrigger value="upload-document">Documents</TabsTrigger>
          <TabsTrigger value="create-event">Events</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="funnels">Funnels</TabsTrigger>
          <TabsTrigger value="referral-programs">Referral Programs</TabsTrigger>
          <TabsTrigger value="cta-manager">CTA Manager</TabsTrigger>
          <TabsTrigger value="community-cloning">Community Cloning</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-4">
          <AdminDashboard />
        </TabsContent>
        
        <TabsContent value="create-content" className="mt-4">
          <ContentCreator />
        </TabsContent>
        
        <TabsContent value="upload-document" className="mt-4">
          <DocumentUploader />
        </TabsContent>
        
        <TabsContent value="create-event" className="mt-4">
          <EventCreator />
        </TabsContent>
        
        <TabsContent value="courses" className="mt-4">
          <CoursesAdmin />
        </TabsContent>
        
        <TabsContent value="funnels" className="mt-4">
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold">Referral Funnel Builder</h2>
                <p className="text-muted-foreground mt-1">
                  Create multi-step funnels to convert visitors into members through your referral network.
                </p>
              </div>
              <Button 
                onClick={handleNavigateToFunnels}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="mr-2 h-4 w-4" /> Create New Funnel
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border hover:border-orange-300 transition-colors cursor-pointer"
                onClick={() => navigate('/admin/funnels/new')}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
                  <div className="mb-4 p-3 rounded-full bg-orange-100">
                    <GitFork className="h-8 w-8 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Create New Funnel</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    Build a multi-step referral funnel from scratch with custom steps.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border hover:border-orange-300 transition-colors cursor-pointer"
                onClick={handleNavigateToFunnels}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
                  <div className="mb-4 p-3 rounded-full bg-green-100">
                    <BarChart2 className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">View Funnel Analytics</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    Track conversions, engagement, and referral activity across all funnels.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border hover:border-purple-300 transition-colors cursor-pointer"
                onClick={() => setActiveTab("referral-programs")}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
                  <div className="mb-4 p-3 rounded-full bg-purple-100">
                    <Users className="h-8 w-8 text-purple-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Manage Referral Programs</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    Configure referral programs that integrate with your funnels.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="referral-programs" className="mt-4">
          <ReferralProgramManager />
        </TabsContent>
        
        <TabsContent value="cta-manager" className="mt-4">
          <CTAManager />
        </TabsContent>
        
        <TabsContent value="community-cloning" className="mt-4">
          <div className="space-y-8">
            <div className="flex justify-between">
              <h2 className="text-2xl font-semibold">Community Cloning System</h2>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="mr-2 h-4 w-4" /> Create Template Community
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="rounded-lg border p-6 space-y-4">
                  <h3 className="text-xl font-medium">Community Templates</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage the templates that users can clone to create their own SignalFire communities.
                  </p>
                  <Button className="w-full">Manage Templates</Button>
                </div>
                
                <div className="rounded-lg border p-6 space-y-4">
                  <h3 className="text-xl font-medium">Default Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure default settings for newly cloned communities including starter threads, 
                    signal series, and education hub structure.
                  </p>
                  <Button className="w-full">Configure Defaults</Button>
                </div>
              </div>
              
              <div className="rounded-lg border p-6 space-y-4">
                <h3 className="text-xl font-medium">Cloned Communities</h3>
                <p className="text-sm text-muted-foreground">
                  View and manage all communities that have been cloned from your templates.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Total Communities</span>
                    <span className="text-purple-600 font-bold">12</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Active Communities</span>
                    <span className="text-green-600 font-bold">8</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Pending Verification</span>
                    <span className="text-amber-600 font-bold">3</span>
                  </div>
                </div>
                <Button className="w-full">View All Communities</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-lg border p-6 space-y-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 text-purple-800 mb-4">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium">Custom Domains</h3>
                <p className="text-sm text-muted-foreground">
                  Manage custom domain settings and DNS verification for community owners.
                </p>
                <Button variant="outline" className="w-full">Manage Domains</Button>
              </div>
              
              <div className="rounded-lg border p-6 space-y-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-800 mb-4">
                  <BarChart2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium">Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Track growth, engagement, and referrals across all cloned communities.
                </p>
                <Button variant="outline" className="w-full">View Analytics</Button>
              </div>
              
              <div className="rounded-lg border p-6 space-y-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 text-amber-800 mb-4">
                  <Settings className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium">Global Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Configure global settings for community cloning and branding options.
                </p>
                <Button variant="outline" className="w-full">Configure Settings</Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AnimatedTransition>
  );
};

export default Admin;
