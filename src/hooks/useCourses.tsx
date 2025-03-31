
import { useState, useEffect } from 'react';
import { Course, CourseFilters, CourseSortOption } from '@/types/courses';
import { mockCourses } from '@/data/mockCourses';

export const useCourses = (filters: CourseFilters = {}, sortOption?: CourseSortOption) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, this would be an API call with query params for filters & sorting
        // For now, we'll use the mock data and filter/sort client-side
        
        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filter courses
        let filteredCourses = [...mockCourses];
        
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredCourses = filteredCourses.filter(course => 
            course.title.toLowerCase().includes(searchLower) ||
            course.description.toLowerCase().includes(searchLower) ||
            course.summary.toLowerCase().includes(searchLower)
          );
        }
        
        if (filters.categories && filters.categories.length > 0) {
          filteredCourses = filteredCourses.filter(course => 
            filters.categories?.some(cat => course.category.includes(cat))
          );
        }
        
        if (filters.format) {
          filteredCourses = filteredCourses.filter(course => 
            course.format === filters.format
          );
        }
        
        if (filters.level) {
          filteredCourses = filteredCourses.filter(course => 
            course.level === filters.level
          );
        }
        
        if (filters.access && filters.access.length > 0) {
          filteredCourses = filteredCourses.filter(course => 
            filters.access?.includes(course.accessLevel)
          );
        }
        
        if (filters.tags && filters.tags.length > 0) {
          filteredCourses = filteredCourses.filter(course => 
            filters.tags?.some(tag => course.tags?.includes(tag))
          );
        }
        
        // Sort courses
        if (sortOption) {
          filteredCourses.sort((a, b) => {
            let valueA, valueB;
            
            switch (sortOption.value) {
              case 'newest':
                valueA = new Date(a.createdAt).getTime();
                valueB = new Date(b.createdAt).getTime();
                break;
              case 'popular':
                valueA = a.viewCount;
                valueB = b.viewCount;
                break;
              case 'title':
                valueA = a.title;
                valueB = b.title;
                break;
              case 'duration':
                valueA = a.totalDuration;
                valueB = b.totalDuration;
                break;
              default:
                return 0;
            }
            
            // Handle string comparison for title
            if (sortOption.value === 'title') {
              return sortOption.direction === 'asc' 
                ? (valueA as string).localeCompare(valueB as string)
                : (valueB as string).localeCompare(valueA as string);
            }
            
            // For number values
            return sortOption.direction === 'asc' 
              ? (valueA as number) - (valueB as number)
              : (valueB as number) - (valueA as number);
          });
        }
        
        setCourses(filteredCourses);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to fetch courses. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourses();
  }, [filters, sortOption]);
  
  return { courses, isLoading, error };
};
