
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import ProgramForm from "./ProgramForm";

interface AddProgramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSwitchChange: (checked: boolean) => void;
  onSave: () => void;
}

const AddProgramDialog = ({
  open,
  onOpenChange,
  formData,
  onInputChange,
  onSwitchChange,
  onSave
}: AddProgramDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Referral Program</DialogTitle>
          <DialogDescription>
            Create a new referral program for your users to join
          </DialogDescription>
        </DialogHeader>
        
        <ProgramForm 
          formData={formData}
          onChange={onInputChange}
          onSwitchChange={onSwitchChange}
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSave}>Save Program</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProgramDialog;
