
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { mockThreads } from '@/data/mockThreads';
import { Thread, ReactionType } from '@/types/signalboard';
import ThreadHeader from './ThreadHeader';
import ThreadContent from './ThreadContent';
import ThreadReactions from './ThreadReactions';
import RepliesList from './RepliesList';
import ThreadReplyForm from './ThreadReplyForm';

const ThreadDetail = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const [thread, setThread] = useState<Thread | null>(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    // In a real app, this would be an API call
    const foundThread = mockThreads.find(t => t.id === threadId);
    if (foundThread) {
      setThread(foundThread);
    }
  }, [threadId]);
  
  const handleAddReaction = (type: ReactionType) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to react to threads",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Reaction added",
      description: `You reacted with ${type} to this thread`
    });
  };
  
  const handleToggleBookmark = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to bookmark threads",
        variant: "destructive"
      });
      return;
    }
    
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Bookmark removed" : "Thread bookmarked",
      description: isBookmarked 
        ? "This thread has been removed from your bookmarks" 
        : "This thread has been added to your bookmarks"
    });
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: thread?.title,
        text: "Check out this thread on SignalBoard",
        url: window.location.href
      });
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied to clipboard",
        description: "You can now paste and share this thread"
      });
    }
  };
  
  const handleReplySubmit = (content: string) => {
    toast({
      title: "Reply submitted",
      description: "Your reply has been added to the thread"
    });
    setShowReplyForm(false);
  };
  
  if (!thread) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading thread...</p>
      </div>
    );
  }
  
  const isAdmin = user?.role === 'admin';
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <ThreadHeader thread={thread} isAdmin={isAdmin} />
          
          <ThreadContent thread={thread} />
          
          <ThreadReactions 
            thread={thread}
            user={user}
            isAuthenticated={isAuthenticated}
            isBookmarked={isBookmarked}
            showReplyForm={showReplyForm}
            setShowReplyForm={setShowReplyForm}
            handleToggleBookmark={handleToggleBookmark}
            handleAddReaction={handleAddReaction}
            handleShare={handleShare}
          />
          
          {showReplyForm && isAuthenticated && !thread.isLocked && (
            <div className="mt-6">
              <ThreadReplyForm 
                onSubmit={handleReplySubmit} 
                onCancel={() => setShowReplyForm(false)} 
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      <RepliesList 
        replies={thread.replies}
        threadLocked={thread.isLocked}
        isAuthenticated={isAuthenticated}
        showReplyForm={showReplyForm}
        setShowReplyForm={setShowReplyForm}
      />
    </div>
  );
};

export default ThreadDetail;
