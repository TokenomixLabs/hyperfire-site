
import React from 'react';
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import ContentCTAForm from '@/components/content-creator/ContentCTAForm';
import { ContentCTA } from '@/types/referral';
import { ReferralProgram } from '@/types/referral';

interface CTADialogContentProps {
  ctaFormData: Partial<ContentCTA>;
  programs: ReferralProgram[];
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const CTADialogContent: React.FC<CTADialogContentProps> = ({
  ctaFormData,
  programs,
  isEditing,
  onInputChange,
  onSelectChange,
  onSave,
  onCancel
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEditing ? 'Edit Call to Action' : 'Add Call to Action'}</DialogTitle>
      </DialogHeader>
      
      <ContentCTAForm 
        formData={ctaFormData}
        programs={programs}
        onInputChange={onInputChange}
        onSelectChange={onSelectChange}
      />
      
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={onSave}>
          {isEditing ? 'Update CTA' : 'Add CTA'}
        </Button>
      </DialogFooter>
    </>
  );
};

export default CTADialogContent;
