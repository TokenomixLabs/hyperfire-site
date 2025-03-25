
import { useState } from "react";
import { Copy, Code, CheckCircle, Settings, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EmbedOptions {
  width: string;
  height: string;
  autoplay: boolean;
  showControls: boolean;
  responsive: boolean;
  theme: "light" | "dark" | "auto";
}

interface ContentItem {
  id: string;
  title: string;
  type: "video" | "document" | "article" | "livestream";
  url: string;
}

const EmbedCodeGenerator = () => {
  const [selectedContent, setSelectedContent] = useState<string>("");
  const [embedOptions, setEmbedOptions] = useState<EmbedOptions>({
    width: "100%",
    height: "400",
    autoplay: false,
    showControls: true,
    responsive: true,
    theme: "auto"
  });
  const [codeType, setCodeType] = useState<"iframe" | "javascript">("iframe");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Mock content data
  const mockContent: ContentItem[] = [
    { id: "1", title: "Crypto Market Analysis - August Edition", type: "video", url: "/content/crypto-market-analysis" },
    { id: "2", title: "NFT Investment Strategy Webinar", type: "livestream", url: "/live/nft-investment-strategy" },
    { id: "3", title: "Tokenomics Fundamentals Guide", type: "document", url: "/documents/tokenomics-guide" },
    { id: "4", title: "InsiderDAO Governance Framework", type: "article", url: "/content/dao-governance" },
    { id: "5", title: "Weekly Insider Live Market Update", type: "livestream", url: "/live/weekly-market-update" }
  ];

  const generateIframeCode = () => {
    if (!selectedContent) return "";
    
    const content = mockContent.find(c => c.id === selectedContent);
    if (!content) return "";
    
    const baseUrl = "https://insiderlife-cms.example.com/embed";
    const responsiveClass = embedOptions.responsive ? ' class="responsive-embed"' : '';
    
    let iframe = `<iframe src="${baseUrl}${content.url}?theme=${embedOptions.theme}&controls=${embedOptions.showControls}&autoplay=${embedOptions.autoplay}"
  width="${embedOptions.width}" 
  height="${embedOptions.height}"${responsiveClass}
  frameborder="0" 
  allowfullscreen>
</iframe>`;

    if (embedOptions.responsive) {
      iframe = `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  ${iframe.replace(' class="responsive-embed"', ' style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"')}
</div>`;
    }
    
    return iframe;
  };

  const generateJavascriptCode = () => {
    if (!selectedContent) return "";
    
    const content = mockContent.find(c => c.id === selectedContent);
    if (!content) return "";
    
    return `<div id="insiderlife-embed"></div>
<script src="https://insiderlife-cms.example.com/js/embed.js"></script>
<script>
  InsiderLifeEmbed.init({
    container: '#insiderlife-embed',
    contentId: '${content.id}',
    width: '${embedOptions.width}',
    height: '${embedOptions.height}',
    autoplay: ${embedOptions.autoplay},
    controls: ${embedOptions.showControls},
    responsive: ${embedOptions.responsive},
    theme: '${embedOptions.theme}'
  });
</script>`;
  };

  const getGeneratedCode = () => {
    return codeType === "iframe" ? generateIframeCode() : generateJavascriptCode();
  };

  const handleCopyCode = () => {
    const code = getGeneratedCode();
    navigator.clipboard.writeText(code);
    setCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "Embed code has been copied to your clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOptionChange = (key: keyof EmbedOptions, value: any) => {
    setEmbedOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Embed Code Generator</CardTitle>
          <CardDescription>
            Generate embed codes to share InsiderLife content on external websites
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="content-select">Select Content</Label>
            <Select
              value={selectedContent}
              onValueChange={setSelectedContent}
            >
              <SelectTrigger id="content-select">
                <SelectValue placeholder="Choose content to embed" />
              </SelectTrigger>
              <SelectContent>
                {mockContent.map(content => (
                  <SelectItem key={content.id} value={content.id}>
                    <div className="flex items-center gap-2">
                      <span>{content.title}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                        {content.type}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="space-y-4 flex-1">
              <h3 className="text-sm font-medium">Embed Options</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="embed-width">Width</Label>
                  <Input 
                    id="embed-width"
                    value={embedOptions.width}
                    onChange={(e) => handleOptionChange("width", e.target.value)}
                    placeholder="100% or pixels"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="embed-height">Height</Label>
                  <Input 
                    id="embed-height"
                    value={embedOptions.height}
                    onChange={(e) => handleOptionChange("height", e.target.value)}
                    placeholder="Pixels"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="embed-theme">Theme</Label>
                <Select
                  value={embedOptions.theme}
                  onValueChange={(value) => handleOptionChange("theme", value)}
                >
                  <SelectTrigger id="embed-theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto (follows user's system)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4 flex-1">
              <h3 className="text-sm font-medium">Additional Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoplay-switch">Autoplay</Label>
                    <p className="text-xs text-muted-foreground">
                      Start playback automatically (videos only)
                    </p>
                  </div>
                  <Switch
                    id="autoplay-switch"
                    checked={embedOptions.autoplay}
                    onCheckedChange={(checked) => handleOptionChange("autoplay", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="controls-switch">Show Controls</Label>
                    <p className="text-xs text-muted-foreground">
                      Display player controls
                    </p>
                  </div>
                  <Switch
                    id="controls-switch"
                    checked={embedOptions.showControls}
                    onCheckedChange={(checked) => handleOptionChange("showControls", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="responsive-switch">Responsive</Label>
                    <p className="text-xs text-muted-foreground">
                      Make embed responsive to container size
                    </p>
                  </div>
                  <Switch
                    id="responsive-switch"
                    checked={embedOptions.responsive}
                    onCheckedChange={(checked) => handleOptionChange("responsive", checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {selectedContent && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Generated Embed Code</CardTitle>
            <div className="flex items-center space-x-4 pt-2">
              <Tabs defaultValue="iframe" value={codeType} onValueChange={(value) => setCodeType(value as "iframe" | "javascript")}>
                <TabsList className="h-8">
                  <TabsTrigger value="iframe" className="text-xs">
                    <Code className="h-3.5 w-3.5 mr-1" /> 
                    iframe
                  </TabsTrigger>
                  <TabsTrigger value="javascript" className="text-xs">
                    <Code className="h-3.5 w-3.5 mr-1" /> 
                    JavaScript
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCopyCode}
                className="h-8"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-3.5 w-3.5 mr-1 text-green-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={getGeneratedCode()}
              readOnly
              className="font-mono text-xs"
              rows={10}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <Settings className="h-3.5 w-3.5" />
              Customize the appearance and behavior using the options above
            </div>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              Preview Embed
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default EmbedCodeGenerator;
