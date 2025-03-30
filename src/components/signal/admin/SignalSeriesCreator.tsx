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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, MinusCircle, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { SignalContentType, SignalSeriesWithStats, SignalStep, SignalSeries } from '@/types/signal';
import { useForm } from 'react-hook-form';
import SignalStepEditor from './SignalStepEditor';
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignalSeriesPreview from './SignalSeriesPreview';

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
                <div className="grid grid-cols-1 gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Series Name</Label>
                        <Input
                          id="name"
                          placeholder="Enter series name"
                          {...form.register('name', { required: true })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Enter a brief description of this series"
                          {...form.register('description', { required: true })}
                          rows={3}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="contentType">Content Type</Label>
                        <Select
                          defaultValue={form.getValues('contentType')}
                          onValueChange={(value) => form.setValue('contentType', value as SignalContentType)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select content type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="article">Article</SelectItem>
                            <SelectItem value="mixed">Mixed Content</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                        <Input
                          id="thumbnailUrl"
                          placeholder="https://example.com/thumbnail.jpg"
                          {...form.register('thumbnailUrl')}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="featuredImageUrl">Featured Image URL</Label>
                        <Input
                          id="featuredImageUrl"
                          placeholder="https://example.com/featured-image.jpg"
                          {...form.register('featuredImageUrl')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between space-x-2 pt-4">
                        <Label htmlFor="published" className="flex items-center space-x-2 cursor-pointer">
                          <span>Published</span>
                        </Label>
                        <Switch
                          id="published"
                          checked={form.watch('published')}
                          onCheckedChange={(checked) => form.setValue('published', checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Series Steps</h3>
                      {!currentStep && (
                        <Button type="button" onClick={addNewStep} variant="outline" size="sm">
                          <PlusCircle className="mr-2 h-4 w-4" /> Add Step
                        </Button>
                      )}
                    </div>
                    
                    {steps.length === 0 && !currentStep && (
                      <div className="text-center py-8 border border-dashed rounded-md">
                        <h4 className="font-medium mb-2">No Steps Added Yet</h4>
                        <p className="text-muted-foreground mb-4">
                          Add steps to create your educational series
                        </p>
                        <Button type="button" onClick={addNewStep} variant="outline">
                          <PlusCircle className="mr-2 h-4 w-4" /> Add First Step
                        </Button>
                      </div>
                    )}
                    
                    {steps.length > 0 && !currentStep && (
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
                                onClick={() => moveStep(index, 'up')}
                                disabled={index === 0}
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon"
                                onClick={() => moveStep(index, 'down')}
                                disabled={index === steps.length - 1}
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon"
                                onClick={() => editStep(index)}
                              >
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.33168 11.3754 6.42165 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42165 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42165 9.28547Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                                </svg>
                              </Button>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon"
                                onClick={() => deleteStep(index)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {currentStep && (
                      <SignalStepEditor 
                        step={currentStep}
                        onSave={saveStep}
                        onCancel={cancelStepEdit}
                      />
                    )}
                  </div>
                </div>
                
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
