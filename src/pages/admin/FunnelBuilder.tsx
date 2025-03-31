
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Eye, Trash2, Plus } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import AnimatedTransition from "@/components/AnimatedTransition";
import FunnelForm from "@/components/admin/funnels/FunnelForm";
import FunnelStepsManager from "@/components/admin/funnels/FunnelStepsManager";
import FunnelPreview from "@/components/admin/funnels/FunnelPreview";
import FunnelStats from "@/components/admin/funnels/FunnelStats";
import FunnelSettings from "@/components/admin/funnels/FunnelSettings";
import { Funnel } from "@/types/funnel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Mock funnel for initial development
const emptyFunnel: Funnel = {
  id: '',
  slug: '',
  title: '',
  description: '',
  steps: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: '',
  isPublished: false,
  visibility: 'private',
  trackingId: `funnel_${Date.now()}`,
  referralParams: {
    trackReferrals: true,
    defaultPlatform: 'insiderlife',
    affiliateEnabled: true
  }
};

export default function FunnelBuilder() {
  const { funnelId } = useParams<{ funnelId: string }>();
  const [funnel, setFunnel] = useState<Funnel>(emptyFunnel);
  const [activeTab, setActiveTab] = useState('details');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (funnelId) {
      setIsLoading(true);
      // In a real app, this would be an API call
      // For now, we'll simulate loading with a timeout
      setTimeout(() => {
        // Mock data - in a real app this would come from an API
        const loadedFunnel: Funnel = {
          id: funnelId,
          slug: 'vip-invitation',
          title: 'VIP Insider Access',
          description: 'Exclusive funnel for VIP members',
          thumbnailUrl: '/placeholder.svg',
          steps: [
            {
              id: 'step1',
              funnelId,
              title: 'Welcome to InsiderLife',
              description: 'Learn about our exclusive community',
              videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              thumbnailUrl: '/placeholder.svg',
              order: 0,
              ctaText: 'Continue to step 2',
              ctaAction: 'next_step',
              customHeadline: 'Join the Insiders Today!',
              customText: 'Get access to exclusive content and community',
              trackingId: 'step_1_track',
              isLastStep: false
            },
            {
              id: 'step2',
              funnelId,
              title: 'Member Benefits',
              description: 'Discover the benefits of membership',
              videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              thumbnailUrl: '/placeholder.svg',
              order: 1,
              ctaText: 'Join Now',
              ctaAction: 'join_community',
              customHeadline: 'Exclusive Benefits Await!',
              customText: 'Join now and get instant access',
              trackingId: 'step_2_track',
              isLastStep: true
            }
          ],
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-10T00:00:00Z',
          createdBy: 'admin_user',
          isPublished: true,
          visibility: 'public',
          customRoute: '/vip-invite',
          trackingId: 'funnel_vip_123',
          stats: {
            visits: 1240,
            ctaClicks: 680,
            conversions: 142,
            referralSignups: 89,
            completionRate: 42.5,
            stepStats: [
              {
                stepId: 'step1',
                visits: 1240,
                ctaClicks: 820,
                dropOff: 420
              },
              {
                stepId: 'step2',
                visits: 820,
                ctaClicks: 680,
                dropOff: 140
              }
            ]
          },
          requiresAuth: false,
          redirectLoggedInTo: 'dashboard',
          referralParams: {
            trackReferrals: true,
            defaultPlatform: 'insiderlife',
            affiliateEnabled: true
          }
        };
        
        setFunnel(loadedFunnel);
        setIsLoading(false);
      }, 800);
    } else {
      // Creating a new funnel
      setFunnel(emptyFunnel);
    }
  }, [funnelId]);
  
  const handleSave = async (updatedFunnel: Partial<Funnel>) => {
    setIsLoading(true);
    
    // Merge the updated funnel with the current funnel
    const mergedFunnel = {
      ...funnel,
      ...updatedFunnel,
      updatedAt: new Date().toISOString()
    };
    
    // In a real app, this would be an API call to save the funnel
    // For now, just update local state and show a toast
    setTimeout(() => {
      setFunnel(mergedFunnel as Funnel);
      setIsLoading(false);
      
      toast({
        title: funnelId ? "Funnel updated" : "Funnel created",
        description: funnelId 
          ? "Your funnel has been successfully updated."
          : "Your new funnel has been created.",
      });
      
      if (!funnelId) {
        // If this was a new funnel, redirect to the edit page for the new funnel
        navigate(`/admin/funnels/${Date.now()}`);
      }
    }, 500);
  };
  
  const handleDelete = () => {
    setIsLoading(true);
    
    // In a real app, this would be an API call to delete the funnel
    setTimeout(() => {
      setIsLoading(false);
      setIsDeleting(false);
      
      toast({
        title: "Funnel deleted",
        description: "The funnel has been successfully deleted.",
      });
      
      navigate('/admin/funnels');
    }, 500);
  };
  
  const handlePublish = () => {
    handleSave({ isPublished: !funnel.isPublished });
  };
  
  const handleGoBack = () => {
    navigate('/admin/funnels');
  };
  
  const handlePreview = () => {
    // In a real app, this would navigate to the funnel preview
    // For now, just show a toast
    toast({
      title: "Preview mode",
      description: "This would open the funnel preview in a new tab.",
    });
  };
  
  if (isLoading && !funnel.id) {
    return (
      <AnimatedTransition className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-muted-foreground">Loading funnel data...</div>
        </div>
      </AnimatedTransition>
    );
  }
  
  return (
    <AnimatedTransition className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleGoBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">
            {funnelId ? 'Edit Referral Funnel' : 'Create New Referral Funnel'}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {funnelId && (
            <>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handlePreview}
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2 text-destructive hover:text-destructive"
                onClick={() => setIsDeleting(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </>
          )}
          
          <Button 
            variant={funnel.isPublished ? "default" : "outline"}
            className={funnel.isPublished ? "bg-green-600 hover:bg-green-700" : ""}
            onClick={handlePublish}
          >
            {funnel.isPublished ? "Published" : "Publish"}
          </Button>
          
          <Button 
            onClick={() => handleSave(funnel)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="steps">Funnel Steps</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          {funnelId && <TabsTrigger value="stats">Stats</TabsTrigger>}
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <Card>
            <CardContent className="p-6">
              <FunnelForm 
                funnel={funnel} 
                onSave={(updatedFunnel) => handleSave(updatedFunnel)} 
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="steps">
          <FunnelStepsManager 
            funnel={funnel}
            onUpdate={(steps) => handleSave({ steps })}
          />
        </TabsContent>
        
        <TabsContent value="preview">
          <FunnelPreview funnel={funnel} />
        </TabsContent>
        
        {funnelId && (
          <TabsContent value="stats">
            <FunnelStats funnel={funnel} />
          </TabsContent>
        )}
        
        <TabsContent value="settings">
          <FunnelSettings 
            funnel={funnel}
            onSave={(updatedSettings) => handleSave(updatedSettings)}
          />
        </TabsContent>
      </Tabs>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Funnel</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this funnel? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AnimatedTransition>
  );
}
