
import React from 'react';
import { Signal, Copy, Users, MessageSquare, Zap } from 'lucide-react';
import { UserStats } from '@/types/user';

interface ProfileMetricsProps {
  stats: UserStats;
}

const ProfileMetrics: React.FC<ProfileMetricsProps> = ({ stats }) => {
  const metrics = [
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {metrics.map((metric, index) => (
        <div 
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center justify-center text-center"
        >
          <div className="mb-2">{metric.icon}</div>
          <div className="text-2xl font-bold mb-1">{metric.value}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</div>
        </div>
      ))}
    </div>
  );
};

export default ProfileMetrics;
