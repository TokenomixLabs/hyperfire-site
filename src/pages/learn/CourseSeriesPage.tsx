
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Clock, User, BookOpen, CheckCircle, Circle, ChevronRight } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Course, CourseModule } from '@/types/courses';
import { mockCourses } from '@/data/mockCourses';
import ContentCTAContainer from '@/components/content/ContentCTAContainer';
import Loading from '@/components/Loading';

export default function CourseSeriesPage() {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);
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
        
        if (foundCourse.format !== 'series') {
          // If it's not a series, navigate to the video course page
          navigate(`/learn/${slug}`);
          return;
        }
        
        setCourse(foundCourse);
        
        // Set the first module as the selected module or the last accessed module
        if (foundCourse.modules.length > 0) {
          // In a real app, we'd fetch the user's progress and select the appropriate module
          // For now, we'll just select the first module
          setSelectedModule(foundCourse.modules[0]);
        }
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
    return `${minutes} min`;
  };
  
  // Format date to relative time (e.g., "2 months ago")
  const formatPublishedDate = (dateString: string) => {
    try {
      return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
    } catch (err) {
      return 'Recently';
    }
  };
  
  const handleModuleSelect = (module: CourseModule) => {
    setSelectedModule(module);
    // In a real app, you would also track this in the user's progress
  };
  
  const handleNextModule = () => {
    if (!course || !selectedModule) return;
    
    const currentIndex = course.modules.findIndex(m => m.id === selectedModule.id);
    if (currentIndex < course.modules.length - 1) {
      setSelectedModule(course.modules[currentIndex + 1]);
    }
  };
  
  const handleModuleComplete = () => {
    if (!selectedModule) return;
    
    // In a real app, you would update the user's progress in the backend
    // For now, we'll just mark the module as completed in the UI
    if (course) {
      const updatedModules = course.modules.map(m => 
        m.id === selectedModule.id ? { ...m, isCompleted: true } : m
      );
      
      setCourse({
        ...course,
        modules: updatedModules
      });
      
      // Check if this was the last module and if all modules are completed
      const allCompleted = updatedModules.every(m => m.isCompleted);
      if (allCompleted) {
        // In a real app, you would update the course completion status in the backend
        console.log('Course completed!');
      }
    }
    
    // Automatically move to the next module if available
    handleNextModule();
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }
  
  if (error || !course || !selectedModule) {
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
    <AnimatedTransition className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-start">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/learn')}
          className="mb-4 hover:bg-transparent"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Courses
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Module Navigation Sidebar */}
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardContent className="p-4">
              <h2 className="font-semibold mb-3 flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Course Modules
              </h2>
              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="space-y-1 pr-2">
                  {course.modules.map((module, index) => (
                    <Button
                      key={module.id}
                      variant={selectedModule.id === module.id ? "default" : "ghost"}
                      size="sm"
                      className={`w-full justify-start text-left ${selectedModule.id === module.id ? 'bg-primary' : ''}`}
                      onClick={() => handleModuleSelect(module)}
                    >
                      <div className="flex items-center">
                        {module.isCompleted ? (
                          <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 mr-2 flex-shrink-0" />
                        )}
                        <div className="truncate">
                          <span className="mr-1">{index + 1}.</span>
                          {module.title}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-9">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground mt-1">{course.summary}</p>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {course.category.map(cat => (
                <Badge key={cat} variant="outline">{cat}</Badge>
              ))}
              <Badge>{course.level}</Badge>
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
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                <span>{course.modules.length} modules</span>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <Tabs defaultValue="module">
            <TabsList className="mb-6">
              <TabsTrigger value="module">Current Module</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="module" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{selectedModule.title}</h2>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{formatDuration(selectedModule.duration)}</span>
                  </div>
                </div>
                
                <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                  {/* This would be replaced with a real video player in a production app */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <img 
                      src={selectedModule.thumbnailUrl || course.thumbnailUrl}
                      alt={selectedModule.title}
                      className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                    <Button className="absolute inset-0 m-auto h-16 w-16 rounded-full p-0">
                      <ChevronRight className="h-8 w-8" />
                    </Button>
                  </div>
                </div>
                
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground">{selectedModule.description}</p>
                    
                    <Separator className="my-6" />
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        {selectedModule.isCompleted ? (
                          <Badge variant="outline" className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        ) : null}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button 
                          onClick={handleModuleComplete}
                          disabled={selectedModule.isCompleted}
                        >
                          {selectedModule.isCompleted ? 'Completed' : 'Mark as Completed'}
                        </Button>
                        
                        <Button 
                          variant="outline"
                          onClick={handleNextModule}
                          disabled={course.modules.indexOf(selectedModule) === course.modules.length - 1}
                        >
                          Next Module
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* CTAs */}
                <ContentCTAContainer contentTitle={course.title} contentCTAs={mockCTAs} />
              </div>
            </TabsContent>
            
            <TabsContent value="overview">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Course Overview</h2>
                  <p className="text-muted-foreground">{course.description}</p>
                  
                  <h3 className="text-lg font-semibold mt-6 mb-2">What You'll Learn</h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    {course.modules.map(module => (
                      <li key={module.id}>{module.title}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="resources">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Course Resources</h2>
                  {selectedModule.resources && selectedModule.resources.length > 0 ? (
                    <div className="space-y-4">
                      {selectedModule.resources.map(resource => (
                        <div key={resource.id} className="flex items-start space-x-2">
                          <Badge variant="outline" className="mt-0.5">
                            {resource.type.toUpperCase()}
                          </Badge>
                          <div>
                            <a 
                              href={resource.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="font-medium hover:underline"
                            >
                              {resource.title}
                            </a>
                            {resource.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {resource.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No resources available for this module.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="faq">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
                  <p className="text-muted-foreground">No FAQs available for this course.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AnimatedTransition>
  );
}
