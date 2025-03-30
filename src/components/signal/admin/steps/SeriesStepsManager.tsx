
import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from 'lucide-react';
import { SignalStep } from '@/types/signal';
import StepsList from './StepsList';
import SignalStepEditor from '../SignalStepEditor';
import { useStepsManager } from './useStepsManager';

interface SeriesStepsManagerProps {
  steps: SignalStep[];
  currentStep: SignalStep | null;
  setSteps: (steps: SignalStep[]) => void;
  setCurrentStep: (step: SignalStep | null) => void;
  editingStepIndex: number | null;
  setEditingStepIndex: (index: number | null) => void;
}

const SeriesStepsManager: React.FC<SeriesStepsManagerProps> = ({
  steps,
  currentStep,
  setSteps,
  setCurrentStep,
  editingStepIndex,
  setEditingStepIndex
}) => {
  const {
    addNewStep,
    editStep,
    moveStep,
    deleteStep,
    saveStep,
    cancelStepEdit
  } = useStepsManager({
    steps,
    setSteps,
    currentStep,
    setCurrentStep,
    editingStepIndex,
    setEditingStepIndex
  });

  return (
    <div className="space-y-4">
      <Separator className="my-4" />
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Series Steps</h3>
        {!currentStep && (
          <Button type="button" onClick={addNewStep} variant="outline" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Step
          </Button>
        )}
      </div>
      
      {!currentStep && (
        <StepsList 
          steps={steps} 
          onAddStep={addNewStep}
          onEditStep={editStep}
          onMoveStep={moveStep}
          onDeleteStep={deleteStep}
        />
      )}
      
      {currentStep && (
        <SignalStepEditor 
          step={currentStep}
          onSave={saveStep}
          onCancel={cancelStepEdit}
        />
      )}
    </div>
  );
};

export default SeriesStepsManager;
