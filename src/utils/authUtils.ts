
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
    
    console.log('✅ Login successful for user:', email);
    toast({
      title: "Login successful",
      description: "Welcome back!",
    });
    
    if (foundUser.isNewUser) {
      console.log('✅ Redirecting new user to profile setup');
      navigate('/profile-setup');
    } else {
      if (userWithoutPassword.role === 'admin') {
        console.log('✅ Redirecting admin to admin dashboard');
        navigate('/admin');
      } else {
        console.log('✅ Redirecting user to dashboard');
        navigate('/dashboard');
      }
    }
  } catch (error) {
    console.error('❌ Login failed:', error);
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
  navigate: (path: string) => void,
  referralCode?: string | null
): Promise<void> => {
  try {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (storedUsers.some((u: any) => u.email === email)) {
      throw new Error('Email already in use');
    }
    
    // Create new user object with referral data if provided
    const newUser: User & { password: string } = {
      id: `user_${Date.now()}`,
      email,
      password,
      name: '',
      username: '',
      isNewUser: true,
      role: 'user',
      referredBy: referralCode || undefined,
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
    
    // Store referral data in analytics logs
    if (referralCode) {
      const referralLog = {
        timestamp: new Date().toISOString(),
        referralCode,
        newUserId: newUser.id,
        event: 'signup_with_referral'
      };
      
      // Store referral analytics
      const referralLogs = JSON.parse(localStorage.getItem('referralLogs') || '[]');
      referralLogs.push(referralLog);
      localStorage.setItem('referralLogs', JSON.stringify(referralLogs));
      console.log('✅ Referral tracking saved:', referralLog);
    }
    
    storedUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(storedUsers));
    
    const { password: _, ...userWithoutPassword } = newUser;
    
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    
    console.log('✅ Account created successfully for:', email);
    toast({
      title: "Account created",
      description: "Welcome to InsiderLife!",
    });
    
    // Redirect to profile setup
    console.log('✅ Redirecting to profile setup');
    navigate('/profile-setup');
  } catch (error) {
    console.error('❌ Signup failed:', error);
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
  
  console.log('✅ Profile updated successfully for user:', user.email);
  toast({
    title: "Profile updated",
    description: "Your profile has been successfully updated.",
  });
};

/**
 * Check if an email is already registered
 */
export const isEmailRegistered = (email: string): boolean => {
  const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
  return storedUsers.some((u: any) => u.email === email);
};

/**
 * Get all registered users (for admin purposes)
 */
export const getAllUsers = (): Omit<User, 'password'>[] => {
  const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
  return storedUsers.map(({ password, ...user }: any) => user);
};

/**
 * Get total count of users and referred users
 */
export const getUserStats = () => {
  const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
  const totalUsers = storedUsers.length;
  const referredUsers = storedUsers.filter((u: any) => u.referredBy).length;
  
  return {
    totalUsers,
    referredUsers
  };
};
