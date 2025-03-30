
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, MessageSquare, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SignalboardContributionsProps {
  threads: any[]; // Will be typed properly when we know the structure
}

const SignalboardContributions: React.FC<SignalboardContributionsProps> = ({ threads }) => {
  return (
    <div className="space-y-4">
      {threads.length > 0 ? (
        threads.map((thread) => (
          <Card key={thread.id} className="overflow-hidden">
            <CardContent className="p-4">
              <Link to={`/signalboard/thread/${thread.id}`} className="hover:text-purple-600 transition-colors">
                <h3 className="font-semibold text-lg mb-2">{thread.title}</h3>
              </Link>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                {thread.content}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {thread.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <ThumbsUp className="w-4 h-4 mr-1" /> {thread.reactionCount}
                </div>
                <div className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1" /> {thread.replyCount}
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" /> {thread.viewCount}
                </div>
                <div className="ml-auto text-xs text-gray-400">
                  {new Date(thread.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No threads created yet
        </div>
      )}
    </div>
  );
};

export default SignalboardContributions;
