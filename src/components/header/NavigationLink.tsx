
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface NavigationLinkProps {
  to: string;
  label: string;
  icon?: ReactNode;
  isActive: boolean;
  className?: string;
}

const NavigationLink = ({ to, label, icon, isActive, className = '' }: NavigationLinkProps) => {
  return (
    <Link 
      to={to}
      className={`flex items-center gap-2 p-2 text-sm font-medium transition-colors rounded-md ${
        isActive 
          ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/40' 
          : 'text-gray-600 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400 hover:bg-gray-100/70 dark:hover:bg-gray-800/30'
      } ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="hidden lg:inline">{label}</span>
    </Link>
  );
};

export default NavigationLink;
