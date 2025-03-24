
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import AnimatedTransition from "@/components/AnimatedTransition";
import ContentCreator from "@/components/ContentCreator";
import DocumentUploader from "@/components/DocumentUploader";
import EventCreator from "@/components/EventCreator";
import AdminDashboard from "@/components/AdminDashboard";
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
        
        <Button 
          onClick={() => setActiveTab("create-content")} 
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="mr-2 h-4 w-4" /> Create New
        </Button>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="create-content">Content</TabsTrigger>
          <TabsTrigger value="upload-document">Documents</TabsTrigger>
          <TabsTrigger value="create-event">Events</TabsTrigger>
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
      </Tabs>
    </AnimatedTransition>
  );
};

export default Admin;
