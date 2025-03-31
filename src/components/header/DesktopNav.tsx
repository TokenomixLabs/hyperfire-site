
import React from 'react';
import { useLocation } from 'react-router-dom';
import NavigationLink from './NavigationLink';
import { Home, MessageSquare, BookOpen, BarChart2, User, Compass, LineChart } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const DesktopNav = () => {
  const location = useLocation();
  
  const navLinks = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/content', label: 'Signal Library', icon: LineChart },
    { path: '/signalboard', label: 'SignalBoard', icon: MessageSquare },
    { path: '/learn', label: 'Education Hub', icon: BookOpen },
    { path: '/explore', label: 'Explore', icon: Compass },
    { path: '/profile', label: 'Profile', icon: User },
  ];
  
  return (
    <TooltipProvider>
      <nav className="hidden md:flex items-center space-x-1">
        {navLinks.map((link) => (
          <Tooltip key={link.path}>
            <TooltipTrigger asChild>
              <div>
                <NavigationLink 
                  to={link.path}
                  label={link.label}
                  icon={<link.icon className="h-4 w-4" />}
                  isActive={location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path))}
                  className="px-3 py-2 text-sm font-medium rounded-md"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{link.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </nav>
    </TooltipProvider>
  );
};

export default DesktopNav;
