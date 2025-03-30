
import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <img 
        src="/lovable-uploads/8655c6e0-d7ef-402e-8442-68e1fa1b706a.png" 
        alt="InsiderLife Logo" 
        className="h-8 w-auto" // Reduced size from h-10 to h-8
      />
      <div className="hidden md:flex px-2 py-1 text-xs font-medium rounded-full bg-insider-100 dark:bg-insider-800 text-insider-700 dark:text-insider-300">
        CMS
      </div>
    </Link>
  );
};

export default Logo;
