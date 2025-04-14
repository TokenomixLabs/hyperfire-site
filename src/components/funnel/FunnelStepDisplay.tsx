
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight } from 'lucide-react';
import { FunnelStep } from '@/types/funnel';

interface FunnelStepDisplayProps {
  step: FunnelStep;
  stepIndex: number;
  totalSteps: number;
  onCtaClick: () => void;
}

const FunnelStepDisplay: React.FC<FunnelStepDisplayProps> = ({
  step,
  stepIndex,
  totalSteps,
  onCtaClick
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            {step.customHeadline || step.title}
          </h1>
          
          {/* Progress indicator */}
          <div className="flex justify-center items-center space-x-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div 
                key={index}
                className={`h-2 w-12 rounded-full transition-colors ${
                  index === stepIndex 
                    ? 'bg-purple-600' 
                    : index < stepIndex
                    ? 'bg-purple-300'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Video content */}
        {step.videoUrl && (
          <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
            <iframe
              src={step.videoUrl}
              title={step.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        )}
        
        {/* Thumbnail fallback (if no video) */}
        {!step.videoUrl && step.thumbnailUrl && (
          <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
            <img 
              src={step.thumbnailUrl} 
              alt={step.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Text content */}
        {step.customText && (
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-center">{step.customText}</p>
          </div>
        )}
        
        {/* CTA Button */}
        <div className="flex justify-center mt-8">
          <Button 
            onClick={onCtaClick}
            className="px-8 py-6 text-lg bg-purple-600 hover:bg-purple-700"
          >
            {step.ctaText}
            {step.ctaAction === 'next_step' && (
              <ChevronRight className="ml-2 h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FunnelStepDisplay;
