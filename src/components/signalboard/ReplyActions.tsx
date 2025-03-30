
import React from 'react';
import { Button } from '@/components/ui/button';
import { Reply, ReactionType } from '@/types/signalboard';
import { User } from '@/types/user';
import { MessageCircle } from 'lucide-react';
import ReactionButton from './ReactionButton';

interface ReplyActionsProps {
  reply: Reply;
  user: User | null;
  threadLocked: boolean;
  isAuthenticated: boolean;
  showReplyForm: boolean;
  setShowReplyForm: (show: boolean) => void;
  onAddReaction: (type: ReactionType) => void;
}

const ReplyActions: React.FC<ReplyActionsProps> = ({
  reply,
  user,
  threadLocked,
  isAuthenticated,
  showReplyForm,
  setShowReplyForm,
  onAddReaction
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
      <div className="flex flex-wrap items-center gap-2">
        <ReactionButton 
          type="fire" 
          count={reply.reactions.filter(r => r.type === 'fire').length}
          isActive={reply.reactions.some(r => r.type === 'fire' && r.userId === user?.id)}
          onClick={() => onAddReaction('fire')}
          small
        />
        
        <ReactionButton 
          type="heart" 
          count={reply.reactions.filter(r => r.type === 'heart').length}
          isActive={reply.reactions.some(r => r.type === 'heart' && r.userId === user?.id)}
          onClick={() => onAddReaction('heart')}
          small
        />
        
        <ReactionButton 
          type="thanks" 
          count={reply.reactions.filter(r => r.type === 'thanks').length}
          isActive={reply.reactions.some(r => r.type === 'thanks' && r.userId === user?.id)}
          onClick={() => onAddReaction('thanks')}
          small
        />
        
        <ReactionButton 
          type="lightbulb" 
          count={reply.reactions.filter(r => r.type === 'lightbulb').length}
          isActive={reply.reactions.some(r => r.type === 'lightbulb' && r.userId === user?.id)}
          onClick={() => onAddReaction('lightbulb')}
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
  );
};

export default ReplyActions;
