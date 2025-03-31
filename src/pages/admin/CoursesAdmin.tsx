
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, BookOpen, Play, Filter, ArrowUpDown, BarChart2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Course } from '@/types/courses';
import { mockCourses } from '@/data/mockCourses';
import { useToast } from '@/hooks/use-toast';

export default function CoursesAdmin() {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(mockCourses);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim() === '') {
      setFilteredCourses(filterCoursesByTab(courses, activeTab));
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = courses.filter(course => 
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query) ||
      course.category.some(cat => cat.toLowerCase().includes(query))
    );
    
    setFilteredCourses(filterCoursesByTab(filtered, activeTab));
  };
  
  const filterCoursesByTab = (courseList: Course[], tab: string) => {
    switch (tab) {
      case 'video':
        return courseList.filter(c => c.format === 'video');
      case 'series':
        return courseList.filter(c => c.format === 'series');
      case 'published':
        return courseList.filter(c => c.isPublished);
      case 'draft':
        return courseList.filter(c => !c.isPublished);
      case 'all':
      default:
        return courseList;
    }
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setFilteredCourses(filterCoursesByTab(courses, value));
  };
  
  const handleEdit = (course: Course) => {
    navigate(`/admin/courses/edit/${course.id}`);
  };
  
  const handleViewAnalytics = (course: Course) => {
    navigate(`/admin/courses/analytics/${course.id}`);
  };
  
  const handleCreateNew = () => {
    navigate('/admin/courses/new');
  };
  
  const handlePreview = (course: Course) => {
    navigate(`/learn/${course.slug}`);
  };
  
  const handleDelete = (course: Course) => {
    setCourseToDelete(course);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (!courseToDelete) return;
    
    // In a real app, this would be an API call to delete the course
    const updatedCourses = courses.filter(c => c.id !== courseToDelete.id);
    setCourses(updatedCourses);
    setFilteredCourses(filterCoursesByTab(updatedCourses, activeTab));
    
    toast({
      title: 'Course deleted',
      description: `"${courseToDelete.title}" has been deleted successfully`,
    });
    
    setIsDeleteDialogOpen(false);
    setCourseToDelete(null);
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (err) {
      return 'Invalid date';
    }
  };
  
  return (
    <AnimatedTransition className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Course Management</h1>
          <p className="text-muted-foreground">Create and manage courses in the Education Hub</p>
        </div>
        
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Course
        </Button>
      </div>
      
      <div className="flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-6">
          <Card>
            <CardContent className="p-4">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Search courses..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" variant="ghost">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </form>
              
              <Separator className="my-4" />
              
              <nav className="space-y-1">
                <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="w-full">
                  <TabsList className="grid grid-cols-2 mb-2">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="published">Published</TabsTrigger>
                  </TabsList>
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="video">Video</TabsTrigger>
                    <TabsTrigger value="series">Series</TabsTrigger>
                  </TabsList>
                </Tabs>
              </nav>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Courses</span>
                  <span className="font-medium">{courses.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Published</span>
                  <span className="font-medium">{courses.filter(c => c.isPublished).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Single Videos</span>
                  <span className="font-medium">{courses.filter(c => c.format === 'video').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Multi-Part Series</span>
                  <span className="font-medium">{courses.filter(c => c.format === 'series').length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  {activeTab === 'all' ? 'All Courses' : 
                   activeTab === 'published' ? 'Published Courses' : 
                   activeTab === 'draft' ? 'Draft Courses' : 
                   activeTab === 'video' ? 'Video Courses' : 
                   'Series Courses'}
                </h2>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <ArrowUpDown className="h-3.5 w-3.5 mr-2" />
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Newest First</DropdownMenuItem>
                    <DropdownMenuItem>Oldest First</DropdownMenuItem>
                    <DropdownMenuItem>Title (A-Z)</DropdownMenuItem>
                    <DropdownMenuItem>Most Viewed</DropdownMenuItem>
                    <DropdownMenuItem>Most Completed</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {filteredCourses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No courses found. Try adjusting your filters or search query.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCourses.map(course => (
                    <div 
                      key={course.id} 
                      className="flex flex-col sm:flex-row border rounded-md p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="sm:w-32 h-20 flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                        <img 
                          src={course.thumbnailUrl || '/placeholder.svg'} 
                          alt={course.title} 
                          className="h-full w-full object-cover rounded-md"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-wrap justify-between mb-1">
                          <h3 className="font-medium text-base">{course.title}</h3>
                          <div className="flex gap-1 text-sm">
                            <Badge variant={course.isPublished ? "default" : "secondary"}>
                              {course.isPublished ? "Published" : "Draft"}
                            </Badge>
                            <Badge variant="outline">
                              {course.format === 'video' ? (
                                <div className="flex items-center">
                                  <Play className="h-3 w-3 mr-1" />
                                  Video
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <BookOpen className="h-3 w-3 mr-1" />
                                  Series
                                </div>
                              )}
                            </Badge>
                            {course.isGated && (
                              <Badge variant="outline" className="text-amber-600 border-amber-600">
                                {course.accessLevel === 'premium' ? 'Premium' : course.accessLevel === 'vip' ? 'VIP' : 'Free'}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {course.summary}
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex flex-wrap gap-1">
                            {course.category.map(cat => (
                              <Badge key={cat} variant="outline" className="text-xs">
                                {cat}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center text-xs text-muted-foreground">
                            Last updated: {formatDate(course.updatedAt)}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap justify-end mt-3 space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePreview(course)}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            Preview
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewAnalytics(course)}
                          >
                            <BarChart2 className="h-3.5 w-3.5 mr-1" />
                            Analytics
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(course)}
                          >
                            <Pencil className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(course)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{courseToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AnimatedTransition>
  );
}
