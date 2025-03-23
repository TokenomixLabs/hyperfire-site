
import { useState } from 'react';
import { Calendar, Clock, Eye, FileText, Play, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'article' | 'livestream';
  thumbnail?: string;
  date: string;
  duration?: string;
  views?: number;
  brand: string;
  tags: string[];
  url: string;
}

interface ContentCardProps {
  item: ContentItem;
  layout?: 'grid' | 'list' | 'featured';
  onClick?: (item: ContentItem) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ 
  item, 
  layout = 'grid',
  onClick 
}) => {
  const [isHovering, setIsHovering] = useState(false);
  
  const handleClick = () => {
    if (onClick) {
      onClick(item);
    }
  };

  const getTypeIcon = () => {
    switch (item.type) {
      case 'video':
        return <Play size={14} className="mr-1" />;
      case 'document':
        return <FileText size={14} className="mr-1" />;
      case 'livestream':
        return <Clock size={14} className="mr-1" />;
      default:
        return <FileText size={14} className="mr-1" />;
    }
  };

  const getBrandColor = () => {
    switch (item.brand.toLowerCase()) {
      case 'insiderlife':
        return 'bg-insider-600 text-white';
      case 'tokenomix':
        return 'bg-blue-600 text-white';
      case 'insiderdao':
        return 'bg-purple-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  if (layout === 'list') {
    return (
      <div 
        className="glass-card overflow-hidden rounded-lg flex items-center transition-all duration-300 hover:shadow-lg cursor-pointer group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={handleClick}
      >
        <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 relative overflow-hidden">
          {item.thumbnail ? (
            <img 
              src={item.thumbnail} 
              alt={item.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
              {getTypeIcon()}
            </div>
          )}
          {item.type === 'video' || item.type === 'livestream' ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`rounded-full p-2 ${isHovering ? 'bg-primary text-white scale-110' : 'bg-black/60 text-white'} transition-all duration-300`}>
                <Play size={18} />
              </div>
            </div>
          ) : null}
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-center space-x-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${getBrandColor()}`}>
              {item.brand}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              {getTypeIcon()} {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </span>
          </div>
          <h3 className="font-medium text-balance line-clamp-1">{item.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{item.description}</p>
          <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center">
              <Calendar size={14} className="mr-1" />
              {item.date}
            </span>
            {item.duration && (
              <span className="flex items-center">
                <Clock size={14} className="mr-1" />
                {item.duration}
              </span>
            )}
            {item.views && (
              <span className="flex items-center">
                <Eye size={14} className="mr-1" />
                {item.views.toLocaleString()}
              </span>
            )}
          </div>
        </div>
        <div className="pr-4">
          <ExternalLink size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
        </div>
      </div>
    );
  }

  if (layout === 'featured') {
    return (
      <div 
        className="glass-card overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg cursor-pointer group relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={handleClick}
      >
        <div className="aspect-[16/9] w-full relative overflow-hidden">
          {item.thumbnail ? (
            <img 
              src={item.thumbnail} 
              alt={item.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
              {getTypeIcon()}
            </div>
          )}
          {item.type === 'video' || item.type === 'livestream' ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`rounded-full p-4 ${isHovering ? 'bg-primary text-white scale-110' : 'bg-black/60 text-white'} transition-all duration-300`}>
                <Play size={24} />
              </div>
            </div>
          ) : null}
          <div className="absolute top-3 left-3 flex space-x-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${getBrandColor()}`}>
              {item.brand}
            </span>
            {item.type === 'livestream' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-600 text-white flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse mr-1.5"></span>
                Live
              </span>
            )}
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              {getTypeIcon()} {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </span>
          </div>
          <h3 className="text-xl font-medium text-balance mb-2">{item.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-balance line-clamp-2">{item.description}</p>
          <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center">
              <Calendar size={16} className="mr-2" />
              {item.date}
            </span>
            {item.duration && (
              <span className="flex items-center">
                <Clock size={16} className="mr-2" />
                {item.duration}
              </span>
            )}
            {item.views && (
              <span className="flex items-center">
                <Eye size={16} className="mr-2" />
                {item.views.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default grid layout
  return (
    <div 
      className="glass-card overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg cursor-pointer group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
    >
      <div className="aspect-[16/9] w-full relative overflow-hidden">
        {item.thumbnail ? (
          <img 
            src={item.thumbnail} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
            {getTypeIcon()}
          </div>
        )}
        {item.type === 'video' || item.type === 'livestream' ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`rounded-full p-3 ${isHovering ? 'bg-primary text-white scale-110' : 'bg-black/60 text-white'} transition-all duration-300`}>
              <Play size={16} />
            </div>
          </div>
        ) : null}
        <div className="absolute top-2 left-2 right-2 flex justify-between">
          <span className={`text-xs px-2 py-0.5 rounded-full ${getBrandColor()}`}>
            {item.brand}
          </span>
          {item.type === 'livestream' && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-600 text-white flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse mr-1.5"></span>
              Live
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            {getTypeIcon()} {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </span>
        </div>
        <h3 className="font-medium text-balance line-clamp-2">{item.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{item.description}</p>
        <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center">
            <Calendar size={14} className="mr-1" />
            {item.date}
          </span>
          {item.duration && (
            <span className="flex items-center">
              <Clock size={14} className="mr-1" />
              {item.duration}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
