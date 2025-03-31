
import React from 'react';
import { useLocation } from 'react-router-dom';
import NavigationLink from './NavigationLink';
import { Home, LineChart, MessageSquare, BookOpen, Compass } from 'lucide-react';

const DesktopNav = () => {
  const location = useLocation();
  
  const navLinks = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/content', label: 'Signal Library', icon: LineChart },
    { path: '/signalboard', label: 'SignalBoard', icon: MessageSquare },
    { path: '/learn', label: 'Education Hub', icon: BookOpen },
    { path: '/explore', label: 'Explore', icon: Compass },
  ];
  
  return (
    <nav className="hidden md:flex items-center space-x-4">
      {navLinks.map((link) => (
        <NavigationLink 
          key={link.path}
          to={link.path}
          label={link.label}
          icon={<link.icon className="h-4 w-4" />}
          isActive={location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path))}
          className="px-4 py-2 text-sm font-medium rounded-md"
        />
      ))}
    </nav>
  );
};

export default DesktopNav;
