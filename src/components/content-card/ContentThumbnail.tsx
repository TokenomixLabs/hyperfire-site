
import React from 'react';
import { Play } from 'lucide-react';
import { getTypeIcon } from './utils';
import { ContentItem } from './types';

interface ContentThumbnailProps {
  item: ContentItem;
  isHovering: boolean;
  layout?: 'grid' | 'list' | 'featured';
}

const ContentThumbnail: React.FC<ContentThumbnailProps> = ({ 
  item, 
  isHovering,
  layout = 'grid'
}) => {
  const getPlayButtonSize = () => {
    switch (layout) {
      case 'featured': return { size: 24, padding: 'p-4' };
      case 'list': return { size: 18, padding: 'p-2' };
      default: return { size: 16, padding: 'p-3' };
    }
  };

  const { size, padding } = getPlayButtonSize();
  
  const thumbnailClasses = layout === 'list'
    ? "w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 relative overflow-hidden"
    : "aspect-[16/9] w-full relative overflow-hidden";

  return (
    <div className={thumbnailClasses}>
      {item.thumbnail ? (
        <img 
          src={item.thumbnail} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
          {getTypeIcon(item.type)}
        </div>
      )}
      {(item.type === 'video' || item.type === 'livestream') && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`rounded-full ${padding} ${isHovering ? 'bg-primary text-white scale-110' : 'bg-black/60 text-white'} transition-all duration-300`}>
            <Play size={size} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentThumbnail;
