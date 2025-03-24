
import { useState } from "react";
import { PlusCircle, Trash2, Copy, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Mock data structure
interface MetaTag {
  id: string;
  url: string;
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  canonicalUrl: string;
}

const defaultMetaTag: MetaTag = {
  id: "",
  url: "",
  title: "",
  description: "",
  keywords: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  twitterCard: "summary_large_image",
  twitterTitle: "",
  twitterDescription: "",
  twitterImage: "",
  canonicalUrl: ""
};

const MetaTagManager = () => {
  const [metaTags, setMetaTags] = useState<MetaTag[]>([
    {
      id: "1",
      url: "/content/crypto-market-outlook",
      title: "Crypto Market Outlook - Q3 2023 | InsiderLife",
      description: "Exclusive analysis of cryptocurrency market trends for Q3 2023, including Bitcoin, Ethereum, and emerging altcoins.",
      keywords: "crypto, bitcoin, ethereum, market analysis, cryptocurrency, investing",
      ogTitle: "Crypto Market Outlook - Q3 2023",
      ogDescription: "Exclusive cryptocurrency market analysis and predictions for Q3 2023.",
      ogImage: "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2832&auto=format&fit=crop",
      twitterCard: "summary_large_image",
      twitterTitle: "Crypto Market Outlook - Q3 2023",
      twitterDescription: "Exclusive cryptocurrency market analysis and predictions for Q3 2023.",
      twitterImage: "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2832&auto=format&fit=crop",
      canonicalUrl: "https://insiderlife.com/content/crypto-market-outlook"
    },
    {
      id: "2",
      url: "/live/nft-investment-strategy",
      title: "NFT Investment Strategy Webinar | InsiderLife",
      description: "Join our exclusive webinar on NFT investment strategies for 2023 and beyond.",
      keywords: "NFT, investment, webinar, digital assets, collectibles",
      ogTitle: "NFT Investment Strategy Webinar",
      ogDescription: "Join our exclusive webinar on NFT investment strategies.",
      ogImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop",
      twitterCard: "summary_large_image",
      twitterTitle: "NFT Investment Strategy Webinar",
      twitterDescription: "Join our exclusive webinar on NFT investment strategies.",
      twitterImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop",
      canonicalUrl: "https://insiderlife.com/live/nft-investment-strategy"
    }
  ]);
  
  const [selectedTag, setSelectedTag] = useState<MetaTag | null>(null);
  const [currentSection, setCurrentSection] = useState("basic");
  const [codeType, setCodeType] = useState<"html" | "react">("html");
  const { toast } = useToast();

  const handleAddNew = () => {
    const newTag = {
      ...defaultMetaTag,
      id: Date.now().toString()
    };
    setSelectedTag(newTag);
  };

  const handleSave = () => {
    if (!selectedTag) return;
    
    if (!selectedTag.url) {
      toast({
        title: "Error",
        description: "URL path is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedTag.title) {
      toast({
        title: "Error",
        description: "Meta title is required",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedTag.id) {
      // Update existing
      setMetaTags(prev => 
        prev.some(tag => tag.id === selectedTag.id)
          ? prev.map(tag => tag.id === selectedTag.id ? selectedTag : tag)
          : [...prev, selectedTag]
      );
    } else {
      // Add new
      const newTag = {
        ...selectedTag,
        id: Date.now().toString()
      };
      setMetaTags(prev => [...prev, newTag]);
    }
    
    setSelectedTag(null);
    
    toast({
      title: "Success",
      description: "Meta tags have been saved",
    });
  };

  const handleDelete = (id: string) => {
    setMetaTags(prev => prev.filter(tag => tag.id !== id));
    setSelectedTag(null);
    
    toast({
      title: "Deleted",
      description: "Meta tags have been removed",
    });
  };
  
  const handleCopyCode = () => {
    if (!selectedTag) return;
    
    let code = "";
    
    if (codeType === "html") {
      code = generateHtmlCode(selectedTag);
    } else {
      code = generateReactCode(selectedTag);
    }
    
    navigator.clipboard.writeText(code);
    
    toast({
      title: "Copied",
      description: "Code has been copied to clipboard",
    });
  };
  
  const generateHtmlCode = (tag: MetaTag) => {
    return `<!-- Basic Meta Tags -->
<title>${tag.title}</title>
<meta name="description" content="${tag.description}" />
<meta name="keywords" content="${tag.keywords}" />
${tag.canonicalUrl ? `<link rel="canonical" href="${tag.canonicalUrl}" />` : ""}

<!-- Open Graph Tags -->
<meta property="og:title" content="${tag.ogTitle || tag.title}" />
<meta property="og:description" content="${tag.ogDescription || tag.description}" />
${tag.ogImage ? `<meta property="og:image" content="${tag.ogImage}" />` : ""}
<meta property="og:url" content="${tag.canonicalUrl || window.location.origin + tag.url}" />
<meta property="og:type" content="website" />

<!-- Twitter Card Tags -->
<meta name="twitter:card" content="${tag.twitterCard}" />
<meta name="twitter:title" content="${tag.twitterTitle || tag.ogTitle || tag.title}" />
<meta name="twitter:description" content="${tag.twitterDescription || tag.ogDescription || tag.description}" />
${tag.twitterImage ? `<meta name="twitter:image" content="${tag.twitterImage}" />` : ""}`;
  };
  
  const generateReactCode = (tag: MetaTag) => {
    return `// React Helmet Example
import { Helmet } from 'react-helmet';

const YourComponent = () => {
  return (
    <>
      <Helmet>
        <title>${tag.title}</title>
        <meta name="description" content="${tag.description}" />
        <meta name="keywords" content="${tag.keywords}" />
        ${tag.canonicalUrl ? `<link rel="canonical" href="${tag.canonicalUrl}" />` : ""}
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="${tag.ogTitle || tag.title}" />
        <meta property="og:description" content="${tag.ogDescription || tag.description}" />
        ${tag.ogImage ? `<meta property="og:image" content="${tag.ogImage}" />` : ""}
        <meta property="og:url" content="${tag.canonicalUrl || 'window.location.href'}" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="${tag.twitterCard}" />
        <meta name="twitter:title" content="${tag.twitterTitle || tag.ogTitle || tag.title}" />
        <meta name="twitter:description" content="${tag.twitterDescription || tag.ogDescription || tag.description}" />
        ${tag.twitterImage ? `<meta name="twitter:image" content="${tag.twitterImage}" />` : ""}
      </Helmet>
      
      {/* Your component content */}
    </>
  );
};

export default YourComponent;`;
  };

  return (
    <div className="space-y-6">
      {!selectedTag ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Meta Tags</h2>
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>URL Path</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metaTags.map((tag) => (
                    <TableRow key={tag.id}>
                      <TableCell className="font-medium">{tag.url}</TableCell>
                      <TableCell>{tag.title}</TableCell>
                      <TableCell className="truncate max-w-[300px]">{tag.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setSelectedTag(tag)}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-red-500">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the meta tags for {tag.url}.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(tag.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {metaTags.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No meta tags found. Click "Add New" to create one.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">
              {selectedTag.id && metaTags.some(tag => tag.id === selectedTag.id) 
                ? "Edit Meta Tags" 
                : "Add Meta Tags"}
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setSelectedTag(null)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Page Information</CardTitle>
              <CardDescription>
                Basic information about the page you want to optimize
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">URL Path</Label>
                <Input 
                  id="url"
                  placeholder="/example-path"
                  value={selectedTag.url}
                  onChange={(e) => setSelectedTag({...selectedTag, url: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">
                  Example: /content/article-name or /live/event-name
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="canonicalUrl">Canonical URL (optional)</Label>
                <Input 
                  id="canonicalUrl"
                  placeholder="https://insiderlife.com/example-path"
                  value={selectedTag.canonicalUrl}
                  onChange={(e) => setSelectedTag({...selectedTag, canonicalUrl: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">
                  Full URL including domain, use this if content appears on multiple URLs
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Tabs value={currentSection} onValueChange={setCurrentSection}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="basic">Basic SEO</TabsTrigger>
              <TabsTrigger value="opengraph">Open Graph</TabsTrigger>
              <TabsTrigger value="twitter">Twitter Card</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Basic SEO Tags</CardTitle>
                  <CardDescription>
                    These tags are essential for search engine optimization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Meta Title</Label>
                    <Input 
                      id="title"
                      placeholder="Page Title | InsiderLife"
                      value={selectedTag.title}
                      onChange={(e) => setSelectedTag({...selectedTag, title: e.target.value})}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Recommended: 50-60 characters</span>
                      <span>{selectedTag.title.length} characters</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Meta Description</Label>
                    <Textarea 
                      id="description"
                      placeholder="A brief description of the page content..."
                      value={selectedTag.description}
                      onChange={(e) => setSelectedTag({...selectedTag, description: e.target.value})}
                      rows={3}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Recommended: 150-160 characters</span>
                      <span>{selectedTag.description.length} characters</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="keywords">Meta Keywords</Label>
                    <Input 
                      id="keywords"
                      placeholder="keyword1, keyword2, keyword3"
                      value={selectedTag.keywords}
                      onChange={(e) => setSelectedTag({...selectedTag, keywords: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Less important for SEO now, but still used by some search engines
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="opengraph" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Open Graph Tags</CardTitle>
                  <CardDescription>
                    These tags control how your content appears when shared on social media
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ogTitle">OG Title</Label>
                    <Input 
                      id="ogTitle"
                      placeholder="Leave blank to use meta title"
                      value={selectedTag.ogTitle}
                      onChange={(e) => setSelectedTag({...selectedTag, ogTitle: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ogDescription">OG Description</Label>
                    <Textarea 
                      id="ogDescription"
                      placeholder="Leave blank to use meta description"
                      value={selectedTag.ogDescription}
                      onChange={(e) => setSelectedTag({...selectedTag, ogDescription: e.target.value})}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ogImage">OG Image URL</Label>
                    <Input 
                      id="ogImage"
                      placeholder="https://example.com/image.jpg"
                      value={selectedTag.ogImage}
                      onChange={(e) => setSelectedTag({...selectedTag, ogImage: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">
                      Recommended size: 1200x630 pixels
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="twitter" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Twitter Card Tags</CardTitle>
                  <CardDescription>
                    These tags control how your content appears when shared on Twitter
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="twitterCard">Twitter Card Type</Label>
                    <Select 
                      value={selectedTag.twitterCard}
                      onValueChange={(value) => setSelectedTag({...selectedTag, twitterCard: value})}
                    >
                      <SelectTrigger id="twitterCard">
                        <SelectValue placeholder="Select card type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="summary">Summary</SelectItem>
                        <SelectItem value="summary_large_image">Summary with Large Image</SelectItem>
                        <SelectItem value="app">App</SelectItem>
                        <SelectItem value="player">Player</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="twitterTitle">Twitter Title</Label>
                    <Input 
                      id="twitterTitle"
                      placeholder="Leave blank to use OG title"
                      value={selectedTag.twitterTitle}
                      onChange={(e) => setSelectedTag({...selectedTag, twitterTitle: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="twitterDescription">Twitter Description</Label>
                    <Textarea 
                      id="twitterDescription"
                      placeholder="Leave blank to use OG description"
                      value={selectedTag.twitterDescription}
                      onChange={(e) => setSelectedTag({...selectedTag, twitterDescription: e.target.value})}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="twitterImage">Twitter Image URL</Label>
                    <Input 
                      id="twitterImage"
                      placeholder="Leave blank to use OG image"
                      value={selectedTag.twitterImage}
                      onChange={(e) => setSelectedTag({...selectedTag, twitterImage: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">
                      Recommended size for summary_large_image: 1200x600 pixels
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Card>
            <CardHeader>
              <CardTitle>Generated Code</CardTitle>
              <CardDescription>
                Code snippets for implementing these meta tags
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center border-b pb-4">
                <div className="flex gap-2">
                  <Button
                    variant={codeType === "html" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCodeType("html")}
                  >
                    HTML
                  </Button>
                  <Button
                    variant={codeType === "react" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCodeType("react")}
                  >
                    React
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopyCode}
                  className="flex items-center gap-1"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy Code
                </Button>
              </div>
              
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                <code>{codeType === "html" 
                  ? generateHtmlCode(selectedTag) 
                  : generateReactCode(selectedTag)}
                </code>
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MetaTagManager;
