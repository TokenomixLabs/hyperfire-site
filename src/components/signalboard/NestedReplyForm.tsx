
import React from 'react';
import ThreadReplyForm from './ThreadReplyForm';

interface NestedReplyFormProps {
  authorName?: string;
  onSubmit: (content: string) => void;
  onCancel: () => void;
}

const NestedReplyForm: React.FC<NestedReplyFormProps> = ({
  authorName,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="mt-4 pl-6 border-l-2 border-muted">
      <ThreadReplyForm 
        onSubmit={onSubmit} 
        onCancel={onCancel}
        placeholder={authorName ? `Reply to ${authorName}...` : 'Write your reply...'}
      />
    </div>
  );
};

export default NestedReplyForm;
