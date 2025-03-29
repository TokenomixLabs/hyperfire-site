
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import CTAForm from "./CTAForm";
import { CampaignCTA, ReferralProgram } from "@/types/referral";

interface EditCTADialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: Partial<CampaignCTA>;
  programs: ReferralProgram[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onSave: () => void;
}

const EditCTADialog = ({
  open,
  onOpenChange,
  formData,
  programs,
  onInputChange,
  onSelectChange,
  onSave
}: EditCTADialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Call to Action</DialogTitle>
          <DialogDescription>
            Update the details of this CTA
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
          <Button onClick={onSave}>Update CTA</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCTADialog;
