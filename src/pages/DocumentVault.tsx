import { useState } from 'react';
import { Grid, List, SlidersHorizontal, X, Search, FileText } from 'lucide-react';
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

const initialDocuments: ContentItem[] = [
  {
    id: '1',
    title: 'Mastering React in 2024',
    description: 'A comprehensive guide to React best practices.',
    type: 'document',
    thumbnail: 'https://via.placeholder.com/350x200',
    date: '2024-03-15',
    brand: 'InsiderLife',
    tags: ['react', 'javascript', 'frontend'],
    url: 'https://example.com/react-guide'
  },
  {
    id: '2',
    title: 'Advanced TypeScript Patterns',
    description: 'Explore advanced patterns for TypeScript development.',
    type: 'document',
    thumbnail: 'https://via.placeholder.com/350x200',
    date: '2024-03-10',
    brand: 'Tokenomix',
    tags: ['typescript', 'programming'],
    url: 'https://example.com/typescript-patterns'
  },
  {
    id: '3',
    title: 'The Future of Web3',
    description: 'Insights into the evolving landscape of Web3 technologies.',
    type: 'document',
    thumbnail: 'https://via.placeholder.com/350x200',
    date: '2024-03-01',
    brand: 'InsiderDAO',
    tags: ['web3', 'blockchain', 'crypto'],
    url: 'https://example.com/web3-future'
  },
  {
    id: '4',
    title: 'AI Ethics and Governance',
    description: 'A deep dive into the ethical considerations of AI development.',
    type: 'document',
    thumbnail: 'https://via.placeholder.com/350x200',
    date: '2024-02-20',
    brand: 'AIFC',
    tags: ['ai', 'ethics', 'governance'],
    url: 'https://example.com/ai-ethics'
  },
  {
    id: '5',
    title: 'Building Scalable APIs with Node.js',
    description: 'Learn how to build scalable APIs using Node.js and Express.',
    type: 'document',
    thumbnail: 'https://via.placeholder.com/350x200',
    date: '2024-02-15',
    brand: 'InsiderLife',
    tags: ['node.js', 'api', 'backend'],
    url: 'https://example.com/nodejs-api'
  },
];

const DocumentVault = () => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [gridView, setGridView] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredDocuments = documents.filter(document => {
    const searchTextMatch = document.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            document.description.toLowerCase().includes(searchQuery.toLowerCase());
    const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(document.brand);
    const tagMatch = selectedTags.length === 0 || document.tags.some(tag => selectedTags.includes(tag));

    return searchTextMatch && brandMatch && tagMatch;
  });

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedTags([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <AnimatedTransition>
          <div className="max-w-7xl mx-auto">
            <div className="md:flex md:items-center md:justify-between mb-6">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Document Vault
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                  Explore our collection of documents and resources.
                </p>
              </div>
              <div className="mt-4 flex md:mt-0">
                <div className="relative rounded-md shadow-sm mr-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <Input
                    className="pl-10"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button onClick={() => setGridView(!gridView)}>
                  {gridView ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
                </Button>
                <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                  <SheetTrigger asChild>
                    <Button>
                      <SlidersHorizontal className="h-5 w-5 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="sm:max-w-sm">
                    <SheetHeader>
                      <SheetTitle>Filter Documents</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                              Brand <SlidersHorizontal className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Filter by Brand</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {[...new Set(documents.map(doc => doc.brand))].map(brand => (
                              <DropdownMenuCheckboxItem
                                key={brand}
                                checked={selectedBrands.includes(brand)}
                                onCheckedChange={() => toggleBrand(brand)}
                              >
                                {brand}
                              </DropdownMenuCheckboxItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                              Tags <SlidersHorizontal className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Filter by Tags</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {[...new Set(documents.flatMap(doc => doc.tags))].map(tag => (
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
                      </div>
                      <Button variant="secondary" className="w-full" onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {filteredDocuments.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No documents found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                  Try adjusting your search or filter options.
                </p>
              </div>
            ) : (
              <div className={gridView ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {filteredDocuments.map(item => (
                  <ContentCard key={item.id} item={item} layout={gridView ? 'grid' : 'list'} />
                ))}
              </div>
            )}
          </div>
        </AnimatedTransition>
      </main>
    </div>
  );
};

export default DocumentVault;
