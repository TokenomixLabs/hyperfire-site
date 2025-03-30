
import React from 'react';
import { Button } from "@/components/ui/button";
import { SignalStep } from '@/types/signal';
import { PlusCircle, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface StepsListProps {
  steps: SignalStep[];
  onAddStep: () => void;
  onEditStep: (index: number) => void;
  onMoveStep: (index: number, direction: 'up' | 'down') => void;
  onDeleteStep: (index: number) => void;
}

const StepsList: React.FC<StepsListProps> = ({
  steps,
  onAddStep,
  onEditStep,
  onMoveStep,
  onDeleteStep
}) => {
  if (steps.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed rounded-md">
        <h4 className="font-medium mb-2">No Steps Added Yet</h4>
        <p className="text-muted-foreground mb-4">
          Add steps to create your educational series
        </p>
        <Button type="button" onClick={onAddStep} variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" /> Add First Step
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50">
          <div>
            <h4 className="font-medium">{step.title}</h4>
            <p className="text-sm text-muted-foreground">
              {step.videoEmbed ? 'Video' : 'Text'} content • {step.ctas.length} CTAs
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon"
              onClick={() => onMoveStep(index, 'up')}
              disabled={index === 0}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon"
              onClick={() => onMoveStep(index, 'down')}
              disabled={index === steps.length - 1}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon"
              onClick={() => onEditStep(index)}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.33168 11.3754 6.42165 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42165 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42165 9.28547Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon"
              onClick={() => onDeleteStep(index)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StepsList;
