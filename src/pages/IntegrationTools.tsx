
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Code, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedTransition from "@/components/AnimatedTransition";
import { useToast } from "@/hooks/use-toast";
import EmbedCodeGenerator from "@/components/EmbedCodeGenerator";
import ApiKeyManager from "@/components/ApiKeyManager";

const IntegrationTools = () => {
  const [activeTab, setActiveTab] = useState("embeds");
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
          <h1 className="text-2xl font-bold">Integration Tools</h1>
        </div>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-2 mb-8">
          <TabsTrigger value="embeds" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Embed Codes
          </TabsTrigger>
          <TabsTrigger value="api-keys" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API Keys
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="embeds" className="mt-4">
          <EmbedCodeGenerator />
        </TabsContent>
        
        <TabsContent value="api-keys" className="mt-4">
          <ApiKeyManager />
        </TabsContent>
      </Tabs>
    </AnimatedTransition>
  );
};

export default IntegrationTools;
