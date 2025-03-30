
import React from 'react';
import SearchFilterBar from '@/components/content-library/SearchFilterBar';
import FilterPanel from '@/components/content-library/FilterPanel';

interface ContentLibraryFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent<HTMLFormElement>) => void;
  activeFiltersCount: number;
  setShowFilterPanel: (show: boolean) => void;
  showFilterPanel: boolean;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  filters: {
    brand?: string;
    type?: string;
    tag?: string;
    sortOrder?: 'asc' | 'desc';
    sortBy?: 'date' | 'views' | 'title';
  };
  updateFilters: (filters: any) => void;
  clearFilters: () => void;
  availableBrands: string[];
  availableTypes: string[];
  availableTags: string[];
}

const ContentLibraryFilters: React.FC<ContentLibraryFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  activeFiltersCount,
  setShowFilterPanel,
  showFilterPanel,
  viewMode,
  setViewMode,
  sortBy,
  onSortChange,
  filters,
  updateFilters,
  clearFilters,
  availableBrands,
  availableTypes,
  availableTags
}) => {
  return (
    <>
      <SearchFilterBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        activeFiltersCount={activeFiltersCount}
        setShowFilterPanel={setShowFilterPanel}
        showFilterPanel={showFilterPanel}
        viewMode={viewMode}
        setViewMode={setViewMode}
        sortBy={sortBy}
        onSortChange={onSortChange}
      />
      
      <FilterPanel 
        showFilterPanel={showFilterPanel}
        setShowFilterPanel={setShowFilterPanel}
        filters={filters}
        updateFilters={updateFilters}
        clearFilters={clearFilters}
        availableBrands={availableBrands}
        availableTypes={availableTypes}
        availableTags={availableTags}
      />
    </>
  );
};

export default ContentLibraryFilters;
