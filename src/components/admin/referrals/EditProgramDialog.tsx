
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import ProgramForm from "./ProgramForm";

interface EditProgramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSwitchChange: (checked: boolean) => void;
  onSave: () => void;
}

const EditProgramDialog = ({
  open,
  onOpenChange,
  formData,
  onInputChange,
  onSwitchChange,
  onSave
}: EditProgramDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Referral Program</DialogTitle>
          <DialogDescription>
            Update the details of this referral program
          </DialogDescription>
        </DialogHeader>
        
        <ProgramForm 
          formData={formData}
          onChange={onInputChange}
          onSwitchChange={onSwitchChange}
          isEdit={true}
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSave}>Update Program</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProgramDialog;
