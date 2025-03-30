
import React from 'react';
import { useReferral } from '@/context/ReferralContext';
import { Signal, Copy, Users, MessageSquare, Zap } from 'lucide-react';

interface ProfileStatsProps {
  userId: string;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ userId }) => {
  const { aggregatedStats } = useReferral();
  
  // In a real implementation, we would fetch user-specific stats
  // This is a mock implementation using the ReferralContext data
  
  const stats = [
    {
      label: 'Duplicated Series',
      value: 3,  // Mock value
      icon: <Signal className="w-5 h-5 text-indigo-500" />,
    },
    {
      label: 'CTA Clicks',
      value: aggregatedStats.clicks,
      icon: <Copy className="w-5 h-5 text-blue-500" />,
    },
    {
      label: 'Referred Users',
      value: aggregatedStats.signups,
      icon: <Users className="w-5 h-5 text-green-500" />,
    },
    {
      label: 'Threads Created',
      value: 5,  // Mock value
      icon: <MessageSquare className="w-5 h-5 text-amber-500" />,
    },
    {
      label: 'Signal Strength',
      value: 78,  // Mock value
      icon: <Zap className="w-5 h-5 text-purple-500" />,
    },
  ];

  return (
    <div className="space-y-4">
      {stats.map((stat, index) => (
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
