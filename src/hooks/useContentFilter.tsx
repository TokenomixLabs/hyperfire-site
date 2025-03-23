
import { useState, useEffect, useMemo } from 'react';
import { ContentItem } from '@/components/ContentCard';

interface FilterOptions {
  brand?: string;
  type?: string;
  tag?: string;
  search?: string;
  sortBy?: 'date' | 'views' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export const useContentFilter = (content: ContentItem[], initialFilters?: FilterOptions) => {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters || {});
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>(content);

  const availableBrands = useMemo(() => {
    const brands = content.map(item => item.brand);
    return Array.from(new Set(brands));
  }, [content]);

  const availableTypes = useMemo(() => {
    const types = content.map(item => item.type);
    return Array.from(new Set(types));
  }, [content]);

  const availableTags = useMemo(() => {
    const allTags = content.flatMap(item => item.tags);
    return Array.from(new Set(allTags));
  }, [content]);

  useEffect(() => {
    let result = [...content];

    // Apply brand filter
    if (filters.brand && filters.brand !== 'all') {
      result = result.filter(item => 
        item.brand.toLowerCase() === filters.brand?.toLowerCase());
    }

    // Apply type filter
    if (filters.type && filters.type !== 'all') {
      result = result.filter(item => 
        item.type.toLowerCase() === filters.type?.toLowerCase());
    }

    // Apply tag filter
    if (filters.tag && filters.tag !== 'all') {
      result = result.filter(item => 
        item.tags.some(tag => tag.toLowerCase() === filters.tag?.toLowerCase()));
    }

    // Apply search filter
    if (filters.search) {
      const searchTerms = filters.search.toLowerCase().split(' ');
      result = result.filter(item => 
        searchTerms.every(term => 
          item.title.toLowerCase().includes(term) || 
          item.description.toLowerCase().includes(term) ||
          item.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      result.sort((a, b) => {
        let comparison = 0;
        
        switch (filters.sortBy) {
          case 'date':
            comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            break;
          case 'views':
            comparison = (a.views || 0) - (b.views || 0);
            break;
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          default:
            comparison = 0;
        }
        
        return filters.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    setFilteredContent(result);
  }, [content, filters]);

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  return {
    filteredContent,
    filters,
    updateFilters,
    clearFilters,
    availableBrands,
    availableTypes,
    availableTags
  };
};
