
import React, { useState } from 'react';
import { Calendar, Clock, Eye } from 'lucide-react';
import { ContentItem } from './types';
import { getBrandColor, getTypeIcon } from './utils';
import ContentThumbnail from './ContentThumbnail';
import ShareMenu from './ShareMenu';

interface FeaturedCardProps {
  item: ContentItem;
  onClick?: (item: ContentItem) => void;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ item, onClick }) => {
  const [isHovering, setIsHovering] = useState(false);
  
  const handleClick = () => {
    if (onClick) {
      onClick(item);
    }
  };

  return (
    <div 
      className="glass-card overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg cursor-pointer group relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
    >
      <div className="aspect-[16/9] w-full relative overflow-hidden">
        <ContentThumbnail item={item} isHovering={isHovering} layout="featured" />
        <div className="absolute top-3 left-3 flex space-x-2">
          <span className={`text-xs px-2 py-0.5 rounded-full ${getBrandColor(item.brand)}`}>
            {item.brand}
          </span>
          {item.type === 'livestream' && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-600 text-white flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse mr-1.5"></span>
              Live
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <ShareMenu 
            item={item} 
            onShareClick={(e) => e.stopPropagation()} 
            variant="featured"
          />
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            {getTypeIcon(item.type)} {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
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
};

export default FeaturedCard;
