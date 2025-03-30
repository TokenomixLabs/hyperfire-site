
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid2X2, List, Search, SlidersHorizontal, Tag } from 'lucide-react';
import AnimatedTransition from "@/components/AnimatedTransition";
import { SignalLibraryItem, SignalLibraryView, SignalLibrarySortBy } from '@/types/signalLibrary';
import SignalSeriesCard from '@/components/signal/SignalSeriesCard';
import { useAuth } from '@/context/AuthContext';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";

// Mock data for demonstration purposes
const mockSignalLibrary: SignalLibraryItem[] = [
  {
    id: "signal-1",
    name: "AI Freedom Roadmap",
    slug: "ai-freedom-roadmap",
    description: "Master AI tools and build your freedom business in 5 simple steps",
    contentType: "mixed",
    thumbnailUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    featuredImageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    createdBy: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: true,
    steps: [],
    isDuplicated: false,
    stats: {
      views: 1456,
      ctaClicks: 328,
      conversions: 42,
      shares: 86
    },
    tags: ["AI", "Business", "Freedom"],
    duplicationsCount: 78,
    featured: true,
    aiSummary: {
      summary: "A comprehensive guide to leveraging AI tools for your freedom business.",
      guardianAware: true,
      guardianCommentary: "This series is essential for anyone looking to start in the AI space."
    }
  },
  {
    id: "signal-2",
    name: "Crypto Investing Fundamentals",
    slug: "crypto-investing-fundamentals",
    description: "Learn the foundational principles of cryptocurrency investing",
    contentType: "video",
    thumbnailUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    featuredImageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    createdBy: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: true,
    steps: [],
    isDuplicated: false,
    stats: {
      views: 2387,
      ctaClicks: 542,
      conversions: 78,
      shares: 134
    },
    tags: ["Crypto", "Investing", "Finance"],
    duplicationsCount: 56,
    featured: false
  },
  {
    id: "signal-3",
    name: "Digital Sovereignty Guide",
    slug: "digital-sovereignty-guide",
    description: "Take control of your digital life and protect your privacy online",
    contentType: "article",
    thumbnailUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    featuredImageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    createdBy: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: true,
    steps: [],
    isDuplicated: false,
    stats: {
      views: 1854,
      ctaClicks: 423,
      conversions: 62,
      shares: 97
    },
    tags: ["Sovereignty", "Privacy", "Security"],
    duplicationsCount: 34,
    featured: true
  }
];

// Get all unique tags from the signal library
const getAllTags = (items: SignalLibraryItem[]): string[] => {
  const tagsSet = new Set<string>();
  
  items.forEach(item => {
    if (item.tags) {
      item.tags.forEach(tag => tagsSet.add(tag));
    }
  });
  
  return Array.from(tagsSet);
};

const SignalLibrary: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [view, setView] = useState<SignalLibraryView>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SignalLibrarySortBy>('featured');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filteredSeries, setFilteredSeries] = useState<SignalLibraryItem[]>(mockSignalLibrary);
  
  const availableTags = getAllTags(mockSignalLibrary);
  
  // Handle search and filtering
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    applyFilters(term, selectedTags, sortBy);
  };
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      const newTags = prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag];
      
      applyFilters(searchTerm, newTags, sortBy);
      return newTags;
    });
  };
  
  const applySorting = (sort: SignalLibrarySortBy) => {
    setSortBy(sort);
    applyFilters(searchTerm, selectedTags, sort);
  };
  
  const applyFilters = (search: string, tags: string[], sort: SignalLibrarySortBy) => {
    let filtered = [...mockSignalLibrary];
    
    // Apply search filter
    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(lowerSearch) ||
        item.description.toLowerCase().includes(lowerSearch) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(lowerSearch)))
      );
    }
    
    // Apply tag filters
    if (tags.length > 0) {
      filtered = filtered.filter(item => 
        item.tags && tags.some(tag => item.tags?.includes(tag))
      );
    }
    
    // Apply sorting
    switch (sort) {
      case 'featured':
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case 'date':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'views':
        filtered.sort((a, b) => b.stats.views - a.stats.views);
        break;
      case 'duplications':
        filtered.sort((a, b) => b.duplicationsCount - a.duplicationsCount);
        break;
    }
    
    setFilteredSeries(filtered);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setSortBy('featured');
    setFilteredSeries(mockSignalLibrary);
  };
  
  const handleViewSeries = (slug: string) => {
    navigate(`/signal/${slug}`);
  };

  return (
    <AnimatedTransition className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Signal Library</h1>
          <p className="text-muted-foreground">
            Explore our collection of educational Signal Series to grow your skills
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search signals..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem 
                  checked={sortBy === 'featured'}
                  onCheckedChange={() => applySorting('featured')}
                >
                  Featured
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem 
                  checked={sortBy === 'date'}
                  onCheckedChange={() => applySorting('date')}
                >
                  Most Recent
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem 
                  checked={sortBy === 'views'}
                  onCheckedChange={() => applySorting('views')}
                >
                  Most Viewed
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem 
                  checked={sortBy === 'duplications'}
                  onCheckedChange={() => applySorting('duplications')}
                >
                  Most Duplicated
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={clearFilters}>
                  Clear Filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  <span className="hidden sm:inline">Tags</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter by Tags</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {availableTags.map(tag => (
                  <DropdownMenuCheckboxItem 
                    key={tag}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={() => toggleTag(tag)}
                  >
                    {tag}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="border rounded-md flex">
              <Button
                variant={view === 'grid' ? "default" : "ghost"}
                size="icon"
                className="rounded-none rounded-l-md"
                onClick={() => setView('grid')}
                aria-label="Grid view"
              >
                <Grid2X2 className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" />
              <Button
                variant={view === 'list' ? "default" : "ghost"}
                size="icon"
                className="rounded-none rounded-r-md"
                onClick={() => setView('list')}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tag => (
              <Badge 
                key={tag} 
                variant="secondary"
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => toggleTag(tag)}
              >
                {tag}
                <span className="ml-1">×</span>
              </Badge>
            ))}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-xs h-6"
            >
              Clear All
            </Button>
          </div>
        )}
        
        {filteredSeries.length === 0 ? (
          <div className="py-12 text-center">
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
              No Signal Series Found
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Try adjusting your search or filters
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={
            view === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "flex flex-col space-y-4"
          }>
            {filteredSeries.map(series => (
              <SignalSeriesCard 
                key={series.id}
                series={series}
                view={view}
                onView={() => handleViewSeries(series.slug)}
              />
            ))}
          </div>
        )}
      </div>
    </AnimatedTransition>
  );
};

export default SignalLibrary;
