
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThreadListItem } from '@/types/signalboard';
import { MessageCircle, Heart, Eye, Pin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ThreadListItemCardProps {
  thread: ThreadListItem;
}

const ThreadListItemCard: React.FC<ThreadListItemCardProps> = ({ thread }) => {
  const {
    id,
    title,
    previewContent,
    author,
    createdAt,
    tags,
    previewImageUrl,
    isPinned,
    replyCount,
    reactionCount,
    viewCount
  } = thread;
  
  return (
    <Link to={`/signalboard/thread/${id}`}>
      <Card className={`overflow-hidden hover:shadow-md transition-shadow ${isPinned ? 'border-primary/50 bg-primary/5' : ''}`}>
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {previewImageUrl && (
              <div className="w-full md:w-1/4 h-48 md:h-auto">
                <img 
                  src={previewImageUrl} 
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className={`flex-1 p-5 ${previewImageUrl ? 'md:w-3/4' : 'w-full'}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {author && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={author.avatarUrl} alt={author.name} />
                      <AvatarFallback>{author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <p className="text-sm font-medium">{author?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                
                {isPinned && (
                  <div className="flex items-center text-primary">
                    <Pin className="h-4 w-4" />
                    <span className="text-xs ml-1">Pinned</span>
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground mb-4 line-clamp-2">{previewContent}</p>
              
              <div className="flex flex-wrap items-center justify-between mt-4">
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 text-xs rounded-md bg-secondary"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Handle tag click
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs">{replyCount}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span className="text-xs">{reactionCount}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span className="text-xs">{viewCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ThreadListItemCard;
