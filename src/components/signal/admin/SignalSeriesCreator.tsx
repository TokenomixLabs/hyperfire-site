
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignalContentType, SignalSeriesWithStats, SignalStep } from '@/types/signal';
import { useForm } from 'react-hook-form';
import SignalSeriesPreview from './SignalSeriesPreview';
import SeriesForm from './SeriesForm';
import SeriesStepsManager from './SeriesStepsManager';

interface SignalSeriesCreatorProps {
  editingSeries: SignalSeriesWithStats | null;
  onSave: (series: SignalSeriesWithStats) => void;
  onCancel: () => void;
}

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const SignalSeriesCreator: React.FC<SignalSeriesCreatorProps> = ({
  editingSeries,
  onSave,
  onCancel
}) => {
  const [steps, setSteps] = useState<SignalStep[]>([]);
  const [currentStep, setCurrentStep] = useState<SignalStep | null>(null);
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const form = useForm({
    defaultValues: {
      name: editingSeries?.name || '',
      description: editingSeries?.description || '',
      contentType: editingSeries?.contentType || 'video' as SignalContentType,
      thumbnailUrl: editingSeries?.thumbnailUrl || '',
      featuredImageUrl: editingSeries?.featuredImageUrl || '',
      published: editingSeries?.published || false,
    }
  });

  useEffect(() => {
    if (editingSeries) {
      setSteps(editingSeries.steps.sort((a, b) => a.order - b.order));
      form.reset({
        name: editingSeries.name,
        description: editingSeries.description,
        contentType: editingSeries.contentType,
        thumbnailUrl: editingSeries.thumbnailUrl || '',
        featuredImageUrl: editingSeries.featuredImageUrl || '',
        published: editingSeries.published,
      });
    } else {
      setSteps([]);
      form.reset({
        name: '',
        description: '',
        contentType: 'video',
        thumbnailUrl: '',
        featuredImageUrl: '',
        published: false,
      });
    }
  }, [editingSeries, form]);

  const onSubmit = (data: any) => {
    if (steps.length === 0) {
      alert("You must add at least one step to your Signal Series");
      return;
    }

    const slug = generateSlug(data.name);
    
    const savedSeries: SignalSeriesWithStats = {
      id: editingSeries?.id || `signal-${Date.now()}`,
      name: data.name,
      slug,
      description: data.description,
      contentType: data.contentType,
      thumbnailUrl: data.thumbnailUrl,
      featuredImageUrl: data.featuredImageUrl,
      createdBy: "admin",
      createdAt: editingSeries?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published: data.published,
      steps: steps,
      isDuplicated: editingSeries?.isDuplicated || false,
      originalSeriesId: editingSeries?.originalSeriesId,
      stats: editingSeries?.stats || {
        views: 0,
        ctaClicks: 0,
        conversions: 0,
        shares: 0
      }
    };
    
    onSave(savedSeries);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="edit" onValueChange={(value) => setPreviewMode(value === 'preview')}>
        <TabsList>
          <TabsTrigger value="edit">Edit Series</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{editingSeries ? 'Edit Signal Series' : 'Create New Signal Series'}</CardTitle>
              <CardDescription>
                Create a structured educational series with multiple steps and calls to action
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <SeriesForm form={form} />
                
                <SeriesStepsManager 
                  steps={steps}
                  currentStep={currentStep}
                  setSteps={setSteps}
                  setCurrentStep={setCurrentStep}
                  editingStepIndex={editingStepIndex}
                  setEditingStepIndex={setEditingStepIndex}
                />
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={steps.length === 0}>
                    {editingSeries ? 'Update Series' : 'Create Series'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview">
          <SignalSeriesPreview 
            series={{
              id: editingSeries?.id || 'preview',
              name: form.watch('name') || 'Preview Series',
              slug: generateSlug(form.watch('name') || 'preview-series'),
              description: form.watch('description') || 'No description provided',
              contentType: form.watch('contentType') as SignalContentType,
              thumbnailUrl: form.watch('thumbnailUrl'),
              featuredImageUrl: form.watch('featuredImageUrl'),
              createdBy: 'admin',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              published: form.watch('published'),
              steps: steps,
              isDuplicated: false,
              stats: {
                views: 0,
                ctaClicks: 0,
                conversions: 0,
                shares: 0
              }
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SignalSeriesCreator;
