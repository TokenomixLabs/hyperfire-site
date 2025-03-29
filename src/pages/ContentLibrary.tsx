import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Grid, List, SlidersHorizontal, X, Search, Filter, ChevronDown } from 'lucide-react';
import AnimatedTransition from '@/components/AnimatedTransition';
import Header from '@/components/Header';
import ContentCard, { ContentItem } from '@/components/ContentCard';
import { useContentFilter } from '@/hooks/useContentFilter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import GlobalCTA from '@/components/GlobalCTA';

const contentData: ContentItem[] = [
  {
    id: '1',
    title: 'Crypto Market Analysis - August Edition',
    description: 'Detailed analysis of the current crypto market trends and predictions for the coming month.',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2832&auto=format&fit=crop',
    date: 'Aug 15, 2023',
    duration: '45:22',
    views: 4500,
    brand: 'InsiderLife',
    tags: ['crypto', 'market analysis', 'bitcoin'],
    url: '#'
  },
  {
    id: '2',
    title: 'Tokenomics Fundamentals Guide',
    description: 'A comprehensive guide to understanding the basics of tokenomics and how it affects project valuation.',
    type: 'document',
    thumbnail: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2832&auto=format&fit=crop',
    date: 'July 28, 2023',
    brand: 'Tokenomix',
    tags: ['tokenomics', 'guide', 'fundamentals'],
    url: '#'
  },
  {
    id: '3',
    title: 'InsiderDAO Governance Framework',
    description: 'Learn how InsiderDAO governance works and how you can participate in community decision making.',
    type: 'article',
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop',
    date: 'Aug 10, 2023',
    views: 3200,
    brand: 'InsiderDAO',
    tags: ['dao', 'governance', 'crypto'],
    url: '#'
  },
  {
    id: '4',
    title: 'Weekly Insider Live Market Update',
    description: 'Our weekly live session covering market updates, current trends, and trading opportunities.',
    type: 'livestream',
    thumbnail: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=2940&auto=format&fit=crop',
    date: 'Aug 18, 2023',
    duration: '1:20:00',
    views: 2100,
    brand: 'InsiderLife',
    tags: ['livestream', 'market update', 'trading'],
    url: '#'
  },
  {
    id: '5',
    title: 'Understanding DeFi Liquidity Pools',
    description: 'Deep dive into DeFi liquidity pools, impermanent loss, and yield farming strategies.',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?q=80&w=2924&auto=format&fit=crop',
    date: 'Aug 5, 2023',
    duration: '38:15',
    views: 3800,
    brand: 'Tokenomix',
    tags: ['defi', 'liquidity', 'yield farming'],
    url: '#'
  },
  {
    id: '6',
    title: 'Crypto Tax Compliance Guide 2023',
    description: 'Essential information on staying compliant with crypto tax regulations and maximizing deductions.',
    type: 'document',
    thumbnail: 'https://images.unsplash.com/photo-1586486855514-8c633cc6fd48?q=80&w=2942&auto=format&fit=crop',
    date: 'July 15, 2023',
    brand: 'InsiderLife',
    tags: ['taxes', 'compliance', 'regulations'],
    url: '#'
  },
  {
    id: '7',
    title: 'NFT Market Opportunities',
    description: 'Exploring the evolving NFT landscape and identifying new market opportunities.',
    type: 'article',
    thumbnail: 'https://images.unsplash.com/photo-1646483236548-3f0374822fdd?q=80&w=2832&auto=format&fit=crop',
    date: 'Aug 12, 2023',
    views: 2900,
    brand: 'InsiderLife',
    tags: ['nft', 'opportunities', 'digital art'],
    url: '#'
  },
  {
    id: '8',
    title: 'InsiderDAO Town Hall Meeting',
    description: 'Monthly town hall meeting discussing governance proposals and community initiatives.',
    type: 'livestream',
    thumbnail: 'https://images.unsplash.com/photo-1591115765373-5207764f72e4?q=80&w=2940&auto=format&fit=crop',
    date: 'Aug 20, 2023',
    duration: '1:15:00',
    views: 1800,
    brand: 'InsiderDAO',
    tags: ['dao', 'governance', 'community'],
    url: '#'
  }
];

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
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Content Library</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Browse and discover content across all InsiderLife properties
              </p>
            </div>
            
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
                  value={filters.sortBy || 'date'}
                  onValueChange={(value) => updateFilters({ sortBy: value as 'date' | 'views' | 'title' })}
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
            
            {showFilterPanel && (
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
            )}
            
            <Tabs defaultValue="all" className="mb-8">
              <TabsList className="glass-card">
                <TabsTrigger value="all">All Content</TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="articles">Articles</TabsTrigger>
                <TabsTrigger value="livestreams">Livestreams</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                {isLoading ? (
                  <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                    {Array(6).fill(0).map((_, i) => (
                      <div key={i} className={viewMode === 'grid' ? "aspect-[4/3] rounded-lg loading-shimmer" : "h-24 rounded-lg loading-shimmer"}></div>
                    ))}
                  </div>
                ) : filteredContent.length > 0 ? (
                  <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                    {filteredContent.map(content => (
                      <ContentCard 
                        key={content.id} 
                        item={content} 
                        layout={viewMode}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No content found matching your filters.</p>
                    <Button 
                      variant="outline" 
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="videos" className="mt-6">
                {isLoading ? (
                  <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className={viewMode === 'grid' ? "aspect-[4/3] rounded-lg loading-shimmer" : "h-24 rounded-lg loading-shimmer"}></div>
                    ))}
                  </div>
                ) : (
                  <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                    {filteredContent
                      .filter(item => item.type === 'video')
                      .map(content => (
                        <ContentCard 
                          key={content.id} 
                          item={content} 
                          layout={viewMode}
                        />
                      ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="documents" className="mt-6">
                {isLoading ? (
                  <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                    {Array(2).fill(0).map((_, i) => (
                      <div key={i} className={viewMode === 'grid' ? "aspect-[4/3] rounded-lg loading-shimmer" : "h-24 rounded-lg loading-shimmer"}></div>
                    ))}
                  </div>
                ) : (
                  <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                    {filteredContent
                      .filter(item => item.type === 'document')
                      .map(content => (
                        <ContentCard 
                          key={content.id} 
                          item={content} 
                          layout={viewMode}
                        />
                      ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="articles" className="mt-6">
                {isLoading ? (
                  <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                    {Array(1).fill(0).map((_, i) => (
                      <div key={i} className={viewMode === 'grid' ? "aspect-[4/3] rounded-lg loading-shimmer" : "h-24 rounded-lg loading-shimmer"}></div>
                    ))}
                  </div>
                ) : (
                  <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                    {filteredContent
                      .filter(item => item.type === 'article')
                      .map(content => (
                        <ContentCard 
                          key={content.id} 
                          item={content} 
                          layout={viewMode}
                        />
                      ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="livestreams" className="mt-6">
                {isLoading ? (
                  <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                    {Array(2).fill(0).map((_, i) => (
                      <div key={i} className={viewMode === 'grid' ? "aspect-[4/3] rounded-lg loading-shimmer" : "h-24 rounded-lg loading-shimmer"}></div>
                    ))}
                  </div>
                ) : (
                  <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                    {filteredContent
                      .filter(item => item.type === 'livestream')
                      .map(content => (
                        <ContentCard 
                          key={content.id} 
                          item={content} 
                          layout={viewMode}
                        />
                      ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
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
