
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Clock, User, Play, PlusCircle, Lock, Shield } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Course } from '@/types/courses';
import { mockCourses } from '@/data/mockCourses';
import ContentCTAContainer from '@/components/content/ContentCTAContainer';
import Loading from '@/components/Loading';
import { useAuth } from '@/context/AuthContext';

export default function VideoCoursePage() {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Determine if the user has access to this content
  const getUserAccessLevel = () => {
    if (!user) return 'free';
    return user.subscription?.tier || 'free';
  };
  
  const hasAccess = (requiredLevel: string) => {
    const accessLevels = ['free', 'premium', 'vip'];
    const userLevel = accessLevels.indexOf(getUserAccessLevel());
    const requiredLevelIndex = accessLevels.indexOf(requiredLevel.toLowerCase());
    
    return userLevel >= requiredLevelIndex;
  };
  
  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, this would be an API call to fetch the course details
        // For now, we'll use the mock data
        
        // Simulate a network request
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const foundCourse = mockCourses.find(c => c.slug === slug);
        
        if (!foundCourse) {
          throw new Error('Course not found');
        }
        
        if (foundCourse.format !== 'video') {
          // If it's a series, navigate to the series page
          navigate(`/learn/series/${slug}`);
          return;
        }
        
        setCourse(foundCourse);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Failed to load course. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (slug) {
      fetchCourse();
    }
  }, [slug, navigate]);
  
  // Format duration from seconds to minutes
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }
    
    return `${minutes} minutes`;
  };
  
  // Format date to relative time (e.g., "2 months ago")
  const formatPublishedDate = (dateString: string) => {
    try {
      return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
    } catch (err) {
      return 'Recently';
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }
  
  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-destructive mb-2">Error</h2>
          <p className="text-muted-foreground">{error || 'Course not found'}</p>
          <Button onClick={() => navigate('/learn')} className="mt-4">
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }
  
  // If there are multiple modules but we're on the video course page, use the first module's video
  const videoModule = course.modules[0];
  const userHasAccess = hasAccess(course.accessLevel);
  
  // Mock CTAs for demonstration (in a real app, these would come from the course's ctaIds)
  const mockCTAs = [
    {
      id: "cta-1",
      campaignId: "insiderlife",
      buttonText: userHasAccess ? "Join Insider Life" : "Upgrade to Access",
      description: userHasAccess 
        ? "Get access to all premium courses and exclusive content."
        : `This content requires ${course.accessLevel} access. Upgrade to continue.`,
      theme: "primary" as const,
      placement: "banner" as const,
      position: "bottom" as const,
      contentId: course.id
    }
  ];
  
  return (
    <AnimatedTransition className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/learn')}
          className="mb-4 hover:bg-transparent"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Courses
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground mt-1">{course.summary}</p>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
            {course.category.map(cat => (
              <Badge key={cat} variant="outline">{cat}</Badge>
            ))}
            <Badge>{course.level}</Badge>
            {course.accessLevel !== 'free' && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary" className="ml-auto">
                      <Shield className="h-3 w-3 mr-1" /> {course.accessLevel}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This content requires {course.accessLevel} access</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Published {formatPublishedDate(course.publishedAt || course.createdAt)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{formatDuration(course.totalDuration)}</span>
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>Created by {course.creator.name}</span>
          </div>
        </div>
      </div>
      
      <Separator className="my-6" />
      
      {/* Video Player */}
      <div className="space-y-6">
        {!userHasAccess ? (
          <Card className="bg-gray-50 dark:bg-gray-800 overflow-hidden rounded-lg">
            <div className="aspect-video bg-gray-100 dark:bg-gray-900 relative">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
                  <Lock className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 text-center">
                  {course.accessLevel.toUpperCase()} Access Required
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-4">
                  This premium content is available to {course.accessLevel} members. Upgrade your membership to access this and other exclusive content.
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Upgrade to {course.accessLevel}
                </Button>
              </div>
              <img 
                src={course.thumbnailUrl}
                alt={course.title}
                className="w-full h-full object-cover opacity-10"
              />
            </div>
          </Card>
        ) : (
          <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
            {/* This would be replaced with a real video player in a production app */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <img 
                src={course.thumbnailUrl}
                alt={course.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-black/30" />
              <Button className="absolute inset-0 m-auto h-16 w-16 rounded-full p-0">
                <Play className="h-8 w-8" />
              </Button>
            </div>
          </div>
        )}
        
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">{videoModule.title}</h2>
            <p className="text-muted-foreground">{videoModule.description}</p>
            
            <Separator className="my-6" />
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add to Favorites
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => navigate('/learn')}>
                  Browse More Courses
                </Button>
                {userHasAccess && (
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    Mark as Completed
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* CTAs */}
        <ContentCTAContainer contentTitle={course.title} contentCTAs={mockCTAs} />
      </div>
    </AnimatedTransition>
  );
}
