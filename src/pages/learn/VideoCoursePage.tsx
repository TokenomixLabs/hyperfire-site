
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Clock, User, Play, PlusCircle } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Course } from '@/types/courses';
import { mockCourses } from '@/data/mockCourses';
import ContentCTAContainer from '@/components/content/ContentCTAContainer';
import Loading from '@/components/Loading';

export default function VideoCoursePage() {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
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
  
  // Mock CTAs for demonstration (in a real app, these would come from the course's ctaIds)
  const mockCTAs = [
    {
      id: "cta-1",
      campaignId: "insiderlife",
      buttonText: "Join Insider Life",
      description: "Get access to all premium courses and exclusive content.",
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
        
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">{videoModule.title}</h2>
            <p className="text-muted-foreground">{videoModule.description}</p>
            
            <Separator className="my-6" />
            
            <div className="flex justify-between items-center">
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
                <Button size="sm">
                  Mark as Completed
                </Button>
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
