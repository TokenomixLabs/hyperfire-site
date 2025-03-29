
import { cn } from '@/lib/utils';
import { ContentCardProps } from './types';
import GridCard from './GridCard';
import ListCard from './ListCard';
import FeaturedCard from './FeaturedCard';

const ContentCard: React.FC<ContentCardProps> = ({ 
  item, 
  layout = 'grid',
  onClick 
}) => {
  // Render the appropriate card layout based on the layout prop
  switch (layout) {
    case 'list':
      return <ListCard item={item} onClick={onClick} />;
    case 'featured':
      return <FeaturedCard item={item} onClick={onClick} />;
    default:
      return <GridCard item={item} onClick={onClick} />;
  }
};

export default ContentCard;
