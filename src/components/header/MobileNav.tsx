
import React from 'react';
import { useLocation } from 'react-router-dom';
import NavigationLink from './NavigationLink';

interface MobileNavProps {
  isOpen: boolean;
}

const MobileNav = ({ isOpen }: MobileNavProps) => {
  const location = useLocation();
  
  const navLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/content', label: 'Content Library' },
    { path: '/signalboard', label: 'SignalBoard' },
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
            <NavigationLink 
              key={link.path}
              to={link.path}
              label={link.label}
              isActive={location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path))}
              className="px-4 py-3 text-sm font-medium rounded-md"
            />
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MobileNav;
