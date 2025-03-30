
import React from 'react';
import { useLocation } from 'react-router-dom';
import NavigationLink from './NavigationLink';

const DesktopNav = () => {
  const location = useLocation();
  
  const navLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/content', label: 'Content Library' },
    { path: '/signalboard', label: 'SignalBoard' },
    { path: '/live', label: 'Live Events' },
    { path: '/documents', label: 'Document Vault' },
  ];
  
  return (
    <nav className="hidden md:flex items-center space-x-1">
      {navLinks.map((link) => (
        <NavigationLink 
          key={link.path}
          to={link.path}
          label={link.label}
          isActive={location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path))}
          className="px-3 py-2 text-sm font-medium rounded-md"
        />
      ))}
    </nav>
  );
};

export default DesktopNav;
