
import React from 'react';
import { Course } from '@/types/courses';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import ProgressRing from './ProgressRing';
import { Play, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CourseCardProps {
  course: Course;
  onClick: () => void;
}

export default function CourseCard({ course, onClick }: CourseCardProps) {
  // Calculate minutes from seconds
  const durationMinutes = Math.ceil(course.totalDuration / 60);
  
  // Determine progress if available
  const progress = course.progress?.percentComplete || 0;
  
  return (
    <Card className="overflow-hidden group hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <div className="relative">
        <img 
          src={course.thumbnailUrl} 
          alt={course.title} 
          className="w-full aspect-video object-cover"
        />
        
        {/* Format badge */}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="flex items-center gap-1 bg-black/70 text-white hover:bg-black/70">
            {course.format === 'video' ? (
              <>
                <Play className="h-3 w-3" />
                <span>Single Video</span>
              </>
            ) : (
              <>
                <Layers className="h-3 w-3" />
                <span>Series</span>
              </>
            )}
          </Badge>
        </div>
        
        {/* Category badge */}
        {course.category && course.category.length > 0 && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-primary/80 hover:bg-primary">{course.category[0]}</Badge>
          </div>
        )}
        
        {/* Access level badge */}
        {course.isGated && (
          <div className="absolute bottom-2 right-2">
            <Badge variant="outline" className="bg-black/70 text-white border-none hover:bg-black/70">
              {course.accessLevel === 'premium' ? 'Premium' : course.accessLevel === 'vip' ? 'VIP' : 'Free'}
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-2">{course.summary}</p>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center">
              {course.format === 'video' ? (
                <span>{durationMinutes} min</span>
              ) : (
                <span>{course.modules.length} modules</span>
              )}
            </span>
          </div>
          
          <span className="inline-flex items-center gap-1">
            <span>Level: {course.level}</span>
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 pb-4 pt-0 flex justify-between items-center">
        <Button variant="default" className="w-full" onClick={onClick}>
          {progress > 0 ? 'Continue Learning' : 'Start Learning'}
        </Button>
        
        {/* Progress indicator */}
        {progress > 0 && (
          <div className="ml-2">
            <ProgressRing progress={progress} />
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
