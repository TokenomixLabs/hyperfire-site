
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import ContentCTAForm from "./ContentCTAForm";
import { ContentCTA, ReferralProgram } from "@/types/referral";

interface AddContentCTADialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: Partial<ContentCTA>;
  programs: ReferralProgram[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onSave: () => void;
}

const AddContentCTADialog = ({
  open,
  onOpenChange,
  formData,
  programs,
  onInputChange,
  onSelectChange,
  onSave
}: AddContentCTADialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Call to Action</DialogTitle>
          <DialogDescription>
            Add a CTA that will be displayed with this content
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
          <Button onClick={onSave}>Add CTA</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddContentCTADialog;
