
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import GlobalCTA from "@/components/GlobalCTA";
import { CampaignCTA } from "@/types/referral";

interface PreviewCTADialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCTA: CampaignCTA | null;
  getProgramName: (programId: string) => string;
  getProgramPlatform: (programId: string) => string;
}

const PreviewCTADialog = ({
  open,
  onOpenChange,
  currentCTA,
  getProgramName,
  getProgramPlatform
}: PreviewCTADialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>CTA Preview</DialogTitle>
          <DialogDescription>
            This is how the CTA will appear to users
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {currentCTA && (
            <div className="space-y-4">
              <div className="border p-4 rounded-md">
                <GlobalCTA
                  id={currentCTA.id}
                  title={currentCTA.buttonText}
                  description={currentCTA.description}
                  buttonText={currentCTA.buttonText}
                  buttonUrl="#"
                  type={currentCTA.placement as any}
                  brand={getProgramPlatform(currentCTA.programId)}
                  theme={currentCTA.theme as any}
                  position={currentCTA.position as any}
                />
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                <h3 className="text-sm font-medium mb-1">How it works:</h3>
                <p className="text-sm text-muted-foreground">
                  When users view or share content with this CTA, the button link will automatically include their personal referral link for {getProgramName(currentCTA.programId)}. This ensures they get credit for any signups that come through their shared content.
                </p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewCTADialog;
