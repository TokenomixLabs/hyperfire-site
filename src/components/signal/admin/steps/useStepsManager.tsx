
import { SignalStep } from '@/types/signal';
import { useState } from 'react';

interface UseStepsManagerProps {
  steps: SignalStep[];
  setSteps: (steps: SignalStep[]) => void;
  currentStep: SignalStep | null;
  setCurrentStep: (step: SignalStep | null) => void;
  editingStepIndex: number | null;
  setEditingStepIndex: (index: number | null) => void;
}

export const useStepsManager = ({
  steps,
  setSteps,
  currentStep,
  setCurrentStep,
  editingStepIndex,
  setEditingStepIndex
}: UseStepsManagerProps) => {
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

  return {
    addNewStep,
    editStep,
    moveStep,
    deleteStep,
    saveStep,
    cancelStepEdit
  };
};
