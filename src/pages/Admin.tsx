import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, Users, CheckSquare, Image, Tag, Code, BarChart2, BookOpen, GraduationCap } from "lucide-react";
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
        <TabsList className="grid grid-cols-7 mb-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="create-content">Content</TabsTrigger>
          <TabsTrigger value="upload-document">Documents</TabsTrigger>
          <TabsTrigger value="create-event">Events</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="referral-programs">Referral Programs</TabsTrigger>
          <TabsTrigger value="cta-manager">CTA Manager</TabsTrigger>
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
        
        <TabsContent value="referral-programs" className="mt-4">
          <ReferralProgramManager />
        </TabsContent>
        
        <TabsContent value="cta-manager" className="mt-4">
          <CTAManager />
        </TabsContent>
      </Tabs>
    </AnimatedTransition>
  );
};

export default Admin;
