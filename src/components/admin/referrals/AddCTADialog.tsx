
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import CTAForm from "./CTAForm";
import { CampaignCTA, ReferralProgram } from "@/types/referral";

interface AddCTADialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: Partial<CampaignCTA>;
  programs: ReferralProgram[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onSave: () => void;
}

const AddCTADialog = ({
  open,
  onOpenChange,
  formData,
  programs,
  onInputChange,
  onSelectChange,
  onSave
}: AddCTADialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Call to Action</DialogTitle>
          <DialogDescription>
            Create a new CTA that can be added to content
          </DialogDescription>
        </DialogHeader>
        
        <CTAForm 
          formData={formData}
          programs={programs}
          onInputChange={onInputChange}
          onSelectChange={onSelectChange}
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSave}>Save CTA</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCTADialog;
