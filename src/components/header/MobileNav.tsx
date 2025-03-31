
import React from 'react';
import { useLocation } from 'react-router-dom';
import NavigationLink from './NavigationLink';
import { Home, MessageSquare, BookOpen, BarChart2, User } from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
}

const MobileNav = ({ isOpen }: MobileNavProps) => {
  const location = useLocation();
  
  const navLinks = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/content', label: 'Signal Library', icon: BarChart2 },
    { path: '/signalboard', label: 'SignalBoard', icon: MessageSquare },
    { path: '/learn', label: 'Education Hub', icon: BookOpen },
    { path: '/profile', label: 'Profile', icon: User },
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
              icon={<link.icon className="h-4 w-4 mr-2" />}
              isActive={location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path))}
              className="px-4 py-3 text-sm font-medium rounded-md flex items-center"
            />
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MobileNav;
