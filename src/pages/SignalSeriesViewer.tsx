
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Copy, Share2, ExternalLink, Play, BookOpen } from 'lucide-react';
import AnimatedTransition from "@/components/AnimatedTransition";
import { SignalSeries, SignalStep } from '@/types/signal';
import { useReferral } from '@/context/ReferralContext';
import { ReferralProvider } from '@/context/ReferralContext';
import Header from '@/components/Header';
import ContentCTA from '@/components/content/ContentCTA';
import { ReferralPlatform } from '@/context/ReferralContext';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Mock data for series
const mockSignalSeries = [
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
    steps: [
      {
        id: "step-1",
        title: "Introduction to AI Tools",
        content: `# Welcome to the AI Freedom Roadmap\n\nIn this series, you'll learn how to leverage AI tools to build an online business that gives you freedom and flexibility.\n\n## What You'll Learn\n\n- The fundamentals of AI and how it's changing business\n- Key AI tools that can supercharge your productivity\n- How to build systems that generate passive income\n- Step-by-step plans to implement AI in your workflow`,
        order: 0,
        ctas: [
          {
            id: "cta-1",
            contentId: "step-1",
            campaignId: "aifc",
            buttonText: "Start Your AI Journey",
            description: "Join AI Freedom Code to gain full access to all training materials",
            theme: "primary",
            placement: "card",
            position: "bottom"
          }
        ]
      },
      {
        id: "step-2",
        title: "Selecting Your AI Tools",
        content: `# Choosing the Right AI Tools\n\nWith hundreds of AI tools available, it's important to select the ones that will have the biggest impact on your business.\n\n## Essential AI Categories\n\n- Content Creation: Generate blog posts, marketing copy, and social media content\n- Image & Design: Create professional graphics without design skills\n- Research & Analysis: Summarize information and extract key insights\n- Automation: Set up workflows that run without your involvement\n\nStart by identifying where you spend the most time in your business, and look for AI tools to optimize those areas first.`,
        videoEmbed: "https://www.youtube.com/embed/example",
        order: 1,
        ctas: [
          {
            id: "cta-2",
            contentId: "step-2",
            campaignId: "insiderdao",
            buttonText: "Get Our AI Tool Stack",
            description: "Access our comprehensive list of recommended AI tools",
            theme: "default",
            placement: "inline",
            position: "bottom"
          }
        ]
      },
      {
        id: "step-3",
        title: "Building Your AI Workflow",
        content: `# Creating an AI-Powered Workflow\n\nNow that you have your tools, it's time to build a workflow that leverages AI at each step.\n\n## The Ideal Workflow Structure\n\n1. Input: Clearly define what you need from the AI\n2. Processing: Allow the AI to generate initial results\n3. Refinement: Review and guide the AI toward better outputs\n4. Integration: Connect the results to your business systems\n\nRemember: The goal isn't to replace human creativity, but to amplify it.`,
        order: 2,
        ctas: [
          {
            id: "cta-3",
            contentId: "step-3",
            campaignId: "societi",
            buttonText: "Join the AI Community",
            description: "Connect with other AI enthusiasts building online businesses",
            theme: "minimal",
            placement: "banner",
            position: "bottom"
          }
        ]
      }
    ],
    isDuplicated: false
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
    steps: [
      {
        id: "step-1",
        title: "Understanding Blockchain Basics",
        content: `# Blockchain Technology 101\n\nIn this first step, we'll cover the fundamental concepts behind blockchain technology and why it matters for cryptocurrency investors.\n\n## Key Concepts\n\n- Distributed ledger technology\n- Consensus mechanisms\n- Public vs private blockchains\n- Smart contracts and their applications`,
        videoEmbed: "https://www.youtube.com/embed/example2",
        order: 0,
        ctas: [
          {
            id: "cta-1",
            contentId: "step-1",
            campaignId: "insiderdao",
            buttonText: "Join InsiderDAO",
            description: "Get access to our crypto trading community and signals",
            theme: "primary",
            placement: "card",
            position: "bottom"
          }
        ]
      }
    ],
    isDuplicated: false
  }
];

// Function to find a series by slug
const findSeriesBySlug = (slug: string): SignalSeries | undefined => {
  return mockSignalSeries.find(series => series.slug === slug);
};

