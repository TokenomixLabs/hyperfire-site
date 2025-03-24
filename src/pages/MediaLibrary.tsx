
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Search, Filter, Pencil, Trash2, Tags, Image, FileText, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AnimatedTransition from "@/components/AnimatedTransition";
import { useToast } from "@/hooks/use-toast";
import MediaUploader from "@/components/MediaUploader";
import MediaGallery from "@/components/MediaGallery";
import MediaDetails from "@/components/MediaDetails";

const MediaLibrary = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [mediaTypeFilter, setMediaTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoBack = () => {
    navigate("/admin");
  };

  const handleUploadComplete = () => {
    setUploadDialogOpen(false);
    toast({
      title: "Upload Successful",
      description: "Your media has been uploaded successfully.",
    });
  };

  const handleMediaSelect = (id: string) => {
    setSelectedMedia(id);
  };

  const handleMediaClose = () => {
    setSelectedMedia(null);
  };

  return (
    <AnimatedTransition className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleGoBack}
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Media Library</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Upload className="mr-2 h-4 w-4" /> Upload Media
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Upload Media</DialogTitle>
                <DialogDescription>
                  Upload images, documents, or videos to your media library.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <MediaUploader onUploadComplete={handleUploadComplete} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search media..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select 
          value={mediaTypeFilter}
          onValueChange={setMediaTypeFilter}
        >
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Filter by type" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="document">Documents</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-4 mb-8">
          <TabsTrigger value="all" className="flex items-center gap-2">
            All Media
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Images
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Film className="h-4 w-4" />
            Videos
          </TabsTrigger>
        </TabsList>
        
        <div className="min-h-[400px]">
          {selectedMedia ? (
            <MediaDetails mediaId={selectedMedia} onClose={handleMediaClose} />
          ) : (
            <TabsContent value={activeTab} className="mt-0">
              <MediaGallery 
                mediaType={activeTab === "all" ? undefined : activeTab} 
                typeFilter={mediaTypeFilter}
                searchQuery={searchQuery}
                onSelect={handleMediaSelect}
              />
            </TabsContent>
          )}
        </div>
      </Tabs>
    </AnimatedTransition>
  );
};

export default MediaLibrary;
