
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentGrid from './ContentGrid';
import { ContentItem } from '@/components/content-card/types';

interface ContentTabsProps {
  isLoading: boolean;
  viewMode: 'grid' | 'list';
  filteredContent: ContentItem[];
  clearFilters: () => void;
}

const ContentTabs: React.FC<ContentTabsProps> = ({
  isLoading,
  viewMode,
  filteredContent,
  clearFilters
}) => {
  return (
    <Tabs defaultValue="all" className="mb-8">
      <TabsList className="glass-card">
        <TabsTrigger value="all">All Content</TabsTrigger>
        <TabsTrigger value="videos">Videos</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="articles">Articles</TabsTrigger>
        <TabsTrigger value="livestreams">Livestreams</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-6">
        <ContentGrid 
          isLoading={isLoading} 
          viewMode={viewMode} 
          filteredContent={filteredContent} 
          clearFilters={clearFilters}
          activeTab="all"
        />
      </TabsContent>
      
      <TabsContent value="videos" className="mt-6">
        <ContentGrid 
          isLoading={isLoading} 
          viewMode={viewMode} 
          filteredContent={filteredContent} 
          clearFilters={clearFilters}
          activeTab="videos"
        />
      </TabsContent>
      
      <TabsContent value="documents" className="mt-6">
        <ContentGrid 
          isLoading={isLoading} 
          viewMode={viewMode} 
          filteredContent={filteredContent} 
          clearFilters={clearFilters}
          activeTab="documents"
        />
      </TabsContent>
      
      <TabsContent value="articles" className="mt-6">
        <ContentGrid 
          isLoading={isLoading} 
          viewMode={viewMode} 
          filteredContent={filteredContent} 
          clearFilters={clearFilters}
          activeTab="articles"
        />
      </TabsContent>
      
      <TabsContent value="livestreams" className="mt-6">
        <ContentGrid 
          isLoading={isLoading} 
          viewMode={viewMode} 
          filteredContent={filteredContent} 
          clearFilters={clearFilters}
          activeTab="livestreams"
        />
      </TabsContent>
    </Tabs>
  );
};

export default ContentTabs;
