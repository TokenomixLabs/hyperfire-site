
import React, { useState, useEffect } from 'react';
import { Signal, Copy, Users, MessageSquare, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileStatsProps {
  userId: string;
}

interface UserStats {
  duplicatedSeries: number;
  totalCtaClicks: number;
  referredUsers: number;
  threadsCreated: number;
  signalStrength: number;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ userId }) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      
      try {
        // Real API call to fetch user stats
        const response = await fetch(`/api/users/${userId}/stats`);
        
        if (!response.ok) {
          throw new Error('Failed to load user stats');
        }
        
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching user stats:', err);
        setError('Failed to load stats');
        
        toast({
          title: "Error",
          description: "Failed to load user statistics",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (userId) {
      fetchStats();
    }
  }, [userId, toast]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900 animate-pulse">
            <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-center">
        Could not load user statistics
      </div>
    );
  }

  const statsItems = [
    {
      label: 'Duplicated Series',
      value: stats.duplicatedSeries,
      icon: <Signal className="w-5 h-5 text-indigo-500" />,
    },
    {
      label: 'CTA Clicks',
      value: stats.totalCtaClicks,
      icon: <Copy className="w-5 h-5 text-blue-500" />,
    },
    {
      label: 'Referred Users',
      value: stats.referredUsers,
      icon: <Users className="w-5 h-5 text-green-500" />,
    },
    {
      label: 'Threads Created',
      value: stats.threadsCreated,
      icon: <MessageSquare className="w-5 h-5 text-amber-500" />,
    },
    {
      label: 'Signal Strength',
      value: stats.signalStrength,
      icon: <Zap className="w-5 h-5 text-purple-500" />,
    },
  ];

  return (
    <div className="space-y-4">
      {statsItems.map((stat, index) => (
        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center">
            <div className="mr-3">{stat.icon}</div>
            <span className="text-sm text-gray-700 dark:text-gray-300">{stat.label}</span>
          </div>
          <span className="font-bold">{stat.value}</span>
        </div>
      ))}
    </div>
  );
};

export default ProfileStats;
