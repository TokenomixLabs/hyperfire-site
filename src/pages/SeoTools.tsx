
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Tag, BarChart2, Star, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedTransition from "@/components/AnimatedTransition";
import { useToast } from "@/hooks/use-toast";
import MetaTagManager from "@/components/seo/MetaTagManager";
import SeoScoreTool from "@/components/seo/SeoScoreTool";

const SeoTools = () => {
  const [activeTab, setActiveTab] = useState("meta-tags");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoBack = () => {
    navigate("/admin");
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
          <h1 className="text-2xl font-bold">SEO Tools</h1>
        </div>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-2 mb-8">
          <TabsTrigger value="meta-tags" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Meta Tags
          </TabsTrigger>
          <TabsTrigger value="seo-score" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            SEO Score
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="meta-tags" className="mt-4">
          <MetaTagManager />
        </TabsContent>
        
        <TabsContent value="seo-score" className="mt-4">
          <SeoScoreTool />
        </TabsContent>
      </Tabs>
    </AnimatedTransition>
  );
};

export default SeoTools;
