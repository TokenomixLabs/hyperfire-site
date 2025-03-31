
import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: ReactNode;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  image?: string;
  size?: 'sm' | 'md' | 'lg';
}

const EmptyState = ({ 
  title, 
  description, 
  icon, 
  actionLabel, 
  actionHref, 
  onAction,
  image,
  size = 'md'
}: EmptyStateProps) => {
  const sizeClasses = {
    sm: 'py-6 px-3',
    md: 'py-12 px-4',
    lg: 'py-16 px-6'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${sizeClasses[size]} text-center rounded-lg border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 transition-all`}>
      {image ? (
        <div className="mb-4 w-full max-w-[200px] h-auto">
          <img src={image} alt="Empty state illustration" className="w-full h-auto" />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-full mb-4 text-purple-600 dark:text-purple-400 shadow-sm">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">{description}</p>
      {(actionLabel && (actionHref || onAction)) && (
        actionHref ? (
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <Link to={actionHref}>{actionLabel}</Link>
          </Button>
        ) : (
          <Button 
            onClick={onAction} 
            className="bg-purple-600 hover:bg-purple-700"
          >
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
};

export default EmptyState;
