
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { 
  Bold, 
  Italic, 
  Underline, 
  Link2, 
  Image, 
  Send,
  X
} from 'lucide-react';

interface ThreadReplyFormProps {
  onSubmit: (content: string) => void;
  onCancel: () => void;
  initialContent?: string;
  placeholder?: string;
  submitLabel?: string;
}

const ThreadReplyForm: React.FC<ThreadReplyFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialContent = '',
  placeholder = 'Write your reply...',
  submitLabel = 'Post Reply'
}) => {
  const [content, setContent] = useState(initialContent);
  const { user } = useAuth();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (content.trim() === '') return;
    
    onSubmit(content);
    setContent('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-start gap-3">
        {user && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        )}
        
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-1 p-1 bg-muted/50 rounded-md">
            <Button type="button" variant="ghost" size="sm" className="h-8 px-2">
              <Bold className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-8 px-2">
              <Italic className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-8 px-2">
              <Underline className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-8 px-2">
              <Link2 className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-8 px-2">
              <Image className="h-4 w-4" />
            </Button>
          </div>
          
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            rows={4}
            className="resize-y"
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        
        <Button 
          type="submit"
          disabled={content.trim() === ''}
        >
          <Send className="h-4 w-4 mr-2" />
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default ThreadReplyForm;
