
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// User interface for our auth system
export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  isNewUser: boolean;
  referralLinks: {
    insiderlife: string;
    insiderdao: string;
    societi: string;
    aifc: string;
  };
}

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

// This would normally connect to an authentication service
// For now, we're using localStorage for demo purposes
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
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
      
      // This would normally validate against a backend
      // For demo, we'll check if user exists in localStorage
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = storedUsers.find((u: any) => u.email === email);
      
      if (!foundUser) {
        throw new Error('User not found');
      }
      
      if (foundUser.password !== password) {
        throw new Error('Invalid password');
      }
      
      // Remove password before storing in state
      const { password: _, ...userWithoutPassword } = foundUser;
      
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Redirect based on whether profile is complete
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
      
      // This would normally validate and create a user in a backend
      // For demo, we'll store in localStorage
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (storedUsers.some((u: any) => u.email === email)) {
        throw new Error('Email already in use');
      }
      
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        password, // In a real app, this would be hashed
        name: '',
        username: '',
        isNewUser: true,
        referralLinks: {
          insiderlife: '',
          insiderdao: '',
          societi: '',
          aifc: ''
        }
      };
      
      storedUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(storedUsers));
      
      // Remove password before storing in state
      const { password: _, ...userWithoutPassword } = newUser;
      
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Account created",
        description: "Welcome to InsiderLife!",
      });
      
      // Redirect to profile setup
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
    
    // If this is a complete profile update, mark as not new
    if (userData.name && userData.username) {
      updatedUser.isNewUser = false;
    }
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Also update in users array
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
