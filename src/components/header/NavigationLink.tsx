
import React from 'react';
import { Link } from 'react-router-dom';

interface NavigationLinkProps {
  to: string;
  label: string;
  isActive: boolean;
  className?: string;
}

const NavigationLink = ({ to, label, isActive, className = '' }: NavigationLinkProps) => {
  return (
    <Link 
      to={to}
      className={`transition-colors rounded-md ${
        isActive 
          ? 'text-insider-700 dark:text-insider-300 bg-insider-50 dark:bg-insider-900/40' 
          : 'text-gray-600 dark:text-gray-300 hover:text-insider-600 dark:hover:text-insider-400 hover:bg-gray-100/70 dark:hover:bg-gray-800/30'
      } ${className}`}
    >
      {label}
    </Link>
  );
};

export default NavigationLink;
