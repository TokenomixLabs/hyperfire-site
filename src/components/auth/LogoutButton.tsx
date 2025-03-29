
import { Button, ButtonProps } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface LogoutButtonProps extends ButtonProps {
  showIcon?: boolean;
}

const LogoutButton = ({ showIcon = true, children, ...props }: LogoutButtonProps) => {
  const { logout } = useAuth();
  
  return (
    <Button 
      variant="outline" 
      onClick={logout} 
      {...props}
    >
      {showIcon && <LogOut className="w-4 h-4 mr-2" />}
      {children || "Log out"}
    </Button>
  );
};

export default LogoutButton;
