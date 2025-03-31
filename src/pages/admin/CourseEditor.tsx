
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Save, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mockCourses } from '@/data/mockCourses';
import { Course } from '@/types/courses';
import { useToast } from '@/hooks/use-toast';
import AnimatedTransition from '@/components/AnimatedTransition';
import CourseForm from '@/components/admin/courses/CourseForm';
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

export default function CourseEditor() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCloning, setIsCloning] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (courseId) {
        // Editing existing course
        const foundCourse = mockCourses.find(c => c.id === courseId);
        
        if (foundCourse) {
          setCourse(foundCourse);
        } else {
          toast({
            title: 'Course not found',
            description: 'The course you are trying to edit does not exist.',
            variant: 'destructive',
          });
          navigate('/admin/courses');
        }
      } else {
        // Creating new course
        setCourse(null);
      }
      
      setIsLoading(false);
    };
    
    fetchCourse();
  }, [courseId, navigate, toast]);
  
  const handleSave = (savedCourse: Course) => {
    // In a real app, this would be an API call
    toast({
      title: courseId ? 'Course updated' : 'Course created',
      description: courseId 
        ? 'The course has been successfully updated.' 
        : 'The new course has been successfully created.',
    });
    
    navigate('/admin/courses');
  };
  
  const handleDelete = () => {
    // In a real app, this would be an API call
    toast({
      title: 'Course deleted',
      description: 'The course has been successfully deleted.',
    });
    
    setIsDeleting(false);
    navigate('/admin/courses');
  };
  
  const handleClone = () => {
    if (!course) return;
    
    // In a real app, this would be an API call
    const clonedCourse = {
      ...course,
      id: `course-${Date.now()}`,
      title: `${course.title} (Copy)`,
      slug: `${course.slug}-copy`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0,
      completionCount: 0,
      isPublished: false,
    };
    
    toast({
      title: 'Course cloned',
      description: 'A copy of the course has been created. You are now editing the copy.',
    });
    
    setCourse(clonedCourse);
    setIsCloning(false);
  };
  
  const handleGoBack = () => {
    navigate('/admin/courses');
  };
  
  if (isLoading) {
    return (
      <AnimatedTransition className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-muted-foreground">Loading course data...</div>
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
            {courseId ? 'Edit Course' : 'Create New Course'}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {courseId && (
            <>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setIsCloning(true)}
              >
                <Copy className="h-4 w-4" />
                Clone
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2 text-destructive hover:text-destructive"
                onClick={() => setIsDeleting(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => navigate(`/learn/${course?.slug}`)}
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
            </>
          )}
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <CourseForm 
            initialCourse={course} 
            onSubmit={handleSave}
            onCancel={handleGoBack}
          />
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this course? This action cannot be undone.
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
      
      {/* Clone Confirmation Dialog */}
      <AlertDialog open={isCloning} onOpenChange={setIsCloning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clone Course</AlertDialogTitle>
            <AlertDialogDescription>
              This will create an exact copy of the course with "(Copy)" added to the title. Would you like to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClone}>
              Clone Course
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AnimatedTransition>
  );
}
