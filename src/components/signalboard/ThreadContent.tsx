
import React from 'react';
import { Tag } from 'lucide-react';
import { Thread } from '@/types/signalboard';

interface ThreadContentProps {
  thread: Thread;
}

const ThreadContent: React.FC<ThreadContentProps> = ({ thread }) => {
  return (
    <>
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
    </>
  );
};

export default ThreadContent;
