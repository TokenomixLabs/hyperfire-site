
import React, { useState } from 'react';
import { Calendar, Clock, ExternalLink, Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ContentItem } from './types';
import { getBrandColor, getTypeIcon } from './utils';
import ContentThumbnail from './ContentThumbnail';
import ShareMenu from './ShareMenu';

interface GridCardProps {
  item: ContentItem;
  onClick?: (item: ContentItem) => void;
}

const GridCard: React.FC<GridCardProps> = ({ item, onClick }) => {
  const [isHovering, setIsHovering] = useState(false);
  
  const handleClick = () => {
    if (onClick) {
      onClick(item);
    }
  };

  return (
    <div 
      className="glass-card overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg cursor-pointer group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
    >
      <div className="aspect-[16/9] w-full relative overflow-hidden">
        <ContentThumbnail item={item} isHovering={isHovering} layout="grid" />
        <div className="absolute top-2 left-2 right-2 flex justify-between">
          <span className={`text-xs px-2 py-0.5 rounded-full ${getBrandColor(item.brand)}`}>
            {item.brand}
          </span>
          {item.type === 'livestream' && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-600 text-white flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse mr-1.5"></span>
              Live
            </span>
          )}
          <ShareMenu 
            item={item} 
            onShareClick={(e) => e.stopPropagation()} 
            variant="default" 
          />
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            {getTypeIcon(item.type)} {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
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

export default GridCard;
