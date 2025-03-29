
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import ContentCTAForm from "./ContentCTAForm";
import { ContentCTA, ReferralProgram } from "@/types/referral";

interface EditContentCTADialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: Partial<ContentCTA>;
  programs: ReferralProgram[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onSave: () => void;
}

const EditContentCTADialog = ({
  open,
  onOpenChange,
  formData,
  programs,
  onInputChange,
  onSelectChange,
  onSave
}: EditContentCTADialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Call to Action</DialogTitle>
          <DialogDescription>
            Update this CTA's settings
          </DialogDescription>
        </DialogHeader>
        
        <ContentCTAForm 
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

export default EditContentCTADialog;
