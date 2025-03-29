
import React, { useState } from 'react';
import { Calendar, Clock, Eye, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ContentItem } from './types';
import { getBrandColor, getTypeIcon } from './utils';
import ContentThumbnail from './ContentThumbnail';
import ShareMenu from './ShareMenu';

interface ListCardProps {
  item: ContentItem;
  onClick?: (item: ContentItem) => void;
}

const ListCard: React.FC<ListCardProps> = ({ item, onClick }) => {
  const [isHovering, setIsHovering] = useState(false);
  
  const handleClick = () => {
    if (onClick) {
      onClick(item);
    }
  };

  return (
    <div 
      className="glass-card overflow-hidden rounded-lg flex items-center transition-all duration-300 hover:shadow-lg cursor-pointer group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
    >
      <ContentThumbnail item={item} isHovering={isHovering} layout="list" />
      <div className="flex-1 p-4">
        <div className="flex items-center space-x-2 mb-1">
          <span className={`text-xs px-2 py-0.5 rounded-full ${getBrandColor(item.brand)}`}>
            {item.brand}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            {getTypeIcon(item.type)} {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
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
      <div className="pr-4 flex">
        <ShareMenu 
          item={item} 
          onShareClick={(e) => e.stopPropagation()} 
          variant="list"
        />
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary transition-colors" onClick={(e) => e.stopPropagation()}>
          <ExternalLink size={18} />
        </Button>
      </div>
    </div>
  );
};

export default ListCard;
