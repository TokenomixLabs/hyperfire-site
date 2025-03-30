
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Copy, PlayCircle, ListPlus, Star } from 'lucide-react';
import { SignalLibraryItem, SignalLibraryView } from '@/types/signalLibrary';
import { formatDistanceToNow } from 'date-fns';

interface SignalSeriesCardProps {
  series: SignalLibraryItem;
  view: SignalLibraryView;
  onView: () => void;
}

const SignalSeriesCard: React.FC<SignalSeriesCardProps> = ({ series, view, onView }) => {
  // Extract the creator's initials for the avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  // Get the time since creation
  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "recently";
    }
  };
  
  // Determine the creator display name
  const creatorName = series.createdBy === "admin" ? "InsiderLife Team" : series.createdBy;
  
  // Format the series content type with step count
  const formatContentInfo = () => {
    const stepCount = series.steps.length;
    const stepText = stepCount === 1 ? "Step" : "Steps";
    return `${stepCount} ${stepText} · ${series.contentType.charAt(0).toUpperCase() + series.contentType.slice(1)}`;
  };
  
  if (view === 'list') {
    return (
      <Card className="overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 relative aspect-video md:aspect-auto">
            <img 
              src={series.thumbnailUrl || "/placeholder.svg"} 
              alt={series.name}
              className="w-full h-full object-cover"
            />
            {series.featured && (
              <div className="absolute top-2 left-2">
                <Badge variant="default" className="bg-amber-500 text-white border-none gap-1">
                  <Star className="h-3 w-3" /> Featured
                </Badge>
              </div>
            )}
          </div>
          
          <div className="flex flex-col flex-1 p-4">
            <div className="mb-2 flex justify-between">
              <div className="flex flex-wrap gap-2">
                {series.tags?.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">{getTimeAgo(series.createdAt)}</div>
            </div>
            
            <h3 className="text-xl font-bold mb-1">{series.name}</h3>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{series.description}</p>
            
            <div className="flex items-center gap-2 mb-3">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/avatars/01.png" alt={creatorName} />
                <AvatarFallback>{getInitials(creatorName)}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{creatorName}</span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{formatContentInfo()}</span>
            </div>
            
            <div className="mt-auto flex justify-between items-center">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" /> {series.stats.views.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <Copy className="h-4 w-4" /> {series.duplicationsCount.toLocaleString()}
                </div>
              </div>
              
              <Button onClick={onView} className="gap-1">
                <PlayCircle className="h-4 w-4" /> Watch Series
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative aspect-video">
        <img 
          src={series.thumbnailUrl || "/placeholder.svg"} 
          alt={series.name}
          className="w-full h-full object-cover"
        />
        {series.featured && (
          <div className="absolute top-2 left-2">
            <Badge variant="default" className="bg-amber-500 text-white border-none gap-1">
              <Star className="h-3 w-3" /> Featured
            </Badge>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex flex-wrap gap-2 mb-2">
          {series.tags?.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {series.tags && series.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{series.tags.length - 3} more
            </Badge>
          )}
        </div>
        
        <h3 className="text-lg font-bold">{series.name}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2">{series.description}</p>
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src="/avatars/01.png" alt={creatorName} />
            <AvatarFallback>{getInitials(creatorName)}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{creatorName}</span>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {formatContentInfo()}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between items-center border-t">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" /> {series.stats.views.toLocaleString()}
          </div>
          <div className="flex items-center gap-1">
            <Copy className="h-4 w-4" /> {series.duplicationsCount.toLocaleString()}
          </div>
        </div>
        
        <Button 
          size="sm" 
          onClick={onView}
          className="gap-1"
        >
          <PlayCircle className="h-4 w-4" /> Watch
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SignalSeriesCard;
