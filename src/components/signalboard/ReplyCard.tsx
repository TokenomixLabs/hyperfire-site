
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Reply, ReactionType } from '@/types/signalboard';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import ThreadReplyForm from './ThreadReplyForm';
import ReplyCardHeader from './ReplyCardHeader';
import ReplyActions from './ReplyActions';

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
        <ReplyCardHeader 
          reply={reply}
          isAuthor={isAuthor}
          isAdmin={isAdmin}
          threadLocked={threadLocked}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReport={handleReport}
        />
        
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
        
        <ReplyActions 
          reply={reply}
          user={user}
          threadLocked={threadLocked}
          isAuthenticated={isAuthenticated}
          showReplyForm={showReplyForm}
          setShowReplyForm={setShowReplyForm}
          onAddReaction={handleAddReaction}
        />
        
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
