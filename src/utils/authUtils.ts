
/**
 * Utility functions for authentication operations
 */

import { User } from '@/types/user';
import { toast } from '@/hooks/use-toast';

/**
 * Ensures the admin account exists in localStorage
 */
export const ensureAdminExists = (): void => {
  const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
  
  // Check if admin account already exists
  const adminExists = storedUsers.some((u: any) => u.email === 'admin@insiderlife.com');
  
  if (!adminExists) {
    // Create admin account if it doesn't exist
    const adminUser = {
      id: `admin_${Date.now()}`,
      email: 'admin@insiderlife.com',
      password: '773Pdq8908$#',
      name: 'Admin User',
      username: 'admin',
      role: 'admin',
      subscription: {
        tier: 'founders'
      },
      joinDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      isVerified: true,
      referralLinks: {
        insiderlife: '',
        insiderdao: '',
        societi: '',
        aifc: ''
      }
    };
    
    storedUsers.push(adminUser);
    localStorage.setItem('users', JSON.stringify(storedUsers));
    console.log('✅ Admin account created successfully');
  } else {
    // Update admin password if account already exists
    const updatedUsers = storedUsers.map((u: any) => {
      if (u.email === 'admin@insiderlife.com') {
        console.log('✅ Admin account password updated');
        return { ...u, password: '773Pdq8908$#', role: 'admin' };
      }
      return u;
    });
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  }
};

/**
 * Login function to authenticate a user
 */
export const loginUser = async (
  email: string, 
  password: string,
  setUser: (user: User) => void,
  navigate: (path: string) => void
): Promise<void> => {
  try {
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
    
    // Make sure the role is one of the allowed values
    if (userWithoutPassword.role && !['user', 'admin', 'moderator'].includes(userWithoutPassword.role)) {
      userWithoutPassword.role = 'user';
    }
    
    setUser(userWithoutPassword as User);
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
    throw error;
  }
};

/**
 * Signup function to create a new user
 */
export const signupUser = async (
  email: string,
  password: string,
  setUser: (user: User) => void,
  navigate: (path: string) => void
): Promise<void> => {
  try {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (storedUsers.some((u: any) => u.email === email)) {
      throw new Error('Email already in use');
    }
    
    const newUser: User & { password: string } = {
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
    throw error;
  }
};

/**
 * Updates the user profile information
 */
export const updateProfile = (
  user: User,
  userData: Partial<User>,
  setUser: (user: User) => void
): void => {
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
