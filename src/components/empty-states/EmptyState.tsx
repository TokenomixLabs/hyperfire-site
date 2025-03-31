
import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: ReactNode;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

const EmptyState = ({ 
  title, 
  description, 
  icon, 
  actionLabel, 
  actionHref, 
  onAction 
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-lg border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-full mb-4 text-purple-600 dark:text-purple-400">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">{description}</p>
      {(actionLabel && (actionHref || onAction)) && (
        <Button 
          onClick={onAction} 
          className="bg-purple-600 hover:bg-purple-700"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
