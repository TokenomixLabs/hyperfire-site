
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowLeft, BarChart2, PieChart as PieChartIcon, LineChart, Users, MousePointerClick } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockCourses } from '@/data/mockCourses';
import { Course, CourseAnalyticsData } from '@/types/courses';
import { useToast } from '@/hooks/use-toast';
import AnimatedTransition from '@/components/AnimatedTransition';

// Mock analytics data generator
const generateMockAnalytics = (course: Course): CourseAnalyticsData => {
  const viewsOverTime = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 50) + 1,
    };
  });
  
  const completionsOverTime = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 20) + 1,
    };
  });
  
  const moduleViews = course.modules.map(module => ({
    moduleId: module.id,
    moduleName: module.title,
    views: Math.floor(Math.random() * 200) + 50,
  }));
  
  const moduleCompletions = course.modules.map(module => ({
    moduleId: module.id,
    moduleName: module.title,
    completions: Math.floor(Math.random() * 100) + 10,
  }));
  
  const ctaClicks = Array.from({ length: Math.min(5, course.modules.length) }, (_, i) => ({
    ctaId: `cta-${i + 1}`,
    ctaName: `CTA ${i + 1}`,
    clicks: Math.floor(Math.random() * 80) + 5,
  }));
  
  const totalViews = viewsOverTime.reduce((sum, item) => sum + item.count, 0);
  const totalCompletions = completionsOverTime.reduce((sum, item) => sum + item.count, 0);
  const totalCtaClicks = ctaClicks.reduce((sum, item) => sum + item.clicks, 0);
  
  return {
    courseId: course.id,
    viewsOverTime,
    completionsOverTime,
    moduleViews,
    moduleCompletions,
    ctaClicks,
    avgCompletionRate: Math.round((totalCompletions / totalViews) * 100),
    totalViews,
    totalCompletions,
    totalCtaClicks,
  };
};

// Color array for charts
const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'];

export default function CourseAnalytics() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [analytics, setAnalytics] = useState<CourseAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchCourseAndAnalytics = async () => {
      setIsLoading(true);
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!courseId) {
        toast({
          title: 'Course ID missing',
          description: 'No course ID was provided.',
          variant: 'destructive',
        });
        navigate('/admin/courses');
        return;
      }
      
      const foundCourse = mockCourses.find(c => c.id === courseId);
      
      if (!foundCourse) {
        toast({
          title: 'Course not found',
          description: 'The requested course could not be found.',
          variant: 'destructive',
        });
        navigate('/admin/courses');
        return;
      }
      
      setCourse(foundCourse);
      
      // Generate mock analytics data
      const mockAnalytics = generateMockAnalytics(foundCourse);
      setAnalytics(mockAnalytics);
      
      setIsLoading(false);
    };
    
    fetchCourseAndAnalytics();
  }, [courseId, navigate, toast]);
  
  const handleGoBack = () => {
    navigate('/admin/courses');
  };
  
  if (isLoading) {
    return (
      <AnimatedTransition className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-muted-foreground">Loading analytics data...</div>
        </div>
      </AnimatedTransition>
    );
  }
  
  if (!course || !analytics) {
    return (
      <AnimatedTransition className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">No data available</div>
        </div>
      </AnimatedTransition>
    );
  }
  
  return (
    <AnimatedTransition className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center gap-2 mb-6">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleGoBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Course Analytics</h1>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold">{course.title}</h2>
        <p className="text-muted-foreground">{course.summary}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Views</p>
                <h3 className="text-2xl font-bold">{analytics.totalViews}</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Completions</p>
                <h3 className="text-2xl font-bold">{analytics.totalCompletions}</h3>
              </div>
              <div className="p-2 bg-green-500/10 rounded-full">
                <BarChart2 className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Completion Rate</p>
                <h3 className="text-2xl font-bold">{analytics.avgCompletionRate}%</h3>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-full">
                <PieChartIcon className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">CTA Clicks</p>
                <h3 className="text-2xl font-bold">{analytics.totalCtaClicks}</h3>
              </div>
              <div className="p-2 bg-orange-500/10 rounded-full">
                <MousePointerClick className="h-5 w-5 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="modules">Module Analytics</TabsTrigger>
          <TabsTrigger value="cta">CTA Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Views Over Time</CardTitle>
              <CardDescription>Course views over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.viewsOverTime}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => {
                      const d = new Date(date);
                      return `${d.getDate()}/${d.getMonth() + 1}`;
                    }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Views" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Completions Over Time</CardTitle>
              <CardDescription>Course completions over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.completionsOverTime}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => {
                      const d = new Date(date);
                      return `${d.getDate()}/${d.getMonth() + 1}`;
                    }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Completions" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="modules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Module Views</CardTitle>
              <CardDescription>Views per module</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.moduleViews}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="moduleName" 
                    type="category" 
                    width={150}
                    tickFormatter={(value) => 
                      value.length > 25 ? `${value.substring(0, 25)}...` : value
                    }
                  />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="views" name="Views" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Module Completions</CardTitle>
              <CardDescription>Completions per module</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.moduleCompletions}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="moduleName" 
                    type="category" 
                    width={150}
                    tickFormatter={(value) => 
                      value.length > 25 ? `${value.substring(0, 25)}...` : value
                    }
                  />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completions" name="Completions" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cta" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>CTA Performance</CardTitle>
              <CardDescription>Click performance by CTA</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.ctaClicks}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ctaName" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="clicks" name="Clicks" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>CTA Click Distribution</CardTitle>
              <CardDescription>Proportion of clicks by CTA</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.ctaClicks}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="clicks"
                    nameKey="ctaName"
                  >
                    {analytics.ctaClicks.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AnimatedTransition>
  );
}
