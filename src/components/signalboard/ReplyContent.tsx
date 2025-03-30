
import React from 'react';
import ThreadReplyForm from './ThreadReplyForm';

interface ReplyContentProps {
  content: string;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  onUpdateReply: (content: string) => void;
}

const ReplyContent: React.FC<ReplyContentProps> = ({
  content,
  isEditing,
  setIsEditing,
  onUpdateReply
}) => {
  return isEditing ? (
    <ThreadReplyForm 
      onSubmit={(updatedContent) => {
        onUpdateReply(updatedContent);
        setIsEditing(false);
      }}
      onCancel={() => setIsEditing(false)}
      initialContent={content}
      submitLabel="Update"
    />
  ) : (
    <div 
      className="prose prose-sm dark:prose-invert max-w-none mt-3"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default ReplyContent;
