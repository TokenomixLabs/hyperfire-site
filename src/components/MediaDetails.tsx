
import { useState } from "react";
import { X, Download, Trash2, Edit, Save, Copy, Tags, Calendar, User, HardDrive, Link, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MediaDetailsProps {
  mediaId: string;
  onClose: () => void;
}

// Mock data - in a real app this would come from an API
const mockMediaData = {
  id: "1",
  title: "Crypto Market Analysis",
  description: "A comprehensive analysis of the current cryptocurrency market trends with predictive models for the next quarter.",
  type: "image",
  fileType: "image/jpeg",
  url: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop",
  thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop",
  dateUploaded: "2023-08-20T14:48:00Z",
  uploadedBy: "Alex Chen",
  size: "1.2 MB",
  dimensions: "1920x1080",
  tags: ["crypto", "market", "analysis", "finance", "bitcoin"],
  category: "reports",
  usageStats: {
    views: 248,
    downloads: 43,
    embeds: 12,
  },
  usedIn: [
    { name: "Q3 Market Report", type: "document", url: "/document/q3-report" },
    { name: "Crypto Outlook 2023", type: "article", url: "/content/crypto-outlook" }
  ]
};

const MediaDetails = ({ mediaId, onClose }: MediaDetailsProps) => {
  // In a real app, we'd fetch the media details based on the ID
  // For this demo, we'll use the mock data
  const [media] = useState(mockMediaData);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  
  // Form states
  const [title, setTitle] = useState(media.title);
  const [description, setDescription] = useState(media.description);
  const [category, setCategory] = useState(media.category);
  const [tagsInput, setTagsInput] = useState(media.tags.join(", "));
  
  const { toast } = useToast();

  const handleSave = () => {
    // In a real app, we'd send the updated data to the server
    console.log("Saving media details:", {
      id: media.id,
      title,
      description,
      category,
      tags: tagsInput.split(",").map(tag => tag.trim()).filter(Boolean),
    });
    
    toast({
      title: "Changes Saved",
      description: "Media details have been updated successfully.",
    });
    
    setIsEditing(false);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(media.url);
    toast({
      title: "URL Copied",
      description: "Media URL has been copied to clipboard.",
    });
  };

  const handleCopyEmbed = () => {
    const embedCode = `<iframe src="${media.url}" width="100%" height="400" frameborder="0" allowfullscreen></iframe>`;
    navigator.clipboard.writeText(embedCode);
    toast({
      title: "Embed Code Copied",
      description: "Embed code has been copied to clipboard.",
    });
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-medium">Media Details</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button 
                size="sm"
                onClick={handleSave}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCopyUrl}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy URL
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <div className="md:col-span-1 flex flex-col">
          <div className="border rounded-lg overflow-hidden mb-4">
            {media.type === "image" ? (
              <img 
                src={media.url} 
                alt={media.title}
                className="w-full h-auto"
              />
            ) : media.type === "video" ? (
              <div className="aspect-video bg-muted/30 flex items-center justify-center">
                <video 
                  src={media.url} 
                  controls
                  className="w-full h-auto"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <div className="aspect-video bg-muted/30 flex items-center justify-center p-8">
                <div className="text-center">
                  <FileIcon className="h-16 w-16 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">{media.fileType.split('/')[1].toUpperCase()}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Download</h3>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open(media.url, '_blank')}
              >
                <Download className="mr-2 h-4 w-4" />
                Download File
              </Button>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Embed</h3>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleCopyEmbed}
              >
                <Link className="mr-2 h-4 w-4" />
                Copy Embed Code
              </Button>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">File Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Uploaded</p>
                    <p>{formatDate(media.dateUploaded)}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Uploaded by</p>
                    <p>{media.uploadedBy}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <HardDrive className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">File size</p>
                    <p>{media.size}</p>
                  </div>
                </div>
                
                {media.type === "image" && media.dimensions && (
                  <div className="flex items-start gap-2">
                    <div className="h-4 w-4 text-muted-foreground mt-0.5 flex items-center justify-center">
                      <span className="text-xs">📏</span>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Dimensions</p>
                      <p>{media.dimensions}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="usage">Usage</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  {isEditing ? (
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  ) : (
                    <p className="text-lg font-medium">{media.title}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  {isEditing ? (
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{media.description || "No description provided."}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    {isEditing ? (
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reports">Reports</SelectItem>
                          <SelectItem value="articles">Articles</SelectItem>
                          <SelectItem value="presentations">Presentations</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="uncategorized">Uncategorized</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm capitalize">{media.category}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    {isEditing ? (
                      <Input
                        id="tags"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        placeholder="Tag1, Tag2, Tag3"
                      />
                    ) : (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {media.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="usage" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Usage Statistics</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold">{media.usageStats.views}</p>
                      <p className="text-xs text-muted-foreground">Views</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold">{media.usageStats.downloads}</p>
                      <p className="text-xs text-muted-foreground">Downloads</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold">{media.usageStats.embeds}</p>
                      <p className="text-xs text-muted-foreground">Embeds</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Used In</h3>
                  {media.usedIn && media.usedIn.length > 0 ? (
                    <div className="space-y-2">
                      {media.usedIn.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border rounded-lg hover:bg-muted/30">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open(item.url, '_blank')}
                          >
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">This media is not currently used in any content.</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

// Helper component for document icons
const FileIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

export default MediaDetails;
