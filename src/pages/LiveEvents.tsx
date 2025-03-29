import { useState } from 'react';
import { Grid, List, SlidersHorizontal, X, Search, Calendar } from 'lucide-react';
import AnimatedTransition from '@/components/AnimatedTransition';
import Header from '@/components/Header';
import ContentCard from '@/components/content-card';
import { ContentItem } from '@/components/content-card/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const LiveEvents = () => {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleLayout = () => {
    setLayout(layout === 'grid' ? 'list' : 'grid');
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleTagChange = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedTags([]);
    setSearchQuery('');
  };

  const liveEventsContent: ContentItem[] = [
    {
      id: '1',
      title: 'Tokenomix AMA with Crypto Expert',
      description: 'Join us for an insightful AMA session with a leading crypto expert as we delve into the world of Tokenomix.',
      type: 'livestream',
      thumbnail: 'https://via.placeholder.com/350x200',
      date: '2024-08-15',
      duration: '1 hour',
      views: 5200,
      brand: 'Tokenomix',
      tags: ['ama', 'crypto', 'tokenomix'],
      url: 'https://example.com/live/tokenomix-ama',
    },
    {
      id: '2',
      title: 'InsiderLife Weekly Update',
      description: 'Get the latest news and updates from the InsiderLife team. This week, we discuss new features and upcoming events.',
      type: 'livestream',
      thumbnail: 'https://via.placeholder.com/350x200',
      date: '2024-08-14',
      duration: '45 minutes',
      views: 3800,
      brand: 'InsiderLife',
      tags: ['news', 'updates', 'insiderlife'],
      url: 'https://example.com/live/insiderlife-update',
    },
    {
      id: '3',
      title: 'InsiderDAO Community Call',
      description: 'Participate in our monthly community call to discuss the future of InsiderDAO and governance proposals.',
      type: 'livestream',
      thumbnail: 'https://via.placeholder.com/350x200',
      date: '2024-08-10',
      duration: '1.5 hours',
      views: 6100,
      brand: 'InsiderDAO',
      tags: ['community', 'dao', 'insiderdao'],
      url: 'https://example.com/live/insiderdao-call',
    },
  ];

  const filteredContent = liveEventsContent.filter((item) => {
    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm);

    const matchesBrand =
      selectedBrands.length === 0 || selectedBrands.includes(item.brand);

    const matchesTags =
      selectedTags.length === 0 || item.tags.some((tag) => selectedTags.includes(tag));

    return matchesSearch && matchesBrand && matchesTags;
  });

  const allBrands = [...new Set(liveEventsContent.map((item) => item.brand))];
  const allTags = [...new Set(liveEventsContent.flatMap((item) => item.tags))];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <Header />

      <main className="flex-1 flex flex-col px-4 py-8 sm:px-6 lg:px-8">
        <AnimatedTransition>
          <div className="container mx-auto">
            <div className="mb-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Live Events
              </h1>
              <div className="space-x-2 flex items-center">
                <Button
                  onClick={toggleLayout}
                  variant="outline"
                  className="space-x-1 rounded-md"
                >
                  {layout === 'grid' ? (
                    <>
                      <List size={16} />
                      <span>List View</span>
                    </>
                  ) : (
                    <>
                      <Grid size={16} />
                      <span>Grid View</span>
                    </>
                  )}
                </Button>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="space-x-1 rounded-md"
                    >
                      <SlidersHorizontal size={16} />
                      <span>Filters</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="sm:max-w-sm">
                    <SheetHeader>
                      <SheetTitle>Content Filters</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <h4 className="text-sm font-medium">Search</h4>
                        <div className="relative">
                          <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={16}
                          />
                          <Input
                            className="pl-10 w-full"
                            placeholder="Search live events..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium">Brands</h4>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                              Select Brands
                              <Calendar className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Filter by brand</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {allBrands.map((brand) => (
                              <DropdownMenuCheckboxItem
                                key={brand}
                                checked={selectedBrands.includes(brand)}
                                onCheckedChange={() => handleBrandChange(brand)}
                              >
                                {brand}
                              </DropdownMenuCheckboxItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium">Tags</h4>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                              Select Tags
                              <Calendar className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Filter by tag</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {allTags.map((tag) => (
                              <DropdownMenuCheckboxItem
                                key={tag}
                                checked={selectedTags.includes(tag)}
                                onCheckedChange={() => handleTagChange(tag)}
                              >
                                {tag}
                              </DropdownMenuCheckboxItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <Button onClick={clearFilters} variant="secondary" className="w-full">
                        Clear Filters
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {filteredContent.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  No live events found matching your criteria.
                </p>
              </div>
            ) : (
              <div
                className={`grid ${
                  layout === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                    : 'grid-cols-1 gap-3'
                }`}
              >
                {filteredContent.map((item) => (
                  <ContentCard key={item.id} item={item} layout={layout} />
                ))}
              </div>
            )}
          </div>
        </AnimatedTransition>
      </main>
    </div>
  );
};

export default LiveEvents;
