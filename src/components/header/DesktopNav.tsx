
import React from 'react';
import { useLocation } from 'react-router-dom';
import NavigationLink from './NavigationLink';
import { Home, MessageSquare, BookOpen, BarChart2, User } from 'lucide-react';

const DesktopNav = () => {
  const location = useLocation();
  
  const navLinks = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/content', label: 'Signal Library', icon: BarChart2 },
    { path: '/signalboard', label: 'SignalBoard', icon: MessageSquare },
    { path: '/learn', label: 'Education Hub', icon: BookOpen },
    { path: '/profile', label: 'Profile', icon: User },
  ];
  
  return (
    <nav className="hidden md:flex items-center space-x-1">
      {navLinks.map((link) => (
        <NavigationLink 
          key={link.path}
          to={link.path}
          label={link.label}
          icon={<link.icon className="h-4 w-4 mr-2" />}
          isActive={location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path))}
          className="px-3 py-2 text-sm font-medium rounded-md flex items-center"
        />
      ))}
    </nav>
  );
};

export default DesktopNav;
