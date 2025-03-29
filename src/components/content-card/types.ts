
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

export interface ContentCardProps {
  item: ContentItem;
  layout?: 'grid' | 'list' | 'featured';
  onClick?: (item: ContentItem) => void;
}
