
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eye, Copy, Share2, ChevronLeft, ChevronRight, 
  CheckCircle, Play, BookOpen, Files, MessageSquareShare
} from 'lucide-react';
import { SignalLibraryItem } from '@/types/signalLibrary';
import { SignalStep } from '@/types/signal';
import AnimatedTransition from "@/components/AnimatedTransition";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ContentCTAContainer from '@/components/content/ContentCTAContainer';
import { useReferral } from '@/context/ReferralContext';

// Mock data for demonstration
import { mockSignalLibrary } from "@/data/mockSignalLibrary";

const StepContentViewer: React.FC<{ step: SignalStep, seriesTitle: string }> = ({ step, seriesTitle }) => {
  const renderContent = () => {
    return (
      <div className="prose dark:prose-invert max-w-none">
        {step.content.split('\n\n').map((paragraph, index) => {
          if (paragraph.startsWith('# ')) {
            return <h1 key={index} className="text-2xl font-bold mt-6 mb-4">{paragraph.replace('# ', '')}</h1>;
          } else if (paragraph.startsWith('## ')) {
            return <h2 key={index} className="text-xl font-bold mt-5 mb-3">{paragraph.replace('## ', '')}</h2>;
          } else if (paragraph.startsWith('- ')) {
            const items = paragraph.split('\n').filter(item => item.startsWith('- '));
            return (
              <ul key={index} className="list-disc pl-5 my-4">
                {items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item.replace('- ', '')}</li>
                ))}
              </ul>
            );
          } else if (paragraph.startsWith('1. ')) {
            const items = paragraph.split('\n').filter(item => /^\d+\.\s/.test(item));
            return (
              <ol key={index} className="list-decimal pl-5 my-4">
                {items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item.replace(/^\d+\.\s/, '')}</li>
                ))}
              </ol>
            );
          } else if (paragraph.trim() !== '') {
            return <p key={index} className="my-4">{paragraph}</p>;
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {step.videoEmbed && (
        <div className="aspect-video w-full bg-gray-950 rounded-lg overflow-hidden">
          <iframe 
            src={step.videoEmbed} 
            title={step.title}
            className="w-full h-full"
            allowFullScreen
          ></iframe>
        </div>
      )}
      
      {step.mediaUrl && !step.videoEmbed && (
        <div className="w-full flex justify-center">
          <img 
            src={step.mediaUrl}
            alt={step.title}
            className="max-h-[500px] object-contain rounded-lg"
          />
        </div>
      )}
      
      <div className="mt-4">
        {renderContent()}
      </div>

      {step.ctas && step.ctas.length > 0 && (
        <ContentCTAContainer 
          contentTitle={`${seriesTitle} - ${step.title}`}
          contentCTAs={step.ctas}
        />
      )}
    </div>
  );
};

const SignalSeriesDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { generateReferralLink } = useReferral();
  
  const [series, setSeries] = useState<SignalLibraryItem | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (slug) {
      // In a real app, fetch from API
      const foundSeries = mockSignalLibrary.find(s => s.slug === slug);
      
      if (foundSeries) {
        setSeries(foundSeries);
        // Increment view count would happen in a real app API call
      } else {
        navigate('/signal-library');
      }
    }
  }, [slug, navigate]);
  
  useEffect(() => {
    if (series && series.steps.length > 0) {
      const newProgress = ((currentStepIndex + 1) / series.steps.length) * 100;
      setProgress(newProgress);
    }
  }, [currentStepIndex, series]);
  
  const handleNextStep = () => {
    if (series && currentStepIndex < series.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleSelectStep = (index: number) => {
    setCurrentStepIndex(index);
    window.scrollTo(0, 0);
  };
  
  const handleShare = () => {
    setShareDialogOpen(true);
  };
  
  const copyShareLink = () => {
    if (!series) return;
    
    const shareUrl = user
      ? generateReferralLink(`${window.location.origin}/signal/${series.slug}`)
      : `${window.location.origin}/signal/${series.slug}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Link Copied!",
        description: "Share link has been copied to clipboard",
      });
      setShareDialogOpen(false);
    });
  };
  
  const handleDuplicate = () => {
    if (!user) {
      // Redirect to login page if not logged in
      navigate("/login?next=" + encodeURIComponent(window.location.pathname));
      return;
    }
    
    setDuplicateDialogOpen(true);
  };
  
  const confirmDuplicate = () => {
    if (!series) return;
    
    setIsLoading(true);
    
    // In a real app, make API call to duplicate
    setTimeout(() => {
      setIsLoading(false);
      setDuplicateDialogOpen(false);
      
      toast({
        title: "Signal Series Duplicated!",
        description: "The signal series has been added to your dashboard",
      });
      
      // Redirect to user dashboard
      navigate('/my-signal-funnels');
    }, 1000);
  };
  
  if (!series) {
    return (
      <AnimatedTransition className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-center">
            <h2 className="text-xl font-medium">Loading...</h2>
          </div>
        </div>
      </AnimatedTransition>
    );
  }
  
  const currentStep = series.steps[currentStepIndex];
  const getStepIcon = (type: string) => {
    if (type.includes('video')) return <Play className="h-4 w-4" />;
    if (type.includes('article')) return <BookOpen className="h-4 w-4" />;
    return <Files className="h-4 w-4" />;
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const creatorName = series.createdBy === "admin" ? "InsiderLife Team" : series.createdBy;

  return (
    <AnimatedTransition className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/signal-library')}
          className="mb-4"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Back to Signal Library
        </Button>
        
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold">{series.name}</h1>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="mr-1 h-4 w-4" /> Share
            </Button>
            <Button 
              size="sm" 
              onClick={handleDuplicate}
              className="hidden sm:flex"
            >
              <Copy className="mr-1 h-4 w-4" /> Duplicate
            </Button>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <p className="text-muted-foreground mb-4">{series.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {series.tags?.map(tag => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/avatars/01.png" alt={creatorName} />
                  <AvatarFallback>{getInitials(creatorName)}</AvatarFallback>
                </Avatar>
                <span>{creatorName}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" /> {series.stats.views.toLocaleString()} views
              </div>
              
              <div className="flex items-center gap-1">
                <Copy className="h-4 w-4" /> {series.duplicationsCount.toLocaleString()} duplications
              </div>
              
              <div>
                {series.steps.length} {series.steps.length === 1 ? 'step' : 'steps'}
              </div>
            </div>
          </div>
          
          <div className="hidden md:block md:col-span-1">
            {series.featuredImageUrl && (
              <img 
                src={series.featuredImageUrl} 
                alt={series.name} 
                className="w-full rounded-lg object-cover max-h-[200px]"
              />
            )}
          </div>
        </div>
        
        <Button 
          className="w-full mt-4 md:hidden"
          onClick={handleDuplicate}
        >
          <Copy className="mr-2 h-4 w-4" /> Duplicate This Signal
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Step {currentStepIndex + 1} of {series.steps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-bold mb-6">{currentStep?.title}</h2>
            
            {currentStep && (
              <StepContentViewer step={currentStep} seriesTitle={series.name} />
            )}
            
            <div className="flex justify-between items-center mt-8">
              <Button 
                variant="outline" 
                onClick={handlePreviousStep} 
                disabled={currentStepIndex === 0}
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Previous
              </Button>
              
              <Button 
                onClick={handleNextStep} 
                disabled={currentStepIndex === series.steps.length - 1}
              >
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border p-4 sticky top-4">
            <h3 className="font-medium mb-4">Signal Steps</h3>
            
            <div className="space-y-2">
              {series.steps.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;
                
                return (
                  <div 
                    key={step.id}
                    className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : isCompleted
                          ? 'bg-muted text-foreground'
                          : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleSelectStep(index)}
                  >
                    <div className="flex-shrink-0 mr-2">
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <div className={`flex items-center justify-center h-5 w-5 rounded-full border ${isActive ? 'border-primary-foreground' : 'border-muted-foreground'}`}>
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 truncate mr-2">{step.title}</div>
                    <div className="flex-shrink-0">
                      {getStepIcon(step.videoEmbed ? 'video' : 'article')}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 space-y-3">
              <Button 
                className="w-full" 
                variant="default"
                onClick={handleDuplicate}
              >
                <Copy className="mr-2 h-4 w-4" /> Duplicate Signal
              </Button>
              
              <Button 
                className="w-full" 
                variant="outline"
                onClick={handleShare}
              >
                <MessageSquareShare className="mr-2 h-4 w-4" /> Share
              </Button>
            </div>
            
            {series.aiSummary && (
              <div className="mt-6 p-3 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">AI Summary</h4>
                <p className="text-sm text-muted-foreground">{series.aiSummary.summary}</p>
                
                {series.aiSummary.guardianAware && series.aiSummary.guardianCommentary && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <h5 className="font-medium text-sm mb-1">Guardian Commentary</h5>
                    <p className="text-sm italic text-muted-foreground">"{series.aiSummary.guardianCommentary}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Signal Series</DialogTitle>
            <DialogDescription>
              Share this Signal Series with your network
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Copy the link below to share this Signal Series. If you are logged in, your referral code will be automatically added to the link.
            </p>
            
            <div className="flex items-center mt-4">
              <Button onClick={copyShareLink} className="w-full">
                <Share2 className="mr-2 h-4 w-4" /> Copy Share Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={duplicateDialogOpen} onOpenChange={setDuplicateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicate Signal Series</DialogTitle>
            <DialogDescription>
              Add this Signal Series to your dashboard
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <p className="text-sm">
              When you duplicate this Signal Series:
            </p>
            
            <ul className="list-disc pl-5 text-sm space-y-2">
              <li>It will appear in your dashboard</li>
              <li>All your referral links will be automatically applied</li>
              <li>You can share it with your own unique link</li>
              <li>You'll earn rewards when people sign up through your link</li>
            </ul>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDuplicateDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmDuplicate}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Duplicate Signal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AnimatedTransition>
  );
};

export default SignalSeriesDetail;
