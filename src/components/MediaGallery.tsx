
import { useState, useEffect } from "react";
import { MoreHorizontal, Download, Trash2, Edit, ExternalLink, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface MediaItem {
  id: string;
  title: string;
  type: "image" | "document" | "video";
  fileType: string;
  url: string;
  thumbnail: string;
  dateUploaded: string;
  uploadedBy: string;
  size: string;
  tags: string[];
  category: string;
}

interface MediaGalleryProps {
  mediaType?: string;
  typeFilter: string;
  searchQuery: string;
  onSelect: (id: string) => void;
}

// Mock data for the media gallery
const mockMediaItems: MediaItem[] = [
  {
    id: "1",
    title: "Crypto Market Analysis",
    type: "image",
    fileType: "image/jpeg",
    url: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop",
    dateUploaded: "2023-08-20",
    uploadedBy: "Alex Chen",
    size: "1.2 MB",
    tags: ["crypto", "market", "analysis"],
    category: "reports"
  },
  {
    id: "2",
    title: "Bitcoin Trend Report",
    type: "document",
    fileType: "application/pdf",
    url: "/documents/bitcoin-trend-report.pdf",
    thumbnail: "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2832&auto=format&fit=crop",
    dateUploaded: "2023-08-18",
    uploadedBy: "Sarah Johnson",
    size: "3.4 MB",
    tags: ["bitcoin", "trend", "report"],
    category: "reports"
  },
  {
    id: "3",
    title: "NFT Market Overview Webinar",
    type: "video",
    fileType: "video/mp4",
    url: "/videos/nft-overview.mp4",
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop",
    dateUploaded: "2023-08-15",
    uploadedBy: "Mike Wilson",
    size: "45.8 MB",
    tags: ["nft", "webinar", "market"],
    category: "presentations"
  },
  {
    id: "4",
    title: "Ethereum Analysis Chart",
    type: "image",
    fileType: "image/png",
    url: "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2832&auto=format&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2832&auto=format&fit=crop",
    dateUploaded: "2023-08-14",
    uploadedBy: "Lisa Chen",
    size: "0.8 MB",
    tags: ["ethereum", "chart", "analysis"],
    category: "articles"
  },
  {
    id: "5",
    title: "DeFi Market Report",
    type: "document",
    fileType: "application/pdf",
    url: "/documents/defi-market-report.pdf",
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop",
    dateUploaded: "2023-08-12",
    uploadedBy: "Robert Taylor",
    size: "2.7 MB",
    tags: ["defi", "market", "report"],
    category: "reports"
  },
  {
    id: "6",
    title: "Crypto Interview with Expert",
    type: "video",
    fileType: "video/mp4",
    url: "/videos/crypto-interview.mp4",
    thumbnail: "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2832&auto=format&fit=crop",
    dateUploaded: "2023-08-10",
    uploadedBy: "Sarah Johnson",
    size: "78.3 MB",
    tags: ["interview", "expert", "crypto"],
    category: "presentations"
  }
];

const MediaGallery = ({ mediaType, typeFilter, searchQuery, onSelect }: MediaGalleryProps) => {
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    let filtered = [...mockMediaItems];
    
    // Filter by media tab (all, images, documents, videos)
    if (mediaType) {
      if (mediaType === "images") {
        filtered = filtered.filter(item => item.type === "image");
      } else if (mediaType === "documents") {
        filtered = filtered.filter(item => item.type === "document");
      } else if (mediaType === "videos") {
        filtered = filtered.filter(item => item.type === "video");
      }
    }
    
    // Filter by media type dropdown (all, image, document, video)
    if (typeFilter !== "all") {
      filtered = filtered.filter(item => item.type === typeFilter);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        item => 
          item.title.toLowerCase().includes(query) || 
          item.tags.some(tag => tag.toLowerCase().includes(query)) ||
          item.category.toLowerCase().includes(query)
      );
    }
    
    setFilteredItems(filtered);
  }, [mediaType, typeFilter, searchQuery]);

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL Copied",
      description: "Media URL has been copied to clipboard.",
    });
  };

  // Function to format date to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      {filteredItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No media found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="group relative border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div 
                className="h-40 relative cursor-pointer"
                onClick={() => onSelect(item.id)}
              >
                {item.type === "image" ? (
                  <img 
                    src={item.thumbnail} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-muted/30">
                    <img 
                      src={item.thumbnail} 
                      alt={item.title}
                      className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Badge className="text-xs px-2 py-1">
                        {item.type === "document" ? "DOCUMENT" : "VIDEO"}
                      </Badge>
                    </div>
                  </div>
                )}
                
                {/* Overlay with actions on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(item.id);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(item.url, '_blank');
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-3">
                <div className="flex items-start justify-between">
                  <h3 
                    className="font-medium text-sm truncate cursor-pointer hover:underline"
                    onClick={() => onSelect(item.id)}
                  >
                    {item.title}
                  </h3>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onSelect(item.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCopyUrl(item.url)}>
                        <Copy className="mr-2 h-4 w-4" />
                        <span>Copy URL</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.open(item.url, '_blank')}>
                        <Download className="mr-2 h-4 w-4" />
                        <span>Download</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                  <span>{formatDate(item.dateUploaded)}</span>
                  <span>{item.size}</span>
                </div>
                
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{item.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaGallery;
