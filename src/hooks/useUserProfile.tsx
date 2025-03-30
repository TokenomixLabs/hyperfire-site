
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useReferral } from '@/context/ReferralContext';
import { User, UserProfileData, UserStats } from '@/types/user';

export const useUserProfile = (username: string) => {
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user: currentUser } = useAuth();
  const { aggregatedStats, platformStats } = useReferral();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      
      try {
        // In a real implementation, this would be an API call
        // For this mockup, we'll use the current user's data if username matches
        // or create mock data for demonstration
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let userData: User;
        
        if (currentUser && currentUser.username === username) {
          // Use current user's data
          userData = { ...currentUser };
        } else {
          // Mock data for demonstration
          const isMockAdmin = username === 'admin';
          userData = {
            id: `user_${Date.now()}`,
            name: isMockAdmin ? 'Admin User' : 'John Doe',
            email: isMockAdmin ? 'admin@example.com' : 'john@example.com',
            username: username,
            avatarUrl: isMockAdmin ? '/lovable-uploads/8655c6e0-d7ef-402e-8442-68e1fa1b706a.png' : '',
            role: isMockAdmin ? 'admin' : 'user',
            bio: isMockAdmin 
              ? 'Administrator and content creator for InsiderLife.'
              : 'Signal enthusiast and early adopter.',
            externalLink: isMockAdmin ? 'https://insiderlife.com' : 'https://twitter.com/johndoe',
            joinDate: isMockAdmin ? '2023-01-01' : '2023-06-15',
            isPublicProfile: true,
            isVerified: isMockAdmin,
            isTopReferrer: isMockAdmin,
            isFeatured: isMockAdmin,
            signalRank: isMockAdmin ? 98 : 65,
            referralLinks: {
              insiderlife: 'https://insiderlife.com/?ref=' + username,
              insiderdao: isMockAdmin ? 'https://insiderdao.com/?ref=' + username : '',
              societi: isMockAdmin ? 'https://societi.com/?ref=' + username : '',
              aifc: isMockAdmin ? 'https://aifc.com/?ref=' + username : '',
            }
          };
        }
        
        // Mock stats
        const userStats: UserStats = {
          duplicatedSeries: isMockAdmin(userData) ? 12 : 3,
          totalCtaClicks: isMockAdmin(userData) ? aggregatedStats.clicks : Math.floor(aggregatedStats.clicks / 4),
          referredUsers: isMockAdmin(userData) ? aggregatedStats.signups : Math.floor(aggregatedStats.signups / 5),
          threadsCreated: isMockAdmin(userData) ? 23 : 5,
          signalStrength: isMockAdmin(userData) ? 92 : 65
        };
        
        // Mock duplicated series
        const mockSeries = Array(userStats.duplicatedSeries).fill(0).map((_, index) => ({
          id: `series_${index}`,
          name: `Signal Series ${index + 1}`,
          slug: `signal-series-${index + 1}`,
          thumbnailUrl: index % 3 === 0 ? '/lovable-uploads/8655c6e0-d7ef-402e-8442-68e1fa1b706a.png' : '',
          createdAt: new Date(Date.now() - (index * 86400000)).toISOString(),
          createdBy: userData.username,
          stats: {
            views: Math.floor(Math.random() * 1000),
            ctaClicks: Math.floor(Math.random() * 200),
            conversions: Math.floor(Math.random() * 50),
            shares: Math.floor(Math.random() * 30)
          }
        }));
        
        // Mock threads
        const mockThreads = Array(userStats.threadsCreated).fill(0).map((_, index) => ({
          id: `thread_${index}`,
          title: `Discussion Thread ${index + 1}`,
          content: `This is a mock discussion thread about Signal Series and referral strategies. It includes some insights about growing your audience.`,
          createdAt: new Date(Date.now() - (index * 86400000)).toISOString(),
          tags: ['signal', 'referral', index % 2 === 0 ? 'strategy' : 'discussion'],
          reactionCount: Math.floor(Math.random() * 50),
          replyCount: Math.floor(Math.random() * 20),
          viewCount: Math.floor(Math.random() * 500)
        }));
        
        setProfileData({
          user: userData,
          stats: userStats,
          duplicatedSeries: mockSeries,
          signalboardThreads: mockThreads
        });
        
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (username) {
      fetchUserProfile();
    }
  }, [username, currentUser, aggregatedStats]);
  
  return { profileData, isLoading, error };
};

// Helper function to check if user is admin
function isMockAdmin(user: User): boolean {
  return user.role === 'admin' || user.username === 'admin';
}
