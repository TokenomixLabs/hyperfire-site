
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bell, User, Settings, LogOut, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LogoutButton from '@/components/auth/LogoutButton';

interface HeaderActionsProps {
  searchOpen?: boolean;
  setSearchOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ 
  searchOpen,
  setSearchOpen,
  mobileMenuOpen,
  setMobileMenuOpen,
  isDarkMode,
  toggleDarkMode
}) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/login')}>
          Log in
        </Button>
        <Button onClick={() => navigate('/signup')}>
          Sign up
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        {false && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-xs text-white">
            2
          </span>
        )}
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              {user?.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt={user.name} />
              ) : (
                <AvatarFallback>
                  {user?.name ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              )}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate(`/u/${user?.username}`)}>
            <User className="mr-2 h-4 w-4" /> View Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/profile/edit')}>
            <Edit className="mr-2 h-4 w-4" /> Edit Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/dashboard')}>
            <Settings className="mr-2 h-4 w-4" /> Dashboard
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <LogoutButton>
            <LogOut className="mr-2 h-4 w-4" /> Log out
          </LogoutButton>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default HeaderActions;
