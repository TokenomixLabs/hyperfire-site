
import React from 'react';
import { useLocation } from 'react-router-dom';
import NavigationLink from './NavigationLink';
import { Home, LineChart, MessageSquare, BookOpen, Compass, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

interface MobileNavProps {
  isOpen: boolean;
}

const MobileNav = ({ isOpen }: MobileNavProps) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  const navLinks = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/content', label: 'Signal Library', icon: LineChart },
    { path: '/signalboard', label: 'SignalBoard', icon: MessageSquare },
    { path: '/learn', label: 'Education Hub', icon: BookOpen },
    { path: '/explore', label: 'Explore', icon: Compass },
  ];
  
  // Add profile link only for authenticated users
  if (isAuthenticated) {
    navLinks.push({ path: '/profile', label: 'Profile', icon: User });
  }
  
  return (
    <div 
      className={`md:hidden fixed inset-x-0 top-[60px] z-20 transition-all duration-300 overflow-hidden ${
        isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div className="container mx-auto px-4 py-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 shadow-lg">
        <nav className="flex flex-col space-y-1">
          {navLinks.map((link) => (
            <NavigationLink 
              key={link.path}
              to={link.path}
              label={link.label}
              icon={<link.icon className="h-5 w-5" />}
              isActive={location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path))}
              className="py-3"
            />
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MobileNav;
