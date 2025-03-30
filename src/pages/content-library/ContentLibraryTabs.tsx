
import React from 'react';
import ContentTabs from '@/components/content-library/ContentTabs';
import { ContentItem } from '@/components/content-card/types';

interface ContentLibraryTabsProps {
  isLoading: boolean;
  viewMode: 'grid' | 'list';
  filteredContent: ContentItem[];
  clearFilters: () => void;
}

const ContentLibraryTabs: React.FC<ContentLibraryTabsProps> = ({
  isLoading,
  viewMode,
  filteredContent,
  clearFilters
}) => {
  return (
    <ContentTabs 
      isLoading={isLoading}
      viewMode={viewMode}
      filteredContent={filteredContent}
      clearFilters={clearFilters}
    />
  );
};

export default ContentLibraryTabs;
