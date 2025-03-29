
import React from 'react';
import { Filter, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Grid, List } from 'lucide-react';

interface SearchFilterBarProps {
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
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  activeFiltersCount,
  setShowFilterPanel,
  showFilterPanel,
  viewMode,
  setViewMode,
  sortBy,
  onSortChange
}) => {
  return (
    <div className="mb-8 flex flex-col lg:flex-row gap-4">
      <div className="flex-1">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search content..."
            className="pl-10 glass-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
      
      <div className="flex space-x-3">
        <Button
          variant="outline"
          className={`relative ${activeFiltersCount > 0 ? 'border-insider-600 text-insider-600' : ''}`}
          onClick={() => setShowFilterPanel(!showFilterPanel)}
        >
          <Filter size={16} className="mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="ml-2 px-1.5 py-0.5 text-xs font-semibold rounded-full bg-insider-100 dark:bg-insider-800 text-insider-600 dark:text-insider-300">
              {activeFiltersCount}
            </span>
          )}
        </Button>
        
        <Select
          value={sortBy}
          onValueChange={onSortChange}
        >
          <SelectTrigger className="w-[140px] glass-input">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Latest</SelectItem>
            <SelectItem value="views">Most Viewed</SelectItem>
            <SelectItem value="title">Alphabetical</SelectItem>
          </SelectContent>
        </Select>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="glass-input">
              {viewMode === 'grid' ? <Grid size={16} /> : <List size={16} />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>View Mode</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setViewMode('grid')}>
              <Grid size={16} className="mr-2" />
              Grid View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setViewMode('list')}>
              <List size={16} className="mr-2" />
              List View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default SearchFilterBar;
