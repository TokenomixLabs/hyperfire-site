
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Reply, ReactionType } from '@/types/signalboard';
import { User } from '@/types/user';  // Import correct User type
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { 
  MessageCircle,
  MoreHorizontal,
  Flag,
  Edit,
  Trash2,
  Clock
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import ThreadReplyForm from './ThreadReplyForm';
import ReactionButton from './ReactionButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ReplyCardProps {
  reply: Reply;
  threadLocked: boolean;
}

const ReplyCard: React.FC<ReplyCardProps> = ({ reply, threadLocked }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  
  const isAuthor = user?.id === reply.authorId;
  const isAdmin = user?.role === 'admin';
  
  const handleAddReaction = (type: ReactionType) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to react to replies",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Reaction added",
      description: `You reacted with ${type} to this reply`
    });
  };
  
  const handleReplySubmit = (content: string) => {
    toast({
      title: "Reply submitted",
      description: "Your reply has been added to the thread"
    });
    setShowReplyForm(false);
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleDelete = () => {
    toast({
      title: "Reply deleted",
      description: "Your reply has been removed from the thread"
    });
  };
  
  const handleReport = () => {
    toast({
      title: "Reply reported",
      description: "Thank you for helping to keep our community safe"
    });
  };
  
  return (
    <Card>
      <CardContent className="p-5">
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
          
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {(isAuthor || isAdmin) && !threadLocked && (
                  <>
                    <DropdownMenuItem onClick={handleEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Reply
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={handleDelete}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Reply
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={handleReport}>
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        {isEditing ? (
          <ThreadReplyForm 
            onSubmit={(content) => {
              toast({
                title: "Reply updated",
                description: "Your reply has been updated"
              });
              setIsEditing(false);
            }}
            onCancel={() => setIsEditing(false)}
            initialContent={reply.content}
            submitLabel="Update"
          />
        ) : (
          <div 
            className="prose prose-sm dark:prose-invert max-w-none mt-3"
            dangerouslySetInnerHTML={{ __html: reply.content }}
          />
        )}
        
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <ReactionButton 
              type="fire" 
              count={reply.reactions.filter(r => r.type === 'fire').length}
              isActive={reply.reactions.some(r => r.type === 'fire' && r.userId === user?.id)}
              onClick={() => handleAddReaction('fire')}
              small
            />
            
            <ReactionButton 
              type="heart" 
              count={reply.reactions.filter(r => r.type === 'heart').length}
              isActive={reply.reactions.some(r => r.type === 'heart' && r.userId === user?.id)}
              onClick={() => handleAddReaction('heart')}
              small
            />
            
            <ReactionButton 
              type="thanks" 
              count={reply.reactions.filter(r => r.type === 'thanks').length}
              isActive={reply.reactions.some(r => r.type === 'thanks' && r.userId === user?.id)}
              onClick={() => handleAddReaction('thanks')}
              small
            />
            
            <ReactionButton 
              type="lightbulb" 
              count={reply.reactions.filter(r => r.type === 'lightbulb').length}
              isActive={reply.reactions.some(r => r.type === 'lightbulb' && r.userId === user?.id)}
              onClick={() => handleAddReaction('lightbulb')}
              small
            />
          </div>
          
          {!threadLocked && isAuthenticated && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Reply
            </Button>
          )}
        </div>
        
        {showReplyForm && (
          <div className="mt-4 pl-6 border-l-2 border-muted">
            <ThreadReplyForm 
              onSubmit={handleReplySubmit} 
              onCancel={() => setShowReplyForm(false)}
              placeholder={`Reply to ${reply.author?.name}...`}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReplyCard;
