
import React from 'react';
import { Clock, Users, BookOpen, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Course } from '@/types/courses';
import ProgressRing from './ProgressRing';

interface CourseCardProps {
  course: Course;
  onClick: () => void;
}

export default function CourseCard({ course, onClick }: CourseCardProps) {
  // Format duration from seconds to minutes
  const formatDuration = (seconds: number) => {
    const minutes = Math.round(seconds / 60);
    return `${minutes} min`;
  };

  // Calculate progress percentage
  const progress = course.progress?.percentComplete || 0;

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all hover:shadow-md cursor-pointer" onClick={onClick}>
      <div className="relative">
        <img 
          src={course.thumbnailUrl || '/placeholder.svg'} 
          alt={course.title} 
          className="h-48 w-full object-cover"
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
        {progress > 0 && (
          <div className="absolute bottom-2 right-2">
            <ProgressRing progress={progress} size={40} />
          </div>
        )}
      </div>
      
      <CardContent className="flex flex-col flex-grow p-4">
        <div className="flex-grow">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{course.summary}</p>
        </div>
        
        <div className="flex justify-between items-center text-xs text-muted-foreground mt-auto">
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
        
        <Button className="w-full mt-4" size="sm">
          {progress > 0 ? 'Continue Learning' : 'Start Learning'}
          <Play className="h-3 w-3 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
