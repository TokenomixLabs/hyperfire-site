
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SignalSeries } from '@/types/signal';
import ContentCTA from '@/components/content/ContentCTA';
import { ReferralPlatform } from '@/context/ReferralContext';
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';

interface SignalSeriesPreviewProps {
  series: SignalSeries;
}

const SignalSeriesPreview: React.FC<SignalSeriesPreviewProps> = ({ series }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  if (series.steps.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
          <h3 className="text-xl font-medium mb-2">No Steps Available</h3>
          <p className="text-muted-foreground mb-4">
            Add steps to your Signal Series to see a preview
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const currentStep = series.steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / series.steps.length) * 100;
  
  const goToNextStep = () => {
    if (currentStepIndex < series.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  
  const campaignNames: Record<string, string> = {
    "insiderlife": "InsiderLife",
    "insiderdao": "InsiderDAO", 
    "societi": "Societi",
    "aifc": "AI Freedom Code"
  };
  
  const campaignToPlatformMap: Record<string, ReferralPlatform> = {
    "insiderlife": "insiderlife",
    "insiderdao": "insiderdao",
    "societi": "societi", 
    "aifc": "aifc"
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="relative overflow-hidden">
          {series.featuredImageUrl && (
            <div className="absolute inset-0 bg-cover bg-center" style={{ 
              backgroundImage: `url(${series.featuredImageUrl})`,
              opacity: 0.2,
              filter: 'blur(4px)'
            }} />
          )}
          <div className="relative">
            <CardTitle className="text-2xl">{series.name}</CardTitle>
            <CardDescription className="mt-2 text-base">
              {series.description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Step {currentStepIndex + 1} of {series.steps.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <div className="p-4 border rounded-md">
              <h2 className="text-xl font-bold mb-4">{currentStep.title}</h2>
              
              {currentStep.videoEmbed && (
                <div className="aspect-video mb-6 bg-gray-200 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    [Video Embed Would Appear Here]
                  </div>
                </div>
              )}
              
              {currentStep.mediaUrl && (
                <div className="mb-6">
                  <img 
                    src={currentStep.mediaUrl} 
                    alt={currentStep.title}
                    className="rounded-md max-h-[400px] object-contain"
                  />
                </div>
              )}
              
              <div className="prose dark:prose-invert max-w-none">
                {currentStep.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('# ')) {
                    return <h1 key={index} className="text-2xl font-bold mt-6 mb-4">{paragraph.replace('# ', '')}</h1>;
                  } else if (paragraph.startsWith('## ')) {
                    return <h2 key={index} className="text-xl font-bold mt-5 mb-3">{paragraph.replace('## ', '')}</h2>;
                  } else if (paragraph.startsWith('- ')) {
                    const items = paragraph.split('\n').filter(item => item.startsWith('- '));
                    return (
                      <ul key={index} className="list-disc pl-5 my-4">
                        {items.map((item, itemIndex) => (
                          <li key={itemIndex}>{item.replace('- ', '')}</li>
                        ))}
                      </ul>
                    );
                  } else if (paragraph.startsWith('1. ')) {
                    const items = paragraph.split('\n').filter(item => /^\d+\.\s/.test(item));
                    return (
                      <ol key={index} className="list-decimal pl-5 my-4">
                        {items.map((item, itemIndex) => (
                          <li key={itemIndex}>{item.replace(/^\d+\.\s/, '')}</li>
                        ))}
                      </ol>
                    );
                  } else if (paragraph.trim() !== '') {
                    return <p key={index} className="my-4">{paragraph}</p>;
                  }
                  return null;
                })}
              </div>
              
              {/* Render CTAs */}
              {currentStep.ctas.length > 0 && (
                <div className="mt-8 space-y-4">
                  {currentStep.ctas.map((cta) => {
                    const platformId = campaignToPlatformMap[cta.campaignId] || "insiderlife";
                    const campaignName = campaignNames[cta.campaignId] || "InsiderLife";
                    
                    return (
                      <ContentCTA
                        key={cta.id}
                        cta={cta}
                        contentTitle={series.name + " - " + currentStep.title}
                        campaignName={campaignName}
                        platformId={platformId as ReferralPlatform}
                        dismissible={false}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={goToPreviousStep} 
            disabled={currentStepIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button 
            onClick={goToNextStep} 
            disabled={currentStepIndex === series.steps.length - 1}
          >
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignalSeriesPreview;
