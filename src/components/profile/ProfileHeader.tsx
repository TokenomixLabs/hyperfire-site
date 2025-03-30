
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Calendar, Shield, Award } from 'lucide-react';
import { User } from '@/types/user';

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <Avatar className="w-24 h-24 border-2 border-purple-200">
        {user.avatarUrl ? (
          <AvatarImage src={user.avatarUrl} alt={user.name} />
        ) : (
          <AvatarFallback className="text-xl bg-purple-100 text-purple-700">
            {getInitials(user.name)}
          </AvatarFallback>
        )}
      </Avatar>
      
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          {user.isVerified && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <Shield className="w-3 h-3 mr-1" /> Verified
            </Badge>
          )}
          {user.isTopReferrer && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
              <Award className="w-3 h-3 mr-1" /> Top Referrer
            </Badge>
          )}
          {user.isFeatured && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              Featured
            </Badge>
          )}
        </div>
        
        <div className="text-gray-500 dark:text-gray-400 mb-3">@{user.username}</div>
        
        {user.bio && (
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {user.bio}
          </p>
        )}
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          {user.externalLink && (
            <a 
              href={user.externalLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center hover:text-purple-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              {user.externalLink.replace(/^https?:\/\/(www\.)?/, '')}
            </a>
          )}
          
          {user.joinDate && (
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Joined {new Date(user.joinDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
