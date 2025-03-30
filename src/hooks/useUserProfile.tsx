
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useReferral } from '@/context/ReferralContext';
import { User, UserProfileData, UserStats } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

export const useUserProfile = (username: string) => {
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      
      try {
        // Real API call to fetch user profile
        const response = await fetch(`/api/users/profile/${username}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Profile not found');
          } else if (response.status === 403) {
            throw new Error('This profile is private');
          } else {
            throw new Error('Failed to load profile');
          }
        }
        
        const userData = await response.json();
        setProfileData(userData);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load user profile';
        setError(errorMessage);
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (username) {
      fetchUserProfile();
    }
  }, [username, toast]);
  
  return { profileData, isLoading, error };
};
