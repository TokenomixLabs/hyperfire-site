
import React from 'react';
import { Course } from '@/types/courses';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import ProgressRing from './ProgressRing';
import { Play, Layers, Clock, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CourseListItemProps {
  course: Course;
  onClick: () => void;
}

export default function CourseListItem({ course, onClick }: CourseListItemProps) {
  // Calculate minutes from seconds
  const durationMinutes = Math.ceil(course.totalDuration / 60);
  
  // Determine progress if available
  const progress = course.progress?.percentComplete || 0;
  
  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" 
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="relative md:w-1/3 lg:w-1/4">
            <img 
              src={course.thumbnailUrl} 
              alt={course.title} 
              className="w-full h-48 md:h-full object-cover"
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
            
            {/* Access level badge */}
            {course.isGated && (
              <div className="absolute bottom-2 left-2">
                <Badge variant="outline" className="bg-black/70 text-white border-none hover:bg-black/70">
                  {course.accessLevel === 'premium' ? 'Premium' : course.accessLevel === 'vip' ? 'VIP' : 'Free'}
                </Badge>
              </div>
            )}
          </div>
          
          <div className="flex flex-col p-4 md:w-2/3 lg:w-3/4">
            <div className="flex flex-col md:flex-row md:justify-between">
              <div className="mb-2 md:mb-0">
                <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                <div className="flex flex-wrap gap-1 mb-2">
                  {course.category.map((cat, index) => (
                    <Badge key={index} className="bg-primary/80 hover:bg-primary">{cat}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center">
                {progress > 0 && <ProgressRing progress={progress} />}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.summary}</p>
            
            <div className="flex flex-wrap justify-between items-center mt-auto">
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-2 md:mb-0">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{durationMinutes} min</span>
                </span>
                
                <span className="inline-flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.format === 'series' ? `${course.modules.length} modules` : 'Single video'}</span>
                </span>
                
                <span className="inline-flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{course.completionCount} completed</span>
                </span>
              </div>
              
              <Button 
                variant="default" 
                className="ml-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
              >
                {progress > 0 ? 'Continue Learning' : 'Start Learning'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
