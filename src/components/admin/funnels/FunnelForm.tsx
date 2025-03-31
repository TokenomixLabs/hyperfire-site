
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Funnel, FunnelVisibility } from '@/types/funnel';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  slug: z.string().min(3, {
    message: "Slug must be at least 3 characters.",
  }).regex(/^[a-z0-9-]+$/, {
    message: "Slug can only contain lowercase letters, numbers, and hyphens.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  visibility: z.enum(['public', 'private', 'unlisted']),
  customRoute: z.string().optional(),
  thumbnailUrl: z.string().optional(),
});

interface FunnelFormProps {
  funnel: Funnel;
  onSave: (updatedFunnel: Partial<Funnel>) => void;
  isLoading?: boolean;
}

export default function FunnelForm({ funnel, onSave, isLoading = false }: FunnelFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: funnel.title || '',
      slug: funnel.slug || '',
      description: funnel.description || '',
      visibility: funnel.visibility || 'private',
      customRoute: funnel.customRoute || '',
      thumbnailUrl: funnel.thumbnailUrl || '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Funnel Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter funnel title" {...field} />
                </FormControl>
                <FormDescription>
                  This will be displayed as the main title of your funnel.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Funnel Slug</FormLabel>
                <FormControl>
                  <Input placeholder="enter-funnel-slug" {...field} />
                </FormControl>
                <FormDescription>
                  Used to create the URL. Only use lowercase letters, numbers, and hyphens.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your funnel" 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                This is for admin purposes and won't be displayed to users.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="visibility"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visibility</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private (requires link)</SelectItem>
                    <SelectItem value="unlisted">Unlisted (hidden from listings)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Controls who can access your funnel.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="customRoute"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Route (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="/vip-invite" {...field} />
                </FormControl>
                <FormDescription>
                  A custom URL path for this funnel (e.g., /vip-invite).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
            control={form.control}
            name="thumbnailUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thumbnail Image URL (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} />
                </FormControl>
                <FormDescription>
                  A preview image for this funnel. Leave empty to use default.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
            {isLoading ? "Saving..." : "Save Details"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
