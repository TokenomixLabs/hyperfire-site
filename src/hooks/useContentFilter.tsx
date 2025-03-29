import { useState, useMemo } from 'react';
import { ContentItem } from '@/components/content-card/types';

export const useContentFilter = (items: ContentItem[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const searchMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(item.brand);
      const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(item.type);

      return searchMatch && brandMatch && typeMatch;
    });
  }, [items, searchQuery, selectedBrands, selectedTypes]);

  const allBrands = useMemo(() => {
    return [...new Set(items.map(item => item.brand))];
  }, [items]);

  const allTypes = useMemo(() => {
    return [...new Set(items.map(item => item.type))];
  }, [items]);

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
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedBrands,
    setSelectedBrands,
    selectedTypes,
    setSelectedTypes,
    filteredItems,
    allBrands,
    allTypes,
    toggleBrand,
    toggleType,
    clearFilters,
  };
};
