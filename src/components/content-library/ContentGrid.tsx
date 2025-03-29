
import React from 'react';
import ContentCard from '@/components/content-card';
import { ContentItem } from '@/components/content-card/types';
import { Button } from '@/components/ui/button';

interface ContentGridProps {
  isLoading: boolean;
  viewMode: 'grid' | 'list';
  filteredContent: ContentItem[];
  activeTab?: string;
  clearFilters: () => void;
}

const ContentGrid: React.FC<ContentGridProps> = ({
  isLoading,
  viewMode,
  filteredContent,
  activeTab = 'all',
  clearFilters
}) => {
  // Filter content by tab if needed
  const contentToDisplay = activeTab !== 'all' 
    ? filteredContent.filter(item => item.type === activeTab.slice(0, -1)) // Remove 's' from the end
    : filteredContent;

  if (isLoading) {
    return (
      <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
        {Array(activeTab === 'all' ? 6 : 3).fill(0).map((_, i) => (
          <div key={i} className={viewMode === 'grid' ? "aspect-[4/3] rounded-lg loading-shimmer" : "h-24 rounded-lg loading-shimmer"}></div>
        ))}
      </div>
    );
  }

  if (contentToDisplay.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-4">No content found matching your filters.</p>
        <Button 
          variant="outline" 
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
      {contentToDisplay.map(content => (
        <ContentCard 
          key={content.id} 
          item={content} 
          layout={viewMode}
        />
      ))}
    </div>
  );
};

export default ContentGrid;
