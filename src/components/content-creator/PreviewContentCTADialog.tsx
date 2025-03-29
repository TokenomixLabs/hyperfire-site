
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ContentCTA } from "@/types/referral";
import { ChevronRight } from "lucide-react";

interface PreviewContentCTADialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCTA: ContentCTA | null;
  getCampaignName: (campaignId: string) => string;
}

const PreviewContentCTADialog = ({
  open,
  onOpenChange,
  currentCTA,
  getCampaignName
}: PreviewContentCTADialogProps) => {
  if (!currentCTA) return null;

  const renderPreview = () => {
    const campaignName = getCampaignName(currentCTA.campaignId);
    
    switch (currentCTA.placement) {
      case "banner":
        return (
          <div className={`w-full p-4 rounded-md ${currentCTA.theme === 'primary' ? 'bg-purple-600 text-white' : currentCTA.theme === 'minimal' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'}`}>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{currentCTA.buttonText}</p>
                {currentCTA.description && <p className="text-sm mt-1 opacity-90">{currentCTA.description}</p>}
              </div>
              <Button 
                className={currentCTA.theme === 'primary' ? 'bg-white text-purple-600 hover:bg-gray-100' : 'bg-blue-600 text-white hover:bg-blue-700'}
                size="sm"
              >
                {currentCTA.buttonText} <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      
      case "card":
        return (
          <div className={`w-full rounded-md border overflow-hidden ${currentCTA.theme === 'minimal' ? 'border-gray-200' : 'border-blue-200'}`}>
            <div className={`p-4 ${currentCTA.theme === 'primary' ? 'bg-purple-600 text-white' : currentCTA.theme === 'minimal' ? 'bg-white' : 'bg-blue-50'}`}>
              <p className="font-medium">{currentCTA.buttonText}</p>
              {currentCTA.description && <p className="text-sm mt-2 opacity-90">{currentCTA.description}</p>}
              <Button 
                className={`w-full mt-4 ${currentCTA.theme === 'primary' ? 'bg-white text-purple-600 hover:bg-gray-100' : currentCTA.theme === 'minimal' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                {currentCTA.buttonText} <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      
      case "inline":
      default:
        return (
          <div className="w-full">
            {currentCTA.description && <p className="text-sm mb-2">{currentCTA.description}</p>}
            <Button 
              className={`${currentCTA.theme === 'primary' ? 'bg-purple-600 hover:bg-purple-700' : currentCTA.theme === 'minimal' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {currentCTA.buttonText} <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        );
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Preview CTA</DialogTitle>
          <DialogDescription>
            This is how the CTA will appear to content viewers
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4 pb-4 border-b">
            <div className="text-sm font-medium mb-1">Campaign</div>
            <div>{getCampaignName(currentCTA.campaignId)}</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium">Visual Preview</div>
            <div className="border p-4 rounded-md">
              {renderPreview()}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewContentCTADialog;
