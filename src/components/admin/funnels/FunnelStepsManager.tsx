
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Plus, Trash2, Edit, Play } from 'lucide-react';
import { Funnel, FunnelStep } from '@/types/funnel';
import { useToast } from '@/hooks/use-toast';
import StepFormDialog from './StepFormDialog';

interface FunnelStepsManagerProps {
  funnel: Funnel;
  onUpdate: (steps: FunnelStep[]) => void;
}

export default function FunnelStepsManager({ funnel, onUpdate }: FunnelStepsManagerProps) {
  const [steps, setSteps] = useState<FunnelStep[]>(funnel.steps || []);
  const [editingStep, setEditingStep] = useState<FunnelStep | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex === destinationIndex) return;
    
    const updatedSteps = Array.from(steps);
    const [movedStep] = updatedSteps.splice(sourceIndex, 1);
    updatedSteps.splice(destinationIndex, 0, movedStep);
    
    // Update the order property for each step
    const reorderedSteps = updatedSteps.map((step, index) => ({
      ...step,
      order: index,
      isLastStep: index === updatedSteps.length - 1
    }));
    
    setSteps(reorderedSteps);
    onUpdate(reorderedSteps);
    
    toast({
      title: "Steps reordered",
      description: "The funnel steps have been reordered.",
    });
  };

  const handleAddStep = () => {
    setIsCreating(true);
    
    const newStep: FunnelStep = {
      id: `step_${Date.now()}`,
      funnelId: funnel.id || '',
      title: `Step ${steps.length + 1}`,
      description: '',
      order: steps.length,
      ctaText: 'Continue',
      ctaAction: steps.length === 0 ? 'next_step' : 'join_community',
      trackingId: `step_${Date.now()}_track`,
      isLastStep: steps.length === 0
    };
    
    setEditingStep(newStep);
    setIsDialogOpen(true);
  };

  const handleEditStep = (step: FunnelStep) => {
    setIsCreating(false);
    setEditingStep(step);
    setIsDialogOpen(true);
  };

  const handleDeleteStep = (stepId: string) => {
    const updatedSteps = steps.filter(step => step.id !== stepId)
      .map((step, index) => ({
        ...step,
        order: index,
        isLastStep: index === updatedSteps.length - 1
      }));
    
    setSteps(updatedSteps);
    onUpdate(updatedSteps);
    
    toast({
      title: "Step deleted",
      description: "The funnel step has been deleted.",
    });
  };

  const handleSaveStep = (step: FunnelStep) => {
    let updatedSteps: FunnelStep[];
    
    if (isCreating) {
      updatedSteps = [...steps, step].map((s, index) => ({
        ...s,
        order: index,
        isLastStep: index === steps.length // The new step is the last one
      }));
    } else {
      updatedSteps = steps.map(s => 
        s.id === step.id ? { ...step, isLastStep: s.order === steps.length - 1 } : s
      );
    }
    
    setSteps(updatedSteps);
    onUpdate(updatedSteps);
    setIsDialogOpen(false);
    setEditingStep(null);
    
    toast({
      title: isCreating ? "Step added" : "Step updated",
      description: isCreating 
        ? "The new funnel step has been added." 
        : "The funnel step has been updated.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Funnel Steps</h2>
        <Button 
          onClick={handleAddStep}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Step
        </Button>
      </div>
      
      {steps.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-6 h-48">
            <p className="text-muted-foreground mb-4">No steps created yet. Add your first step to get started.</p>
            <Button 
              onClick={handleAddStep}
              variant="outline"
              className="border-purple-400 text-purple-600"
            >
              <Plus className="mr-2 h-4 w-4" /> Add First Step
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="funnel-steps">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {steps.map((step, index) => (
                  <Draggable key={step.id} draggableId={step.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Card className="border border-gray-200 hover:border-purple-300 transition-colors">
                          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                            <div>
                              <CardTitle className="text-lg font-medium">
                                Step {index + 1}: {step.title}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {step.description || 'No description'}
                              </CardDescription>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditStep(step)}
                                className="h-8 w-8"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteStep(step.id)}
                                className="h-8 w-8 text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                  CTA Button
                                </p>
                                <p className="text-sm">
                                  "{step.ctaText}" → {step.ctaAction.replace('_', ' ')}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                  Content
                                </p>
                                <p className="text-sm">
                                  {step.videoUrl ? 'Has video' : 'No video'} 
                                  {step.customHeadline ? ` • Custom headline` : ''}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="pt-0">
                            <div className="flex justify-between w-full">
                              <div>
                                {step.isLastStep && (
                                  <span className="text-xs font-medium px-2 py-1 bg-amber-100 text-amber-800 rounded-md">
                                    Final Step
                                  </span>
                                )}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => {
                                  toast({
                                    title: "Preview not available",
                                    description: "Step preview is not yet implemented.",
                                  });
                                }}
                              >
                                <Play className="h-3 w-3 mr-1" /> Preview Step
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      
      <StepFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        step={editingStep}
        onSave={handleSaveStep}
        isCreating={isCreating}
      />
    </div>
  );
}
