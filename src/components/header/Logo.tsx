
import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <img 
        src="/lovable-uploads/8655c6e0-d7ef-402e-8442-68e1fa1b706a.png" 
        alt="InsiderLife Logo" 
        className="h-10 w-auto"
      />
      <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-insider-700 to-insider-500 dark:from-insider-400 dark:to-insider-300">
        InsiderLife
      </span>
      <div className="hidden md:flex px-2 py-1 text-xs font-medium rounded-full bg-insider-100 dark:bg-insider-800 text-insider-700 dark:text-insider-300">
        CMS
      </div>
    </Link>
  );
};

export default Logo;
