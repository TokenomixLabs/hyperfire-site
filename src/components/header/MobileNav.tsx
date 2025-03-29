
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MobileNavProps {
  isOpen: boolean;
}

const MobileNav = ({ isOpen }: MobileNavProps) => {
  const location = useLocation();
  
  const navLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/content', label: 'Content Library' },
    { path: '/live', label: 'Live Events' },
    { path: '/documents', label: 'Document Vault' },
  ];
  
  return (
    <div 
      className={`md:hidden transition-all duration-300 overflow-hidden ${
        isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div className="container mx-auto px-4 py-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg">
        <nav className="flex flex-col space-y-2">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path}
              className={`px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                location.pathname === link.path 
                  ? 'text-insider-700 dark:text-insider-300 bg-insider-50 dark:bg-insider-900/40' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MobileNav;
