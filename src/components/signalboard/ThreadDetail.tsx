
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { mockThreads } from '@/data/mockThreads';
import { Thread, Reply, ReactionType } from '@/types/signalboard';
import { 
  MessageCircle,
  Heart,
  Share2,
  Bookmark,
  MoreHorizontal,
  ArrowLeft,
  Pin,
  Lock,
  Bot,
  Flag,
  AlertTriangle,
  Tag,
  Clock
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import ReplyCard from './ReplyCard';
import ThreadReplyForm from './ThreadReplyForm';
import ReactionButton from './ReactionButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/signalboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Threads
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
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
          
          <h1 className="text-2xl font-bold mt-4 mb-2">{thread.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {thread.tags.map(tag => (
              <span 
                key={tag}
                className="inline-flex items-center px-2 py-1 text-xs rounded-md bg-secondary"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
          
          <div 
            className="prose prose-sm sm:prose dark:prose-invert max-w-none mb-6"
            dangerouslySetInnerHTML={{ __html: thread.content }}
          />
          
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
          
          {showReplyForm && isAuthenticated && !thread.isLocked && (
            <div className="mt-6">
              <ThreadReplyForm onSubmit={handleReplySubmit} onCancel={() => setShowReplyForm(false)} />
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Replies ({thread.replies.length})
          </h2>
          
          {thread.isLocked && (
            <div className="flex items-center text-amber-500">
              <Lock className="h-4 w-4 mr-1" />
              <span className="text-sm">This thread is locked. No new replies can be added.</span>
            </div>
          )}
        </div>
        
        {thread.replies.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                No replies yet. {!thread.isLocked && 'Be the first to reply!'}
              </p>
              
              {isAuthenticated && !thread.isLocked && (
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
          thread.replies.map(reply => (
            <ReplyCard 
              key={reply.id} 
              reply={reply}
              threadLocked={thread.isLocked}
            />
          ))
        )}
        
        {!showReplyForm && isAuthenticated && !thread.isLocked && thread.replies.length > 0 && (
          <div className="flex justify-center mt-6">
            <Button onClick={() => setShowReplyForm(true)}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Add Your Reply
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreadDetail;
