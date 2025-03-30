
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import { SignalStep } from '@/types/signal';
import { ReferralProgram } from '@/types/referral';
import CTAListItem from './CTAListItem';

interface CTAsTabContentProps {
  editedStep: SignalStep;
  programs: ReferralProgram[];
  onAddCTA: () => void;
  onEditCTA: (index: number) => void;
  onDeleteCTA: (index: number) => void;
}

const CTAsTabContent: React.FC<CTAsTabContentProps> = ({
  editedStep,
  programs,
  onAddCTA,
  onEditCTA,
  onDeleteCTA
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Step CTAs</h3>
        <Button type="button" onClick={onAddCTA} variant="outline" size="sm">
          <PlusCircle className="mr-2 h-4 w-4" /> Add CTA
        </Button>
      </div>
      
      {editedStep.ctas.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-md">
          <h4 className="font-medium mb-2">No CTAs Added Yet</h4>
          <p className="text-muted-foreground mb-4">
            Add calls to action to engage your audience
          </p>
          <Button type="button" onClick={onAddCTA} variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" /> Add First CTA
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {editedStep.ctas.map((cta, index) => {
            const program = programs.find(p => p.id === cta.campaignId);
            
            return (
              <CTAListItem
                key={cta.id}
                cta={cta}
                program={program}
                onEdit={() => onEditCTA(index)}
                onDelete={() => onDeleteCTA(index)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CTAsTabContent;
