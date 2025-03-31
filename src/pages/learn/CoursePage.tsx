
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockCourses } from '@/data/mockCourses';
import Loading from '@/components/Loading';

// This is a router component that redirects to the appropriate course page based on the course format
export default function CoursePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  useEffect(() => {
    const redirectToProperPage = async () => {
      if (!slug) {
        navigate('/learn');
        return;
      }
      
      // Simulate a network request
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Find the course
      const course = mockCourses.find(c => c.slug === slug);
      
      if (!course) {
        navigate('/learn', { replace: true });
        return;
      }
      
      // Redirect based on format
      if (course.format === 'video') {
        navigate(`/learn/video/${slug}`, { replace: true });
      } else {
        navigate(`/learn/series/${slug}`, { replace: true });
      }
    };
    
    redirectToProperPage();
  }, [slug, navigate]);
  
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Loading />
    </div>
  );
}
