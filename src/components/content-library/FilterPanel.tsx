
import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterPanelProps {
  showFilterPanel: boolean;
  setShowFilterPanel: (show: boolean) => void;
  filters: {
    brand?: string;
    type?: string;
    tag?: string;
    sortOrder?: 'asc' | 'desc';
  };
  updateFilters: (filters: any) => void;
  clearFilters: () => void;
  availableBrands: string[];
  availableTypes: string[];
  availableTags: string[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  showFilterPanel,
  setShowFilterPanel,
  filters,
  updateFilters,
  clearFilters,
  availableBrands,
  availableTypes,
  availableTags
}) => {
  if (!showFilterPanel) return null;

  return (
    <div className="mb-8 glass-card rounded-lg p-6 border border-gray-200 dark:border-gray-800 animate-scale-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Filters</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowFilterPanel(false)}
          className="h-8 w-8 p-0"
        >
          <X size={16} />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Brand</label>
          <Select
            value={filters.brand || 'all'}
            onValueChange={(value) => updateFilters({ brand: value })}
          >
            <SelectTrigger className="glass-input">
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {availableBrands.map(brand => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Content Type</label>
          <Select
            value={filters.type || 'all'}
            onValueChange={(value) => updateFilters({ type: value })}
          >
            <SelectTrigger className="glass-input">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {availableTypes.map(type => (
                <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <Select
            value={filters.tag || 'all'}
            onValueChange={(value) => updateFilters({ tag: value })}
          >
            <SelectTrigger className="glass-input">
              <SelectValue placeholder="Select tag" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <SelectItem value="all">All Tags</SelectItem>
              {availableTags.map(tag => (
                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Sort Order</label>
          <Select
            value={filters.sortOrder || 'desc'}
            onValueChange={(value) => updateFilters({ sortOrder: value as 'asc' | 'desc' })}
          >
            <SelectTrigger className="glass-input">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button 
          variant="outline" 
          className="mr-2"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
        <Button 
          onClick={() => setShowFilterPanel(false)}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;
