
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Course, CourseModule, CourseCategory, CourseLevel, CourseFormat, CourseAccess } from '@/types/courses';
import ModuleEditor from './ModuleEditor';
import { useToast } from '@/hooks/use-toast';

interface CourseFormProps {
  initialCourse?: Course | null;
  onSubmit: (course: Course) => void;
  onCancel: () => void;
}

const courseSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  summary: z.string().min(10, 'Summary must be at least 10 characters').max(200, 'Summary must be at most 200 characters'),
  thumbnailUrl: z.string().url('Please enter a valid URL'),
  format: z.enum(['video', 'series']),
  category: z.array(z.string()).min(1, 'Please select at least one category'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'All Levels']),
  isPublished: z.boolean(),
  isGated: z.boolean(),
  accessLevel: z.enum(['free', 'vip', 'premium']),
  ctaIds: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

type CourseFormValues = z.infer<typeof courseSchema>;

export default function CourseForm({ initialCourse, onSubmit, onCancel }: CourseFormProps) {
  const [modules, setModules] = useState<CourseModule[]>(
    initialCourse?.modules || []
  );
  const { toast } = useToast();
  
  const defaultValues: CourseFormValues = {
    title: initialCourse?.title || '',
    description: initialCourse?.description || '',
    summary: initialCourse?.summary || '',
    thumbnailUrl: initialCourse?.thumbnailUrl || '',
    format: initialCourse?.format || 'video',
    category: initialCourse?.category || [],
    level: initialCourse?.level || 'Beginner',
    isPublished: initialCourse?.isPublished || false,
    isGated: initialCourse?.isGated || false,
    accessLevel: initialCourse?.accessLevel || 'free',
    ctaIds: initialCourse?.ctaIds || [],
    tags: initialCourse?.tags || [],
  };
  
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues,
  });
  
  const watchFormat = form.watch('format');
  const watchIsGated = form.watch('isGated');
  
  const categories: CourseCategory[] = [
    'AI', 'Business', 'Sovereignty', 'Marketing', 'Technology', 'Personal Growth'
  ];
  
  const handleFormSubmit = (values: CourseFormValues) => {
    // Validate modules based on format
    if (values.format === 'series' && modules.length < 2) {
      toast({
        title: 'Invalid module configuration',
        description: 'Series courses must have at least 2 modules',
        variant: 'destructive',
      });
      return;
    } else if (values.format === 'video' && modules.length === 0) {
      toast({
        title: 'Invalid module configuration',
        description: 'Video courses must have at least 1 module',
        variant: 'destructive',
      });
      return;
    }
    
    // Calculate total duration
    const totalDuration = modules.reduce((total, module) => total + module.duration, 0);
    
    // Create slug from title
    const slug = values.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    
    // Prepare the course object
    const courseData: Course = {
      id: initialCourse?.id || `course-${Date.now()}`,
      slug,
      ...values,
      modules,
      totalDuration,
      creator: initialCourse?.creator || {
        id: 'current-user',
        name: 'Current User', // This would be the actual user in a real app
      },
      createdAt: initialCourse?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: values.isPublished 
        ? initialCourse?.publishedAt || new Date().toISOString()
        : undefined,
      viewCount: initialCourse?.viewCount || 0,
      completionCount: initialCourse?.completionCount || 0,
    };
    
    onSubmit(courseData);
    
    toast({
      title: initialCourse ? 'Course updated' : 'Course created',
      description: initialCourse
        ? 'Your course has been updated successfully'
        : 'Your new course has been created successfully',
    });
  };
  
  return (
    <div className="max-h-[calc(80vh-10rem)] overflow-hidden flex flex-col">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <ScrollArea className="h-[calc(80vh-14rem)] pr-4">
              <TabsContent value="basic" className="mt-0">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter course title" {...field} />
                          </FormControl>
                          <FormDescription>
                            The title of your course (min. 5 characters)
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
                          <FormLabel>Thumbnail URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/image.jpg" {...field} />
                          </FormControl>
                          <FormDescription>
                            URL to the course thumbnail image
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Summary</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief summary of the course" 
                            {...field} 
                            rows={2}
                          />
                        </FormControl>
                        <FormDescription>
                          A short summary (max. 200 characters)
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
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Detailed description of the course" 
                            {...field} 
                            rows={4}
                          />
                        </FormControl>
                        <FormDescription>
                          A detailed description (min. 10 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="format"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course Format</FormLabel>
                          <FormControl>
                            <RadioGroup 
                              onValueChange={field.onChange} 
                              value={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="video" id="format-video" />
                                <FormLabel htmlFor="format-video" className="cursor-pointer">
                                  Single Video Training
                                </FormLabel>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="series" id="format-series" />
                                <FormLabel htmlFor="format-series" className="cursor-pointer">
                                  Multi-Part Series
                                </FormLabel>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormDescription>
                            This determines how your course will be presented
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty Level</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select difficulty level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Beginner">Beginner</SelectItem>
                              <SelectItem value="Intermediate">Intermediate</SelectItem>
                              <SelectItem value="Advanced">Advanced</SelectItem>
                              <SelectItem value="All Levels">All Levels</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            The target skill level for this course
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={() => (
                      <FormItem>
                        <div className="mb-2">
                          <FormLabel>Categories</FormLabel>
                          <FormDescription>
                            Select at least one category for your course
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {categories.map((category) => (
                            <FormField
                              key={category}
                              control={form.control}
                              name="category"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={category}
                                    className="flex flex-row items-center space-x-2 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(category)}
                                        onCheckedChange={(checked) => {
                                          const currentValues = field.value || [];
                                          if (checked) {
                                            field.onChange([...currentValues, category]);
                                          } else {
                                            field.onChange(
                                              currentValues.filter((value) => value !== category)
                                            );
                                          }
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="cursor-pointer font-normal">
                                      {category}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="modules" className="mt-0">
                <ModuleEditor 
                  modules={modules}
                  setModules={setModules}
                  courseId={initialCourse?.id || 'new-course'}
                  format={watchFormat}
                />
              </TabsContent>
              
              <TabsContent value="settings" className="mt-0">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="isPublished"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Publish Course</FormLabel>
                            <FormDescription>
                              When enabled, the course will be visible to users
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="isGated"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Restrict Access</FormLabel>
                            <FormDescription>
                              When enabled, limit access based on membership level
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {watchIsGated && (
                    <FormField
                      control={form.control}
                      name="accessLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Access Level</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select access level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="free">Free</SelectItem>
                              <SelectItem value="vip">VIP</SelectItem>
                              <SelectItem value="premium">Premium</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Required membership level to access this course
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter tags separated by commas" 
                            value={field.value?.join(', ') || ''} 
                            onChange={(e) => {
                              const tags = e.target.value
                                .split(',')
                                .map(tag => tag.trim())
                                .filter(tag => tag !== '');
                              field.onChange(tags);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Optional tags to help categorize your course
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="ctaIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CTA IDs</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter CTA IDs separated by commas" 
                            value={field.value?.join(', ') || ''} 
                            onChange={(e) => {
                              const ctaIds = e.target.value
                                .split(',')
                                .map(id => id.trim())
                                .filter(id => id !== '');
                              field.onChange(ctaIds);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          IDs of CTAs to display on this course (from the CTA Manager)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className="mt-0">
                <div className="space-y-6">
                  <div className="rounded-lg border p-6">
                    <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                      {form.getValues('thumbnailUrl') ? (
                        <img 
                          src={form.getValues('thumbnailUrl')} 
                          alt="Course thumbnail" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          No thumbnail provided
                        </div>
                      )}
                    </div>
                    
                    <h2 className="text-xl font-semibold mb-2">{form.getValues('title') || 'Course Title'}</h2>
                    <p className="text-muted-foreground mb-4">{form.getValues('summary') || 'Course summary will appear here'}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {form.getValues('category')?.map(cat => (
                        <span key={cat} className="px-2 py-1 bg-primary/10 rounded-full text-sm">{cat}</span>
                      ))}
                      <span className="px-2 py-1 bg-secondary/10 rounded-full text-sm">{form.getValues('level')}</span>
                      <span className="px-2 py-1 bg-muted rounded-full text-sm">
                        {form.getValues('format') === 'video' ? 'Single Video' : 'Multi-Part Series'}
                      </span>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Course Description</h3>
                      <p className="text-sm text-muted-foreground">
                        {form.getValues('description') || 'Course description will appear here'}
                      </p>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Modules ({modules.length})</h3>
                      {modules.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No modules added yet</p>
                      ) : (
                        <div className="space-y-2">
                          {modules.map((module, index) => (
                            <div key={module.id} className="text-sm p-2 border rounded-md">
                              <span className="font-medium">{index + 1}. {module.title}</span>
                              {module.duration > 0 && (
                                <span className="text-muted-foreground ml-2">
                                  ({Math.floor(module.duration / 60)} min)
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </ScrollArea>
            
            <Separator />
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {initialCourse ? 'Update Course' : 'Create Course'}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}
