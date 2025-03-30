
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Thread, ReactionType } from '@/types/signalboard';
import { User } from '@/types/user';
import { 
  MessageCircle,
  Share2,
  Bookmark
} from 'lucide-react';
import ReactionButton from './ReactionButton';

interface ThreadReactionsProps {
  thread: Thread;
  user: User | null;
  isAuthenticated: boolean;
  isBookmarked: boolean;
  showReplyForm: boolean;
  setShowReplyForm: (show: boolean) => void;
  handleToggleBookmark: () => void;
  handleAddReaction: (type: ReactionType) => void;
  handleShare: () => void;
}

const ThreadReactions: React.FC<ThreadReactionsProps> = ({ 
  thread, 
  user, 
  isAuthenticated, 
  isBookmarked,
  showReplyForm,
  setShowReplyForm,
  handleToggleBookmark,
  handleAddReaction,
  handleShare
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
      <div className="flex flex-wrap items-center gap-2">
        <ReactionButton 
          type="fire" 
          count={thread.reactions.filter(r => r.type === 'fire').length}
          isActive={thread.reactions.some(r => r.type === 'fire' && r.userId === user?.id)}
          onClick={() => handleAddReaction('fire')}
        />
        
        <ReactionButton 
          type="heart" 
          count={thread.reactions.filter(r => r.type === 'heart').length}
          isActive={thread.reactions.some(r => r.type === 'heart' && r.userId === user?.id)}
          onClick={() => handleAddReaction('heart')}
        />
        
        <ReactionButton 
          type="thanks" 
          count={thread.reactions.filter(r => r.type === 'thanks').length}
          isActive={thread.reactions.some(r => r.type === 'thanks' && r.userId === user?.id)}
          onClick={() => handleAddReaction('thanks')}
        />
        
        <ReactionButton 
          type="lightbulb" 
          count={thread.reactions.filter(r => r.type === 'lightbulb').length}
          isActive={thread.reactions.some(r => r.type === 'lightbulb' && r.userId === user?.id)}
          onClick={() => handleAddReaction('lightbulb')}
        />
        
        <ReactionButton 
          type="laugh" 
          count={thread.reactions.filter(r => r.type === 'laugh').length}
          isActive={thread.reactions.some(r => r.type === 'laugh' && r.userId === user?.id)}
          onClick={() => handleAddReaction('laugh')}
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        
        <Button 
          variant={isBookmarked ? "default" : "outline"} 
          size="sm"
          onClick={handleToggleBookmark}
        >
          <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
          {isBookmarked ? 'Bookmarked' : 'Bookmark'}
        </Button>
        
        {!thread.isLocked && (
          <Button 
            variant="default" 
            size="sm"
            onClick={() => setShowReplyForm(!showReplyForm)}
            disabled={!isAuthenticated}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Reply
          </Button>
        )}
      </div>
    </div>
  );
};

export default ThreadReactions;
