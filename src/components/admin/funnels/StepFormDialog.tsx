
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FunnelStep, FunnelStepAction } from '@/types/funnel';

const stepSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal('')),
  thumbnailUrl: z.string().url().optional().or(z.literal('')),
  ctaText: z.string().min(1, {
    message: "CTA text is required.",
  }),
  ctaAction: z.enum(['next_step', 'join_community', 'purchase', 'go_to_training', 'go_to_course', 'go_to_dashboard', 'external_url']),
  ctaUrl: z.string().optional(),
  customHeadline: z.string().optional(),
  customText: z.string().optional(),
});

interface StepFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  step: FunnelStep | null;
  onSave: (step: FunnelStep) => void;
  isCreating: boolean;
}

export default function StepFormDialog({ 
  open, 
  onOpenChange, 
  step, 
  onSave,
  isCreating 
}: StepFormDialogProps) {
  const [activeTab, setActiveTab] = React.useState("content");

  const form = useForm<z.infer<typeof stepSchema>>({
    resolver: zodResolver(stepSchema),
    defaultValues: {
      title: step?.title || '',
      description: step?.description || '',
      videoUrl: step?.videoUrl || '',
      thumbnailUrl: step?.thumbnailUrl || '',
      ctaText: step?.ctaText || 'Continue',
      ctaAction: step?.ctaAction || 'next_step',
      ctaUrl: step?.ctaUrl || '',
      customHeadline: step?.customHeadline || '',
      customText: step?.customText || '',
    },
  });

  React.useEffect(() => {
    if (step) {
      form.reset({
        title: step.title || '',
        description: step.description || '',
        videoUrl: step.videoUrl || '',
        thumbnailUrl: step.thumbnailUrl || '',
        ctaText: step.ctaText || 'Continue',
        ctaAction: step.ctaAction || 'next_step',
        ctaUrl: step.ctaUrl || '',
        customHeadline: step.customHeadline || '',
        customText: step.customText || '',
      });
    }
  }, [step, form]);

  const handleSubmit = (values: z.infer<typeof stepSchema>) => {
    if (!step) return;
    
    onSave({
      ...step,
      ...values,
    });
  };

  // Watch for ctaAction changes to conditionally show/hide ctaUrl field
  const ctaAction = form.watch("ctaAction");
  const showCtaUrl = ['external_url', 'go_to_course', 'go_to_training'].includes(ctaAction);

  const actionLabels: Record<FunnelStepAction, string> = {
    next_step: 'Continue to next step',
    join_community: 'Join the community',
    purchase: 'Make a purchase',
    go_to_training: 'Go to training content',
    go_to_course: 'Go to a specific course',
    go_to_dashboard: 'Go to dashboard',
    external_url: 'Go to external URL',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {isCreating ? "Add New Funnel Step" : "Edit Funnel Step"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="cta">Call to Action</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Step Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter step title" {...field} />
                      </FormControl>
                      <FormDescription>
                        The internal title of this step for organization.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Brief description of this step" {...field} />
                      </FormControl>
                      <FormDescription>
                        For internal use only. This won't be shown to users.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="customHeadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Headline (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter headline shown to users" {...field} />
                      </FormControl>
                      <FormDescription>
                        The main headline displayed to users on this step.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="customText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Text (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter text content for this step" 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Supporting text content displayed to users.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="cta" className="space-y-4">
                <FormField
                  control={form.control}
                  name="ctaText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTA Button Text</FormLabel>
                      <FormControl>
                        <Input placeholder="Continue" {...field} />
                      </FormControl>
                      <FormDescription>
                        The text displayed on the call-to-action button.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ctaAction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTA Action</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select action" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(actionLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        What happens when the user clicks the CTA button.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {showCtaUrl && (
                  <FormField
                    control={form.control}
                    name="ctaUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {ctaAction === 'external_url' ? 'External URL' : 
                           ctaAction === 'go_to_course' ? 'Course ID or URL' : 
                           'Training Content URL'}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={
                              ctaAction === 'external_url' ? 'https://example.com' : 
                              ctaAction === 'go_to_course' ? 'course-123 or URL' : 
                              '/training/content-path'
                            } 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          {ctaAction === 'external_url' 
                            ? 'The external URL to redirect to when the CTA is clicked.' 
                            : 'The ID or URL of the content to redirect to.'}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="media" className="space-y-4">
                <FormField
                  control={form.control}
                  name="videoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video URL (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://www.youtube.com/embed/..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Embed URL for YouTube, Vimeo, or other video platforms.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="thumbnailUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail Image URL (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/image.jpg" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Image to display as thumbnail for this step.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isCreating ? "Add Step" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
