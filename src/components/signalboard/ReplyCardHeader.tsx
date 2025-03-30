
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Reply } from '@/types/signalboard';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  MoreHorizontal,
  Flag,
  Edit,
  Trash2,
  Clock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ReplyCardHeaderProps {
  reply: Reply;
  isAuthor: boolean;
  isAdmin: boolean;
  threadLocked: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onReport: () => void;
}

const ReplyCardHeader: React.FC<ReplyCardHeaderProps> = ({
  reply,
  isAuthor,
  isAdmin,
  threadLocked,
  onEdit,
  onDelete,
  onReport
}) => {
  return (
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-3">
        {reply.author && (
          <Avatar className="h-9 w-9">
            <AvatarImage src={reply.author.avatarUrl} alt={reply.author.name} />
            <AvatarFallback>{reply.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        )}
        
        <div>
          <p className="font-medium">{reply.author?.name}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <time dateTime={reply.createdAt} title={format(new Date(reply.createdAt), 'PPpp')}>
              {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
            </time>
          </div>
        </div>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {(isAuthor || isAdmin) && !threadLocked && (
            <>
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Reply
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Reply
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={onReport}>
            <Flag className="h-4 w-4 mr-2" />
            Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ReplyCardHeader;
