
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Grid, List, SlidersHorizontal, X, Search, Filter, ChevronDown, File, FileText, Download } from 'lucide-react';
import AnimatedTransition from '@/components/AnimatedTransition';
import Header from '@/components/Header';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import DocumentViewer from '@/components/DocumentViewer';

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  size: string;
  uploadDate: string;
  lastModified: string;
  author: string;
  brand: string;
  tags: string[];
  thumbnail?: string;
  isPremium: boolean;
  downloadUrl: string;
  previewUrl?: string;
  content?: string;
}

// Mock data for demonstration
const documents: Document[] = [
  {
    id: '1',
    title: 'Tokenomics Fundamentals Guide',
    description: 'A comprehensive guide to understanding the basics of tokenomics and how it affects project valuation.',
    category: 'Guide',
    type: 'PDF',
    size: '4.2 MB',
    uploadDate: 'Aug 15, 2023',
    lastModified: 'Aug 15, 2023',
    author: 'John Smith',
    brand: 'Tokenomix',
    tags: ['tokenomics', 'guide', 'fundamentals'],
    thumbnail: 'https://images.unsplash.com/photo-1639322537228-f710d846310a',
    isPremium: false,
    downloadUrl: '#',
    previewUrl: 'https://mozilla.github.io/pdf.js/web/viewer.html?file=https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf'
  },
  {
    id: '2',
    title: 'InsiderDAO Governance Framework',
    description: 'Complete documentation on InsiderDAO governance structure and processes.',
    category: 'Documentation',
    type: 'PDF',
    size: '2.8 MB',
    uploadDate: 'Aug 10, 2023',
    lastModified: 'Aug 12, 2023',
    author: 'Sarah Johnson',
    brand: 'InsiderDAO',
    tags: ['dao', 'governance', 'framework'],
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0',
    isPremium: false,
    downloadUrl: '#'
  },
  {
    id: '3',
    title: 'Crypto Tax Compliance Guide 2023',
    description: 'Essential information on staying compliant with crypto tax regulations and maximizing deductions.',
    category: 'Guide',
    type: 'PDF',
    size: '5.6 MB',
    uploadDate: 'July 15, 2023',
    lastModified: 'July 18, 2023',
    author: 'Michael Chen',
    brand: 'InsiderLife',
    tags: ['taxes', 'compliance', 'regulations'],
    thumbnail: 'https://images.unsplash.com/photo-1586486855514-8c633cc6fd48',
    isPremium: true,
    downloadUrl: '#'
  },
  {
    id: '4',
    title: 'DeFi Yield Farming Strategies',
    description: 'Advanced strategies for DeFi yield farming across multiple protocols.',
    category: 'Strategy',
    type: 'DOCX',
    size: '3.1 MB',
    uploadDate: 'Aug 5, 2023',
    lastModified: 'Aug 7, 2023',
    author: 'Alex Williams',
    brand: 'Tokenomix',
    tags: ['defi', 'yield farming', 'strategy'],
    thumbnail: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05',
    isPremium: true,
    downloadUrl: '#'
  },
  {
    id: '5',
    title: 'NFT Market Analysis Report',
    description: 'Comprehensive analysis of the current NFT market landscape and future trends.',
    category: 'Report',
    type: 'PDF',
    size: '6.8 MB',
    uploadDate: 'Aug 12, 2023',
    lastModified: 'Aug 14, 2023',
    author: 'Emily Zhang',
    brand: 'InsiderLife',
    tags: ['nft', 'market analysis', 'trends'],
    thumbnail: 'https://images.unsplash.com/photo-1646483236548-3f0374822fdd',
    isPremium: false,
    downloadUrl: '#'
  },
  {
    id: '6',
    title: 'Blockchain Development Whitepaper',
    description: 'Technical whitepaper on advanced blockchain development techniques and best practices.',
    category: 'Whitepaper',
    type: 'PDF',
    size: '7.2 MB',
    uploadDate: 'July 28, 2023',
    lastModified: 'Aug 2, 2023',
    author: 'David Kumar',
    brand: 'InsiderDAO',
    tags: ['blockchain', 'development', 'technical'],
    thumbnail: 'https://images.unsplash.com/photo-1639515095563-31945ca7dc65',
    isPremium: true,
    downloadUrl: '#'
  },
  {
    id: '7',
    title: 'Crypto Market Cycle Analysis',
    description: 'Historical analysis of crypto market cycles with predictive models for future trends.',
    category: 'Analysis',
    type: 'PDF',
    size: '5.9 MB',
    uploadDate: 'Aug 8, 2023',
    lastModified: 'Aug 10, 2023',
    author: 'Robert Chen',
    brand: 'InsiderLife',
    tags: ['market cycle', 'analysis', 'prediction'],
    thumbnail: 'https://images.unsplash.com/photo-1605792657660-596af9009e82',
    isPremium: true,
    downloadUrl: '#'
  },
  {
    id: '8',
    title: 'Smart Contract Security Guide',
    description: 'Comprehensive guide to securing smart contracts and preventing common vulnerabilities.',
    category: 'Guide',
    type: 'PDF',
    size: '4.5 MB',
    uploadDate: 'July 20, 2023',
    lastModified: 'July 22, 2023',
    author: 'Jessica Lee',
    brand: 'Tokenomix',
    tags: ['smart contracts', 'security', 'blockchain'],
    thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3',
    isPremium: false,
    downloadUrl: '#'
  }
];

