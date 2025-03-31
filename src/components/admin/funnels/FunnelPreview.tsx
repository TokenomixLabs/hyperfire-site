
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Funnel, FunnelStep } from '@/types/funnel';

interface FunnelPreviewProps {
  funnel: Funnel;
}

export default function FunnelPreview({ funnel }: FunnelPreviewProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const steps = funnel.steps || [];
  const currentStep = steps[currentStepIndex];
  
  const handlePrevStep = () => {
    setCurrentStepIndex(Math.max(0, currentStepIndex - 1));
  };
  
  const handleNextStep = () => {
    setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1));
  };
  
  if (steps.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8 h-64">
          <p className="text-muted-foreground mb-2">No steps to preview</p>
          <p className="text-sm text-muted-foreground">Add steps to your funnel to see a preview.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold">Step {currentStepIndex + 1} Preview</h2>
          <span className="text-sm text-muted-foreground">of {steps.length}</span>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextStep}
            disabled={currentStepIndex === steps.length - 1}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="w-full h-[600px] bg-gray-50 dark:bg-gray-900 overflow-hidden">
            <div className="max-w-3xl mx-auto h-full flex flex-col">
              {/* Preview Header */}
              <div className="h-16 border-b flex items-center px-6">
                <div className="text-lg font-medium">
                  {funnel.title} - Preview Mode
                </div>
              </div>
              
              {/* Preview Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-2xl mx-auto space-y-6">
                  {/* Headline */}
                  <h1 className="text-3xl font-bold text-center">
                    {currentStep.customHeadline || currentStep.title}
                  </h1>
                  
                  {/* Video (if available) */}
                  {currentStep.videoUrl && (
                    <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                      <iframe
                        src={currentStep.videoUrl}
                        title={currentStep.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    </div>
                  )}
                  
                  {/* Thumbnail fallback (if no video) */}
                  {!currentStep.videoUrl && currentStep.thumbnailUrl && (
                    <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                      <img 
                        src={currentStep.thumbnailUrl} 
                        alt={currentStep.title}
                        className="max-h-full max-w-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Default placeholder if no video or thumbnail */}
                  {!currentStep.videoUrl && !currentStep.thumbnailUrl && (
                    <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No media content</span>
                    </div>
                  )}
                  
                  {/* Content Text */}
                  {currentStep.customText && (
                    <div className="prose dark:prose-invert max-w-none">
                      <p>{currentStep.customText}</p>
                    </div>
                  )}
                  
                  {/* CTA Button */}
                  <div className="flex justify-center mt-8">
                    <Button className="px-8 py-6 text-lg bg-purple-600 hover:bg-purple-700">
                      {currentStep.ctaText}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
