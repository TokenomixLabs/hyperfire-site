
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { SignalSeries } from '@/types/signal';
import { ThreadTag } from '@/types/signalboard';
import { mockTags } from '@/data/mockThreads';
import {
  Bold,
  Italic,
  Underline,
  Link2,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Image,
  Video,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowLeft,
  Upload,
  Save,
  Eye,
  X
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Mock signal series for dropdown
const mockSignalSeries: SignalSeries[] = [
  {
    id: "series-1",
    name: "AI Freedom Code",
    slug: "ai-freedom-code",
    description: "Learn how to leverage AI tools for personal freedom",
    contentType: "mixed",
    thumbnailUrl: "https://example.com/thumbnail.jpg",
    featuredImageUrl: "https://example.com/featured.jpg",
    createdBy: "user-1",
    createdAt: "2023-05-01T12:00:00Z",
    updatedAt: "2023-05-15T09:30:00Z",
    published: true,
    steps: [],
    isDuplicated: false,
    stats: {
      views: 1200,
      ctaClicks: 350,
      conversions: 75,
      shares: 120
    }
  },
  {
    id: "series-2",
    name: "Digital Lifestyle Blueprint",
    slug: "digital-lifestyle-blueprint",
    description: "Create a thriving digital lifestyle business",
    contentType: "video",
    thumbnailUrl: "https://example.com/thumbnail2.jpg",
    featuredImageUrl: "https://example.com/featured2.jpg",
    createdBy: "user-1",
    createdAt: "2023-06-10T10:00:00Z",
    updatedAt: "2023-06-20T14:45:00Z",
    published: true,
    steps: [],
    isDuplicated: false,
    stats: {
      views: 840,
      ctaClicks: 210,
      conversions: 45,
      shares: 80
    }
  }
];

const ThreadCreationForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<ThreadTag[]>([]);
  const [signalSeriesId, setSignalSeriesId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('edit');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleTagToggle = (tag: ThreadTag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewImageUrl(imageUrl);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your thread",
        variant: "destructive"
      });
      return;
    }
    
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please enter content for your thread",
        variant: "destructive"
      });
      return;
    }
    
    // Submit the thread (in a real app, this would be an API call)
    toast({
      title: "Thread created",
      description: "Your thread has been successfully created"
    });
    
    // Navigate back to the thread list
    navigate('/signalboard');
  };
  
  const insertFormatting = (format: string) => {
    // In a real implementation, this would insert formatting tags at the cursor position
    setContent((prev) => prev + ` [${format}] `);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <div onClick={() => navigate('/signalboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Threads
          </div>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Create New Thread</CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Thread Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title..."
                className="text-lg"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Tags (optional)</Label>
              <div className="flex flex-wrap gap-2">
                {mockTags.map(tag => (
                  <Button
                    key={tag}
                    type="button"
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signalSeries">Link to Signal Series (optional)</Label>
              <Select
                value={signalSeriesId || ""}
                onValueChange={(value) => setSignalSeriesId(value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a Signal Series..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {mockSignalSeries.map(series => (
                    <SelectItem key={series.id} value={series.id}>
                      {series.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Linking to a Signal Series will display it prominently in your thread
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="previewImage">Featured Image (optional)</Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Upload className="h-4 w-4" />
                  Upload Image
                </Button>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                
                {previewImageUrl && (
                  <div className="relative h-16 w-24 rounded overflow-hidden">
                    <img
                      src={previewImageUrl}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => {
                        setPreviewImage(null);
                        setPreviewImageUrl(null);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="edit" className="border rounded-md p-1">
                <div className="flex flex-wrap items-center gap-1 p-1 mb-2 border-b">
                  <Button type="button" variant="ghost" size="sm" className="h-8 px-2" onClick={() => insertFormatting('bold')}>
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="h-8 px-2" onClick={() => insertFormatting('italic')}>
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="h-8 px-2" onClick={() => insertFormatting('underline')}>
                    <Underline className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="h-8 px-2" onClick={() => insertFormatting('h1')}>
                    <Heading1 className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="h-8 px-2" onClick={() => insertFormatting('h2')}>
                    <Heading2 className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="h-8 px-2" onClick={() => insertFormatting('list')}>
                    <List className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="h-8 px-2" onClick={() => insertFormatting('ordered list')}>
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="h-8 px-2" onClick={() => insertFormatting('link')}>
                    <Link2 className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="h-8 px-2" onClick={() => insertFormatting('image')}>
                    <Image className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="h-8 px-2" onClick={() => insertFormatting('video')}>
                    <Video className="h-4 w-4" />
                  </Button>
                  <div className="ml-auto flex items-center gap-1">
                    <Button type="button" variant="ghost" size="sm" className="h-8 px-2" onClick={() => insertFormatting('align left')}>
                      <AlignLeft className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm" className="h-8 px-2" onClick={() => insertFormatting('align center')}>
                      <AlignCenter className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm" className="h-8 px-2" onClick={() => insertFormatting('align right')}>
                      <AlignRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your thread content here... Use the formatting toolbar or markdown syntax."
                  className="min-h-[300px] resize-y"
                  required
                />
                
                <div className="mt-2 text-xs text-muted-foreground">
                  Supports markdown and HTML formatting. Use the toolbar for easy formatting.
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className="border rounded-md p-4 min-h-[300px]">
                {content ? (
                  <div 
                    className="prose prose-sm sm:prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>Nothing to preview yet. Start writing to see a preview here.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/signalboard')}
          >
            Cancel
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => setActiveTab('preview')}
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            
            <Button
              type="submit"
              onClick={handleSubmit}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Create Thread
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ThreadCreationForm;
