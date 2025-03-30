
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Reply } from '@/types/signalboard';
import { Lock, MessageCircle } from 'lucide-react';
import ReplyCard from './ReplyCard';

interface RepliesListProps {
  replies: Reply[];
  threadLocked: boolean;
  isAuthenticated: boolean;
  showReplyForm: boolean;
  setShowReplyForm: (show: boolean) => void;
}

const RepliesList: React.FC<RepliesListProps> = ({ 
  replies,
  threadLocked,
  isAuthenticated,
  showReplyForm,
  setShowReplyForm
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Replies ({replies.length})
        </h2>
        
        {threadLocked && (
          <div className="flex items-center text-amber-500">
            <Lock className="h-4 w-4 mr-1" />
            <span className="text-sm">This thread is locked. No new replies can be added.</span>
          </div>
        )}
      </div>
      
      {replies.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              No replies yet. {!threadLocked && 'Be the first to reply!'}
            </p>
            
            {isAuthenticated && !threadLocked && (
              <Button 
                className="mt-4"
                onClick={() => setShowReplyForm(true)}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Start the Conversation
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        replies.map(reply => (
          <ReplyCard 
            key={reply.id} 
            reply={reply}
            threadLocked={threadLocked}
          />
        ))
      )}
      
      {!showReplyForm && isAuthenticated && !threadLocked && replies.length > 0 && (
        <div className="flex justify-center mt-6">
          <Button onClick={() => setShowReplyForm(true)}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Add Your Reply
          </Button>
        </div>
      )}
    </div>
  );
};

export default RepliesList;
