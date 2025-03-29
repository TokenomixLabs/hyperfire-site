
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const DesktopNav = () => {
  const location = useLocation();
  
  const navLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/content', label: 'Content Library' },
    { path: '/live', label: 'Live Events' },
    { path: '/documents', label: 'Document Vault' },
  ];
  
  return (
    <nav className="hidden md:flex items-center space-x-1">
      {navLinks.map((link) => (
        <Link 
          key={link.path}
          to={link.path}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            location.pathname === link.path 
              ? 'text-insider-700 dark:text-insider-300 bg-insider-50 dark:bg-insider-900/40' 
              : 'text-gray-600 dark:text-gray-300 hover:text-insider-600 dark:hover:text-insider-400 hover:bg-gray-100/70 dark:hover:bg-gray-800/30'
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};

export default DesktopNav;
