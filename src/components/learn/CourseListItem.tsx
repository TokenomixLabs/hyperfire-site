
import React from 'react';
import { Clock, Users, BookOpen, Play, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Course } from '@/types/courses';
import ProgressRing from './ProgressRing';

interface CourseListItemProps {
  course: Course;
  onClick: () => void;
}

export default function CourseListItem({ course, onClick }: CourseListItemProps) {
  // Format duration from seconds to minutes
  const formatDuration = (seconds: number) => {
    const minutes = Math.round(seconds / 60);
    return `${minutes} min`;
  };

  // Calculate progress percentage
  const progress = course.progress?.percentComplete || 0;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer" onClick={onClick}>
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="relative sm:w-56 h-40 sm:h-auto">
            <img 
              src={course.thumbnailUrl || '/placeholder.svg'} 
              alt={course.title} 
              className="h-full w-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <Badge variant={course.format === 'video' ? 'secondary' : 'default'}>
                {course.format === 'video' ? 'Single Video' : 'Multi-Part'}
              </Badge>
            </div>
            {course.isGated && (
              <div className="absolute top-2 left-2">
                <Badge variant="outline" className="bg-black/70 text-white border-none">
                  {course.accessLevel.toUpperCase()}
                </Badge>
              </div>
            )}
          </div>
          
          <div className="p-4 flex flex-col flex-grow">
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold text-lg">{course.title}</h3>
              {progress > 0 && (
                <ProgressRing progress={progress} size={36} />
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.summary}</p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {course.category.map(cat => (
                <Badge key={cat} variant="outline">{cat}</Badge>
              ))}
            </div>
            
            <div className="flex mt-auto items-center justify-between">
              <div className="flex space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{formatDuration(course.totalDuration)}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  <span>{course.viewCount}</span>
                </div>
                {course.modules.length > 1 && (
                  <div className="flex items-center">
                    <BookOpen className="h-3 w-3 mr-1" />
                    <span>{course.modules.length} modules</span>
                  </div>
                )}
              </div>
              
              <Button size="sm">
                {progress > 0 ? 'Continue' : 'Start Learning'}
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
