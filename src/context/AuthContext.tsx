
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = storedUsers.find((u: any) => u.email === email);
      
      if (!foundUser) {
        throw new Error('User not found');
      }
      
      if (foundUser.password !== password) {
        throw new Error('Invalid password');
      }
      
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Ensure user has a subscription field
      if (!userWithoutPassword.subscription) {
        userWithoutPassword.subscription = {
          tier: 'free'
        };
      }
      
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      if (foundUser.isNewUser) {
        navigate('/profile-setup');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (storedUsers.some((u: any) => u.email === email)) {
        throw new Error('Email already in use');
      }
      
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        password,
        name: '',
        username: '',
        isNewUser: true,
        role: 'user',
        referralLinks: {
          insiderlife: '',
          insiderdao: '',
          societi: '',
          aifc: ''
        },
        subscription: {
          tier: 'free'
        },
        joinDate: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      
      storedUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(storedUsers));
      
      const { password: _, ...userWithoutPassword } = newUser;
      
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Account created",
        description: "Welcome to InsiderLife!",
      });
      
      navigate('/profile-setup');
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  const updateUserProfile = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    
    if (userData.name && userData.username) {
      updatedUser.isNewUser = false;
    }
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = storedUsers.map((u: any) => {
      if (u.id === user.id) {
        return { ...u, ...userData, isNewUser: updatedUser.isNewUser };
      }
      return u;
    });
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        login, 
        signup, 
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
