
import React, { useState } from 'react';
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileText, Video, ExternalLink, Eye, Copy, ArrowRight } from 'lucide-react';
import Header from "@/components/Header";
import AnimatedTransition from "@/components/AnimatedTransition";
import { SignalSeriesWithStats } from '@/types/signal';
import { useToast } from '@/hooks/use-toast';

// Mock data for browse page
const mockPublicSeries: SignalSeriesWithStats[] = [
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
  },
  {
    id: "signal-3",
    name: "Social Media Mastery",
    slug: "social-media-mastery",
    description: "Grow your audience and influence across major social platforms",
    contentType: "mixed",
    thumbnailUrl: "/thumbnails/social-media.jpg",
    featuredImageUrl: "/featured/social-media-banner.jpg",
    createdBy: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: true,
    steps: [],
    isDuplicated: false,
    stats: {
      views: 1876,
      ctaClicks: 423,
      conversions: 67,
      shares: 103
    }
  },
  {
    id: "signal-4",
    name: "Digital Product Creation",
    slug: "digital-product-creation",
    description: "Create and launch profitable digital products from scratch",
    contentType: "article",
    thumbnailUrl: "/thumbnails/digital-products.jpg",
    featuredImageUrl: "/featured/digital-products-banner.jpg",
    createdBy: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: true,
    steps: [],
    isDuplicated: false,
    stats: {
      views: 1245,
      ctaClicks: 289,
      conversions: 38,
      shares: 72
    }
  }
];

const BrowseSignalSeries: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [series] = useState<SignalSeriesWithStats[]>(mockPublicSeries);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Filter series by search term
  const filteredSeries = series.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleViewSeries = (slug: string) => {
    navigate(`/s/${slug}`);
  };
  
  const handleDuplicateSeries = (seriesId: string) => {
    // In a real app, this would make an API call
    toast({
      title: "Series duplicated!",
      description: "Find it in your dashboard under 'My Signal Funnels'",
    });
    
    // Navigate to funnels page
    setTimeout(() => {
      navigate('/my-signal-funnels');
    }, 1500);
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
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <AnimatedTransition>
          <div className="container mx-auto max-w-6xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold">Signal Series Library</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Browse and duplicate educational series with built-in referral tracking
                </p>
              </div>
              <Button onClick={() => navigate('/my-signal-funnels')}>
                My Signal Funnels
              </Button>
            </div>
            
            <div className="mb-6">
              <Input
                placeholder="Search signal series..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
            
            {filteredSeries.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  No signal series match your search term: "{searchTerm}"
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSeries.map((item) => (
                  <Card key={item.id} className="overflow-hidden border border-gray-200 dark:border-gray-800 transition-all hover:shadow-md">
                    {item.thumbnailUrl && (
                      <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img 
                          src={item.thumbnailUrl} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <Badge variant="outline" className="capitalize">
                          {item.contentType}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center space-x-2 mb-4">
                        {getContentTypeIcon(item.contentType)}
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {item.steps.length || "Multiple"} steps
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground">Views</span>
                          <span className="font-medium">{item.stats.views.toLocaleString()}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground">Clicks</span>
                          <span className="font-medium">{item.stats.ctaClicks.toLocaleString()}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground">Conversions</span>
                          <span className="font-medium">{item.stats.conversions.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewSeries(item.slug)}
                        className="flex items-center"
                      >
                        <Eye className="mr-1 h-4 w-4" /> Preview
                      </Button>
                      <Button 
                        onClick={() => handleDuplicateSeries(item.id)}
                        size="sm"
                        className="flex items-center"
                      >
                        <Copy className="mr-1 h-4 w-4" /> Duplicate
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
            
            <div className="mt-16 text-center">
              <h2 className="text-2xl font-bold mb-4">Want to amplify your influence?</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                Duplicate any Signal Series to create your own version with your referral links.
                Share with your audience and track your impact in one place.
              </p>
              <Button 
                onClick={() => navigate('/my-signal-funnels')}
                size="lg"
                className="group"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </AnimatedTransition>
      </main>
    </div>
  );
};

export default BrowseSignalSeries;
