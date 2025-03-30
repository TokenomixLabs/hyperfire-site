
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, formatDistanceToNow } from 'date-fns';
import { Thread } from '@/types/signalboard';
import { User } from '@/types/user';
import { 
  ArrowLeft,
  Pin,
  Lock,
  Bot,
  MoreHorizontal,
  Clock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ThreadHeaderProps {
  thread: Thread;
  isAdmin: boolean;
}

const ThreadHeader: React.FC<ThreadHeaderProps> = ({ thread, isAdmin }) => {
  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/signalboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Threads
          </Link>
        </Button>
      </div>
      
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {thread.author && (
            <Avatar className="h-10 w-10">
              <AvatarImage src={thread.author.avatarUrl} alt={thread.author.name} />
              <AvatarFallback>{thread.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          )}
          
          <div>
            <p className="font-medium">{thread.author?.name}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <time dateTime={thread.createdAt} title={format(new Date(thread.createdAt), 'PPpp')}>
                {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
              </time>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {thread.isPinned && (
            <div className="text-primary text-sm flex items-center mr-2">
              <Pin className="h-4 w-4 mr-1" />
              Pinned
            </div>
          )}
          
          {thread.isLocked && (
            <div className="text-amber-500 text-sm flex items-center mr-2">
              <Lock className="h-4 w-4 mr-1" />
              Locked
            </div>
          )}
          
          {thread.guardianAware && (
            <div className="text-purple-500 text-sm flex items-center mr-2">
              <Bot className="h-4 w-4 mr-1" />
              AI-Enhanced
            </div>
          )}
          
          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  {thread.isPinned ? (
                    <>Unpin Thread</>
                  ) : (
                    <>Pin Thread</>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {thread.isLocked ? (
                    <>Unlock Thread</>
                  ) : (
                    <>Lock Thread</>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  Delete Thread
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </>
  );
};

export default ThreadHeader;
