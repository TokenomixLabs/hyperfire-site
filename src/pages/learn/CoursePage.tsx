
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockCourses } from '@/data/mockCourses';
import Loading from '@/components/Loading';
import { Course } from '@/types/courses';
import { useToast } from '@/hooks/use-toast';

// This is a router component that redirects to the appropriate course page based on the course format
export default function CoursePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchCourseAndRedirect = async () => {
      if (!slug) {
        navigate('/learn');
        return;
      }
      
      // Simulate a network request
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Find the course
      const foundCourse = mockCourses.find(c => c.slug === slug);
      
      if (!foundCourse) {
        toast({
          title: "Course not found",
          description: "The course you're looking for doesn't exist.",
          variant: "destructive"
        });
        navigate('/learn', { replace: true });
        return;
      }

      setCourse(foundCourse);
      
      // Redirect based on format
      if (foundCourse.format === 'video') {
        navigate(`/learn/video/${slug}`, { replace: true });
      } else {
        // For series format, redirect to the first module if available
        if (foundCourse.modules.length > 0) {
          const firstModule = foundCourse.modules.sort((a, b) => a.order - b.order)[0];
          navigate(`/learn/series/${slug}/${firstModule.id}`, { replace: true });
        } else {
          navigate(`/learn/series/${slug}`, { replace: true });
        }
      }
      
      setIsLoading(false);
    };
    
    fetchCourseAndRedirect();
  }, [slug, navigate, toast]);
  
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Loading />
    </div>
  );
}
