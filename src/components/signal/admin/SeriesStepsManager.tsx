
import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from 'lucide-react';
import { SignalStep } from '@/types/signal';
import StepsList from './StepsList';
import SignalStepEditor from './SignalStepEditor';

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
  const addNewStep = () => {
    const newStep: SignalStep = {
      id: `step-${Date.now()}`,
      title: `Step ${steps.length + 1}`,
      content: '',
      order: steps.length,
      ctas: []
    };
    setCurrentStep(newStep);
    setEditingStepIndex(null);
  };

  const editStep = (index: number) => {
    setCurrentStep({...steps[index]});
    setEditingStepIndex(index);
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === steps.length - 1)
    ) {
      return;
    }

    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    
    newSteps.forEach((step, idx) => {
      step.order = idx;
    });
    
    setSteps(newSteps);
  };

  const deleteStep = (index: number) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    
    newSteps.forEach((step, idx) => {
      step.order = idx;
    });
    
    setSteps(newSteps);
  };

  const saveStep = (step: SignalStep) => {
    let newSteps: SignalStep[];
    
    if (editingStepIndex !== null) {
      newSteps = [...steps];
      newSteps[editingStepIndex] = step;
    } else {
      newSteps = [...steps, step];
    }
    
    newSteps.sort((a, b) => a.order - b.order);
    
    setSteps(newSteps);
    setCurrentStep(null);
    setEditingStepIndex(null);
  };

  const cancelStepEdit = () => {
    setCurrentStep(null);
    setEditingStepIndex(null);
  };

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