const SignalSeriesViewer = () => {
  const { slug } = useParams<{ slug: string }>();
  const [series, setSeries] = useState<SignalSeries | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { trackClick, userReferralCode } = useReferral();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (slug) {
      // Simulate loading data
      setLoading(true);
      setTimeout(() => {
        const foundSeries = findSeriesBySlug(slug);
        if (foundSeries) {
          setSeries(foundSeries);
          // Track a view of this series
          console.log(`Viewing series: ${foundSeries.id}`);
        } else {
          // Handle 404
          navigate('/not-found');
        }
        setLoading(false);
      }, 500);
    }
  }, [slug, navigate]);
  
  useEffect(() => {
    // Check for step query param
    const searchParams = new URLSearchParams(location.search);
    const stepParam = searchParams.get('step');
    if (stepParam && series) {
      const stepIndex = parseInt(stepParam) - 1;
      if (stepIndex >= 0 && stepIndex < series.steps.length) {
        setCurrentStepIndex(stepIndex);
      }
    }
  }, [location.search, series]);
  
  const goToNextStep = () => {
    if (series && currentStepIndex < series.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      window.scrollTo(0, 0);
      updateUrlWithStep(currentStepIndex + 1);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      window.scrollTo(0, 0);
      updateUrlWithStep(currentStepIndex - 1);
    }
  };
  
  const updateUrlWithStep = (stepIndex: number) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('step', (stepIndex + 1).toString());
    navigate({
      pathname: location.pathname,
      search: searchParams.toString()
    }, { replace: true });
  };
  
  const copyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied",
      description: "Share link has been copied to clipboard",
    });
  };
  
  const shareViaChannel = (channel: string) => {
    let shareUrl = '';
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(series?.name || 'Check out this Signal Series');
    
    switch (channel) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${title}&body=${url}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };
  
  const duplicateSignalSeries = () => {
    if (!userReferralCode) {
      toast({
        title: "Login required",
        description: "Please log in to duplicate this Signal Series",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would make an API call to clone the series
    toast({
      title: "Series duplicated!",
      description: "Find it in your dashboard under 'My Signal Funnels'",
    });
  };
  
  const campaignNames: Record<string, string> = {
    "insiderlife": "InsiderLife",
    "insiderdao": "InsiderDAO", 
    "societi": "Societi",
    "aifc": "AI Freedom Code"
  };
  
  const campaignToPlatformMap: Record<string, ReferralPlatform> = {
    "insiderlife": "insiderlife",
    "insiderdao": "insiderdao",
    "societi": "societi", 
    "aifc": "aifc"
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
            <p className="mt-4 text-lg">Loading signal series...</p>
          </div>
        </main>
      </div>
    );
  }
  
  if (!series) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Signal Series Not Found</h2>
            <p className="mt-4">The series you're looking for doesn't exist or has been removed.</p>
            <Button
              className="mt-8"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </div>
        </main>
      </div>
    );
  }
  
  const currentStep = series.steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / series.steps.length) * 100;
  
  return (
    <ReferralProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        <AnimatedTransition>
          <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-4xl">
              <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">{series.name}</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">{series.description}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={duplicateSignalSeries}
                      className="whitespace-nowrap"
                    >
                      <Copy className="mr-2 h-4 w-4" /> Duplicate This Signal
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Share2 className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={copyShareLink}>
                          <Copy className="mr-2 h-4 w-4" /> Copy link
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => shareViaChannel('twitter')}>
                          <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                          </svg>
                          Twitter
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => shareViaChannel('facebook')}>
                          <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                          </svg>
                          Facebook
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => shareViaChannel('linkedin')}>
                          <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                          </svg>
                          LinkedIn
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => shareViaChannel('email')}>
                          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Email
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <div className="flex items-center mt-6 space-x-4">
                  <div className="flex items-center">
                    {series.contentType === 'video' && <Play className="h-4 w-4 mr-1" />}
                    {series.contentType === 'article' && <BookOpen className="h-4 w-4 mr-1" />}
                    {series.contentType === 'mixed' && <ExternalLink className="h-4 w-4 mr-1" />}
                    <span className="text-sm capitalize">{series.contentType} Series</span>
                  </div>
                  <div className="text-sm">•</div>
                  <div className="text-sm">{series.steps.length} steps</div>
                </div>
                
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Step {currentStepIndex + 1} of {series.steps.length}</span>
                    <span>{Math.round(progress)}% Complete</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
              
              <Card className="mb-8">
                <CardContent className="p-6 sm:p-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-6">{currentStep.title}</h2>
                    
                    {currentStep.videoEmbed && (
                      <div className="aspect-video w-full mb-8 bg-gray-200 dark:bg-gray-800 rounded-md">
                        <div className="w-full h-full rounded-md overflow-hidden">
                          <iframe
                            className="w-full h-full"
                            src={currentStep.videoEmbed}
                            title={currentStep.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>
                    )}
                    
                    {currentStep.mediaUrl && (
                      <div className="mb-8">
                        <img 
                          src={currentStep.mediaUrl} 
                          alt={currentStep.title}
                          className="rounded-md max-h-[400px] w-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="prose dark:prose-invert max-w-none">
                      {currentStep.content.split('\n\n').map((paragraph, index) => {
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
                  </div>
                </CardContent>
              </Card>
              
              {/* CTAs */}
              {currentStep.ctas.length > 0 && (
                <div className="mb-8 space-y-4">
                  {currentStep.ctas.map((cta) => {
                    const platformId = campaignToPlatformMap[cta.campaignId] || "insiderlife";
                    const campaignName = campaignNames[cta.campaignId] || "InsiderLife";
                    
                    return (
                      <ContentCTA
                        key={cta.id}
                        cta={cta}
                        contentTitle={`${series.name} - ${currentStep.title}`}
                        campaignName={campaignName}
                        platformId={platformId as ReferralPlatform}
                        dismissible={false}
                      />
                    );
                  })}
                </div>
              )}
              
              <div className="flex justify-between items-center mb-12">
                <Button 
                  variant="outline" 
                  onClick={goToPreviousStep} 
                  disabled={currentStepIndex === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous Step
                </Button>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-4">
                        {Array.from({ length: series.steps.length }).map((_, index) => (
                          <div 
                            key={index}
                            className={`h-2 w-2 rounded-full transition-colors ${
                              index === currentStepIndex ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'
                            }`}
                          ></div>
                        ))}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      Step {currentStepIndex + 1} of {series.steps.length}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <Button 
                  onClick={goToNextStep} 
                  disabled={currentStepIndex === series.steps.length - 1}
                >
                  Next Step <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </main>
        </AnimatedTransition>
      </div>
    </ReferralProvider>
  );
};

export default SignalSeriesViewer;
