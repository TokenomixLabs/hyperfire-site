
import { useState, useMemo } from 'react';
import { ContentItem } from '@/components/content-card/types';

type FilterOptions = {
  search?: string;
  brand?: string;
  type?: string;
  tag?: string;
  sortBy?: 'date' | 'views' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export const useContentFilter = (items: ContentItem[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const allBrands = useMemo(() => {
    return [...new Set(items.map(item => item.brand))];
  }, [items]);

  const allTypes = useMemo(() => {
    return [...new Set(items.map(item => item.type))];
  }, [items]);

  const allTags = useMemo(() => {
    return [...new Set(items.flatMap(item => item.tags))];
  }, [items]);

  const filteredContent = useMemo(() => {
    let filtered = [...items];

    // Apply search filter
    if (filters.search || searchQuery) {
      const search = (filters.search || searchQuery).toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        item.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    // Apply brand filter
    if (filters.brand && filters.brand !== 'all') {
      filtered = filtered.filter(item => item.brand === filters.brand);
    } else if (selectedBrands.length > 0) {
      filtered = filtered.filter(item => selectedBrands.includes(item.brand));
    }

    // Apply type filter
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(item => item.type === filters.type);
    } else if (selectedTypes.length > 0) {
      filtered = filtered.filter(item => selectedTypes.includes(item.type));
    }

    // Apply tag filter
    if (filters.tag && filters.tag !== 'all') {
      filtered = filtered.filter(item => item.tags.includes(filters.tag));
    }

    // Apply sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let comparison = 0;
        
        if (filters.sortBy === 'date') {
          comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
        } else if (filters.sortBy === 'views') {
          comparison = (b.views || 0) - (a.views || 0);
        } else if (filters.sortBy === 'title') {
          comparison = a.title.localeCompare(b.title);
        }

        return filters.sortOrder === 'asc' ? -comparison : comparison;
      });
    }

    return filtered;
  }, [items, filters, searchQuery, selectedBrands, selectedTypes]);

  const updateFilters = (newFilters: FilterOptions) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => {
      if (prev.includes(brand)) {
        return prev.filter(b => b !== brand);
      } else {
        return [...prev, brand];
      }
    });
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedBrands([]);
    setSelectedTypes([]);
    setFilters({
      sortBy: 'date',
      sortOrder: 'desc'
    });
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedBrands,
    setSelectedBrands,
    selectedTypes,
    setSelectedTypes,
    filteredItems: filteredContent,
    allBrands,
    allTypes,
    toggleBrand,
    toggleType,
    clearFilters,
    filters,
    updateFilters,
    availableBrands: allBrands,
    availableTypes: allTypes,
    availableTags: allTags,
    filteredContent
  };
};
