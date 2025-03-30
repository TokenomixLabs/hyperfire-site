
import { useState, useEffect } from 'react';
import AnimatedTransition from '@/components/AnimatedTransition';
import Header from '@/components/Header';
import GlobalCTA from '@/components/GlobalCTA';
import { useContentFilter } from '@/hooks/useContentFilter';
import { contentData } from '@/data/contentLibraryData';
import ContentLibraryHeader from './ContentLibraryHeader';
import ContentLibraryFilters from './ContentLibraryFilters';
import ContentLibraryTabs from './ContentLibraryTabs';

const ContentLibrary = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    filteredContent,
    filters,
    updateFilters,
    clearFilters,
    availableBrands,
    availableTypes,
    availableTags
  } = useContentFilter(contentData);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateFilters({ search: searchQuery });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.brand && filters.brand !== 'all') count++;
    if (filters.type && filters.type !== 'all') count++;
    if (filters.tag && filters.tag !== 'all') count++;
    if (filters.search) count++;
    if (filters.sortBy) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <AnimatedTransition>
          <div className="container mx-auto px-4 sm:px-6">
            <ContentLibraryHeader />
            
            <ContentLibraryFilters 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
              activeFiltersCount={activeFiltersCount}
              setShowFilterPanel={setShowFilterPanel}
              showFilterPanel={showFilterPanel}
              viewMode={viewMode}
              setViewMode={setViewMode}
              sortBy={filters.sortBy || 'date'}
              onSortChange={(value) => updateFilters({ sortBy: value as 'date' | 'views' | 'title' })}
              filters={filters}
              updateFilters={updateFilters}
              clearFilters={clearFilters}
              availableBrands={availableBrands}
              availableTypes={availableTypes}
              availableTags={availableTags}
            />
            
            <ContentLibraryTabs 
              isLoading={isLoading}
              viewMode={viewMode}
              filteredContent={filteredContent}
              clearFilters={clearFilters}
            />
            
            <section className="mt-16">
              <GlobalCTA 
                id="content-footer"
                title="Want early access to premium content?"
                description="Sign up for our waitlist to be notified when new exclusive content is available."
                buttonText="Join Waitlist"
                buttonUrl="#"
                type="card"
                theme="primary"
              />
            </section>
          </div>
        </AnimatedTransition>
      </main>
    </div>
  );
};

export default ContentLibrary;