const DocumentVault = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(documents);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [activeFilter, setActiveFilter] = useState({
    brand: 'all',
    category: 'all',
    premium: 'all'
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let result = [...documents];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(doc => 
        doc.title.toLowerCase().includes(query) || 
        doc.description.toLowerCase().includes(query) ||
        doc.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply brand filter
    if (activeFilter.brand !== 'all') {
      result = result.filter(doc => doc.brand.toLowerCase() === activeFilter.brand.toLowerCase());
    }

    // Apply category filter
    if (activeFilter.category !== 'all') {
      result = result.filter(doc => doc.category.toLowerCase() === activeFilter.category.toLowerCase());
    }

    // Apply premium filter
    if (activeFilter.premium !== 'all') {
      const isPremium = activeFilter.premium === 'premium';
      result = result.filter(doc => doc.isPremium === isPremium);
    }

    setFilteredDocuments(result);
  }, [searchQuery, activeFilter]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setActiveFilter({
      brand: 'all',
      category: 'all',
      premium: 'all'
    });
    setSearchQuery('');
  };

  const handleDocumentClick = (document: Document) => {
    setCurrentDocument(document);
    setShowDocumentViewer(true);
  };

  const handleDownload = (document: Document) => {
    if (document.isPremium) {
      toast({
        title: "Premium Content",
        description: "Please upgrade your account to download premium documents.",
        duration: 5000,
      });
    } else {
      toast({
        title: "Download Started",
        description: `${document.title} is being downloaded.`,
        duration: 3000,
      });
      // In a real application, this would initiate the actual download
    }
  };

  const availableCategories = Array.from(new Set(documents.map(doc => doc.category)));
  const availableBrands = Array.from(new Set(documents.map(doc => doc.brand)));

  const getBrandColor = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'insiderlife':
        return 'bg-insider-600 text-white';
      case 'tokenomix':
        return 'bg-blue-600 text-white';
      case 'insiderdao':
        return 'bg-purple-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText size={18} className="text-red-600 dark:text-red-400" />;
      case 'docx':
        return <FileText size={18} className="text-blue-600 dark:text-blue-400" />;
      case 'xlsx':
        return <FileText size={18} className="text-green-600 dark:text-green-400" />;
      default:
        return <File size={18} className="text-gray-600 dark:text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <AnimatedTransition>
          <div className="container mx-auto px-4 sm:px-6">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Document Vault</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Access guides, reports, and valuable resources from all InsiderLife properties
              </p>
            </div>
            
            {/* Search and Filter Bar */}
            <div className="mb-8 flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="text"
                    placeholder="Search documents..."
                    className="pl-10 glass-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className={`relative ${Object.values(activeFilter).some(val => val !== 'all') ? 'border-insider-600 text-insider-600' : ''}`}
                  onClick={() => setShowFilterPanel(!showFilterPanel)}
                >
                  <Filter size={16} className="mr-2" />
                  Filters
                  {Object.values(activeFilter).some(val => val !== 'all') && (
                    <span className="ml-2 px-1.5 py-0.5 text-xs font-semibold rounded-full bg-insider-100 dark:bg-insider-800 text-insider-600 dark:text-insider-300">
                      {Object.values(activeFilter).filter(val => val !== 'all').length}
                    </span>
                  )}
                </Button>
                
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
            
            {/* Filter Panel */}
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
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Brand</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between glass-input">
                          {activeFilter.brand === 'all' ? 'All Brands' : activeFilter.brand}
                          <ChevronDown size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        <DropdownMenuItem onClick={() => setActiveFilter(prev => ({ ...prev, brand: 'all' }))}>
                          All Brands
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {availableBrands.map(brand => (
                          <DropdownMenuItem 
                            key={brand}
                            onClick={() => setActiveFilter(prev => ({ ...prev, brand }))}
                          >
                            {brand}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between glass-input">
                          {activeFilter.category === 'all' ? 'All Categories' : activeFilter.category}
                          <ChevronDown size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        <DropdownMenuItem onClick={() => setActiveFilter(prev => ({ ...prev, category: 'all' }))}>
                          All Categories
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {availableCategories.map(category => (
                          <DropdownMenuItem 
                            key={category}
                            onClick={() => setActiveFilter(prev => ({ ...prev, category }))}
                          >
                            {category}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Access Level</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between glass-input">
                          {activeFilter.premium === 'all' 
                            ? 'All Documents' 
                            : activeFilter.premium === 'premium' 
                              ? 'Premium Only' 
                              : 'Free Only'}
                          <ChevronDown size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        <DropdownMenuItem onClick={() => setActiveFilter(prev => ({ ...prev, premium: 'all' }))}>
                          All Documents
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setActiveFilter(prev => ({ ...prev, premium: 'free' }))}>
                          Free Only
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setActiveFilter(prev => ({ ...prev, premium: 'premium' }))}>
                          Premium Only
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
            
            {/* Document Categories Tabs */}
            <Tabs defaultValue="all" className="mb-8">
              <TabsList className="glass-card">
                <TabsTrigger value="all">All Documents</TabsTrigger>
                <TabsTrigger value="guides">Guides & Tutorials</TabsTrigger>
                <TabsTrigger value="reports">Reports & Analysis</TabsTrigger>
                <TabsTrigger value="whitepapers">Whitepapers</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                {isLoading ? (
                  viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {Array(8).fill(0).map((_, i) => (
                        <div key={i} className="aspect-[3/4] rounded-lg loading-shimmer"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Array(8).fill(0).map((_, i) => (
                        <div key={i} className="h-24 rounded-lg loading-shimmer"></div>
                      ))}
                    </div>
                  )
                ) : filteredDocuments.length > 0 ? (
                  viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredDocuments.map(document => (
                        <Card 
                          key={document.id} 
                          className="glass-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                          onClick={() => handleDocumentClick(document)}
                        >
                          <div className="aspect-[3/2] w-full relative overflow-hidden">
                            {document.thumbnail ? (
                              <img 
                                src={document.thumbnail} 
                                alt={document.title} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                {getFileIcon(document.type)}
                              </div>
                            )}
                            <div className="absolute top-2 right-2 flex space-x-2">
                              {document.isPremium && (
                                <Badge className="bg-gradient-to-r from-amber-500 to-amber-700 border-0">
                                  Premium
                                </Badge>
                              )}
                            </div>
                          </div>
                          <CardHeader className="p-4 pb-2">
                            <div className="flex items-center justify-between mb-1">
                              <Badge variant="outline" className="text-xs font-normal">
                                {document.category}
                              </Badge>
                              <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                {getFileIcon(document.type)}
                                <span className="ml-1">{document.type}</span>
                              </span>
                            </div>
                            <CardTitle className="text-base line-clamp-2">
                              {document.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0 pb-2">
                            <CardDescription className="line-clamp-2 text-sm">
                              {document.description}
                            </CardDescription>
                          </CardContent>
                          <CardFooter className="p-4 pt-2 flex justify-between items-center">
                            <Badge variant="secondary" className={getBrandColor(document.brand)}>
                              {document.brand}
                            </Badge>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(document);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Download size={16} />
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredDocuments.map(document => (
                        <Card 
                          key={document.id} 
                          className="glass-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                          onClick={() => handleDocumentClick(document)}
                        >
                          <div className="flex">
                            <div className="w-20 h-20 sm:w-32 sm:h-32 flex-shrink-0 relative overflow-hidden">
                              {document.thumbnail ? (
                                <img 
                                  src={document.thumbnail} 
                                  alt={document.title} 
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                  {getFileIcon(document.type)}
                                </div>
                              )}
                              {document.isPremium && (
                                <div className="absolute top-1 right-1">
                                  <Badge className="bg-gradient-to-r from-amber-500 to-amber-700 border-0 text-[10px] px-1.5 py-0">
                                    Premium
                                  </Badge>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 p-4">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center space-x-2">
                                  <Badge variant="secondary" className={getBrandColor(document.brand)}>
                                    {document.brand}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs font-normal">
                                    {document.category}
                                  </Badge>
                                </div>
                                <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                  {getFileIcon(document.type)}
                                  <span className="ml-1">{document.type}</span>
                                </span>
                              </div>
                              <h3 className="font-medium text-balance line-clamp-1">{document.title}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">{document.description}</p>
                              <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                                <span>Size: {document.size}</span>
                                <span className="mx-2">•</span>
                                <span>Uploaded: {document.uploadDate}</span>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="ml-auto h-7"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(document);
                                  }}
                                >
                                  <Download size={14} className="mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No documents found matching your filters.</p>
                    <Button 
                      variant="outline" 
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="guides" className="mt-6">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className="aspect-[3/4] rounded-lg loading-shimmer"></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredDocuments
                      .filter(doc => doc.category.toLowerCase() === 'guide')
                      .map(document => (
                        <Card 
                          key={document.id} 
                          className="glass-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                          onClick={() => handleDocumentClick(document)}
                        >
                          <div className="aspect-[3/2] w-full relative overflow-hidden">
                            {document.thumbnail ? (
                              <img 
                                src={document.thumbnail} 
                                alt={document.title} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                {getFileIcon(document.type)}
                              </div>
                            )}
                            <div className="absolute top-2 right-2 flex space-x-2">
                              {document.isPremium && (
                                <Badge className="bg-gradient-to-r from-amber-500 to-amber-700 border-0">
                                  Premium
                                </Badge>
                              )}
                            </div>
                          </div>
                          <CardHeader className="p-4 pb-2">
                            <div className="flex items-center justify-between mb-1">
                              <Badge variant="outline" className="text-xs font-normal">
                                {document.category}
                              </Badge>
                              <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                {getFileIcon(document.type)}
                                <span className="ml-1">{document.type}</span>
                              </span>
                            </div>
                            <CardTitle className="text-base line-clamp-2">
                              {document.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0 pb-2">
                            <CardDescription className="line-clamp-2 text-sm">
                              {document.description}
                            </CardDescription>
                          </CardContent>
                          <CardFooter className="p-4 pt-2 flex justify-between items-center">
                            <Badge variant="secondary" className={getBrandColor(document.brand)}>
                              {document.brand}
                            </Badge>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(document);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Download size={16} />
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="reports" className="mt-6">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array(2).fill(0).map((_, i) => (
                      <div key={i} className="aspect-[3/4] rounded-lg loading-shimmer"></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredDocuments
                      .filter(doc => ['report', 'analysis'].includes(doc.category.toLowerCase()))
                      .map(document => (
                        <Card 
                          key={document.id} 
                          className="glass-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                          onClick={() => handleDocumentClick(document)}
                        >
                          <div className="aspect-[3/2] w-full relative overflow-hidden">
                            {document.thumbnail ? (
                              <img 
                                src={document.thumbnail} 
                                alt={document.title} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                {getFileIcon(document.type)}
                              </div>
                            )}
                            <div className="absolute top-2 right-2 flex space-x-2">
                              {document.isPremium && (
                                <Badge className="bg-gradient-to-r from-amber-500 to-amber-700 border-0">
                                  Premium
                                </Badge>
                              )}
                            </div>
                          </div>
                          <CardHeader className="p-4 pb-2">
                            <div className="flex items-center justify-between mb-1">
                              <Badge variant="outline" className="text-xs font-normal">
                                {document.category}
                              </Badge>
                              <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                {getFileIcon(document.type)}
                                <span className="ml-1">{document.type}</span>
                              </span>
                            </div>
                            <CardTitle className="text-base line-clamp-2">
                              {document.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0 pb-2">
                            <CardDescription className="line-clamp-2 text-sm">
                              {document.description}
                            </CardDescription>
                          </CardContent>
                          <CardFooter className="p-4 pt-2 flex justify-between items-center">
                            <Badge variant="secondary" className={getBrandColor(document.brand)}>
                              {document.brand}
                            </Badge>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(document);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Download size={16} />
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="whitepapers" className="mt-6">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array(1).fill(0).map((_, i) => (
                      <div key={i} className="aspect-[3/4] rounded-lg loading-shimmer"></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredDocuments
                      .filter(doc => doc.category.toLowerCase() === 'whitepaper')
                      .map(document => (
                        <Card 
                          key={document.id} 
                          className="glass-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                          onClick={() => handleDocumentClick(document)}
                        >
                          <div className="aspect-[3/2] w-full relative overflow-hidden">
                            {document.thumbnail ? (
                              <img 
                                src={document.thumbnail} 
                                alt={document.title} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                {getFileIcon(document.type)}
                              </div>
                            )}
                            <div className="absolute top-2 right-2 flex space-x-2">
                              {document.isPremium && (
                                <Badge className="bg-gradient-to-r from-amber-500 to-amber-700 border-0">
                                  Premium
                                </Badge>
                              )}
                            </div>
                          </div>
                          <CardHeader className="p-4 pb-2">
                            <div className="flex items-center justify-between mb-1">
                              <Badge variant="outline" className="text-xs font-normal">
                                {document.category}
                              </Badge>
                              <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                {getFileIcon(document.type)}
                                <span className="ml-1">{document.type}</span>
                              </span>
                            </div>
                            <CardTitle className="text-base line-clamp-2">
                              {document.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0 pb-2">
                            <CardDescription className="line-clamp-2 text-sm">
                              {document.description}
                            </CardDescription>
                          </CardContent>
                          <CardFooter className="p-4 pt-2 flex justify-between items-center">
                            <Badge variant="secondary" className={getBrandColor(document.brand)}>
                              {document.brand}
                            </Badge>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(document);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Download size={16} />
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            {/* Document Preview Dialog */}
            {currentDocument && (
              <Dialog open={showDocumentPreview} onOpenChange={setShowDocumentPreview}>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl">{currentDocument.title}</DialogTitle>
                    <DialogDescription>
                      {currentDocument.description}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                      <div className="aspect-square w-full overflow-hidden rounded-lg mb-4">
                        {currentDocument.thumbnail ? (
                          <img 
                            src={currentDocument.thumbnail} 
                            alt={currentDocument.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                            {getFileIcon(currentDocument.type)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className={getBrandColor(currentDocument.brand)}>
                          {currentDocument.brand}
                        </Badge>
                        <span className="flex items-center text-sm">
                          {getFileIcon(currentDocument.type)}
                          <span className="ml-1">{currentDocument.type}</span>
                        </span>
                      </div>
                      
                      {currentDocument.isPremium && (
                        <Badge className="w-full justify-center py-1.5 mb-4 bg-gradient-to-r from-amber-500 to-amber-700 border-0">
                          Premium Content
                        </Badge>
                      )}
                    </div>
                    
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Category</h4>
                        <Badge variant="outline">{currentDocument.category}</Badge>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1">Details</h4>
                        <dl className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <dt className="text-gray-500 dark:text-gray-400">Size</dt>
                            <dd>{currentDocument.size}</dd>
                          </div>
                          <div>
                            <dt className="text-gray-500 dark:text-gray-400">Upload Date</dt>
                            <dd>{currentDocument.uploadDate}</dd>
                          </div>
                          <div>
                            <dt className="text-gray-500 dark:text-gray-400">Last Modified</dt>
                            <dd>{currentDocument.lastModified}</dd>
                          </div>
                          <div>
                            <dt className="text-gray-500 dark:text-gray-400">Author</dt>
                            <dd>{currentDocument.author}</dd>
                          </div>
                        </dl>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {currentDocument.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {currentDocument.isPremium && (
                        <div className="pt-4">
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            This premium document is available to InsiderLife subscribers. Upgrade your account to download this and other premium resources.
                          </p>
                          <Button className="w-full">
                            Upgrade to Premium
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowDocumentPreview(false)}
                    >
                      Close
                    </Button>
                    <Button 
                      onClick={() => handleDownload(currentDocument)}
                      disabled={currentDocument.isPremium}
                    >
                      <Download size={16} className="mr-2" />
                      Download
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            
            {/* New Document Viewer Component */}
            {currentDocument && (
              <DocumentViewer
                document={currentDocument}
                isOpen={showDocumentViewer}
                onClose={() => setShowDocumentViewer(false)}
                onDownload={handleDownload}
              />
            )}
            
            {/* CTA Section */}
            <section className="mt-16">
              <GlobalCTA 
                id="documents-footer"
                title="Unlock Premium Content"
                description="Upgrade to access our full library of premium documents, guides, and analysis."
                buttonText="Upgrade Now"
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

export default DocumentVault;
